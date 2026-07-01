import { getConfig } from "../utils/storage";
import { clearCachedModels } from "../utils/cache";
import { getApiReadyPrompt } from "../utils/promptUtils";
import { logDebug, logInfo } from "../utils/logger";
import * as abortRegistry from "../utils/abortRegistry";

const POLLINATIONS_CURRENT_DEFAULT_MODEL = "zimage";
// Legacy Pollinations model names that were renamed to the current default.
// These are deliberate backward-compat aliases for obsolete catalog entries,
// not silent server-side fallbacks.
const POLLINATIONS_LEGACY_MODEL_ALIASES = new Set(["sana", "turbo"]);
const POLLINATIONS_GEN_ENDPOINT =
  "https://gen.pollinations.ai/v1/images/generations";
const POLLINATIONS_LEGACY_BASE = "https://image.pollinations.ai/prompt/";
const POLLINATIONS_REFERRER =
  "https://github.com/MasuRii/wtr-lab-novel-image-generator";

function normalizePollinationsModel(model) {
  const trimmedModel = typeof model === "string" ? model.trim() : "";
  if (
    !trimmedModel ||
    POLLINATIONS_LEGACY_MODEL_ALIASES.has(trimmedModel.toLowerCase())
  ) {
    return POLLINATIONS_CURRENT_DEFAULT_MODEL;
  }
  return trimmedModel;
}

/**
 * Parses a GM_xmlhttpRequest responseHeaders string (newline-delimited
 * "Name: value" pairs) into a lowercase-keyed lookup map.
 * @param {string} responseHeaders - Raw headers string from GM_xmlhttpRequest
 * @returns {Record<string, string>} Lowercase header name -> value
 */
export function parseResponseHeaders(responseHeaders) {
  const map = {};
  if (typeof responseHeaders !== "string" || responseHeaders.length === 0) {
    return map;
  }
  const lines = responseHeaders.split(/\r?\n/);
  for (const line of lines) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (name.length > 0) {
      map[name] = value;
    }
  }
  return map;
}

async function readResponseText(response) {
  if (response?.response && typeof response.response.text === "function") {
    return await response.response.text();
  }
  return response?.responseText || "";
}

function base64ToDataUrl(b64, mimeType) {
  return `data:${mimeType || "image/png"};base64,${b64}`;
}

/**
 * Extracts image result strings (data URLs or remote URLs) from an
 * OpenAI-compatible image generations response body.
 * @param {object} data - Parsed JSON response
 * @returns {string[]} Image URL/data-URL strings
 */
function extractGenImageUrls(data) {
  if (!data || !Array.isArray(data.data)) {
    return [];
  }
  return data.data
    .map((item) => {
      if (
        item &&
        typeof item.b64_json === "string" &&
        item.b64_json.length > 0
      ) {
        const outputFormat =
          typeof item.output_format === "string" &&
          item.output_format.length > 0
            ? `image/${item.output_format.replace(/^image\//, "")}`
            : "image/png";
        return base64ToDataUrl(item.b64_json, outputFormat);
      }
      if (item && typeof item.url === "string" && item.url.length > 0) {
        return item.url;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Fetches a remote image URL via GM_xmlhttpRequest and converts the response
 * blob to a self-contained data: URL using FileReader. This ensures history
 * always stores actual image content rather than ephemeral remote URLs that
 * may 404 or change. The request is tracked in the abort registry so cancel
 * behavior is preserved.
 *
 * @param {string} remoteUrl - The remote https:// image URL to fetch.
 * @param {number} myToken - The cancel token captured at generation start.
 * @returns {Promise<string>} A persistent data: URL.
 */
function fetchRemoteImageAsDataUrl(remoteUrl, myToken) {
  return new Promise((resolve, reject) => {
    const xhr = GM_xmlhttpRequest({
      method: "GET",
      url: remoteUrl,
      responseType: "blob",
      onload: (response) => {
        abortRegistry.untrackRequest(xhr);
        if (abortRegistry.getCancelToken() !== myToken) {
          reject(new Error("cancelled"));
          return;
        }
        if (response.status >= 200 && response.status < 300) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.error) {
              reject(
                new Error(
                  `Failed to encode image: ${
                    reader.error.message || "FileReader error"
                  }`,
                ),
              );
            } else {
              resolve(reader.result);
            }
          };
          reader.onerror = () => {
            reject(new Error("Failed to encode image with FileReader"));
          };
          reader.readAsDataURL(response.response);
        } else {
          reject(new Error(`Failed to fetch image (HTTP ${response.status})`));
        }
      },
      onerror: (error) => {
        abortRegistry.untrackRequest(xhr);
        if (abortRegistry.getCancelToken() !== myToken) {
          reject(new Error("cancelled"));
          return;
        }
        reject(
          new Error(`Network error fetching image: ${JSON.stringify(error)}`),
        );
      },
    });
    abortRegistry.trackRequest(xhr);
  });
}

/**
 * Determines whether a gen.pollinations.ai JSON error relates to an
 * invalid/unknown model so the cached model list can be refreshed.
 * @param {object} errorObj - The error object from the response envelope
 * @returns {boolean}
 */
function isGenModelError(errorObj) {
  const code = (errorObj?.code || "").toLowerCase();
  const message = (errorObj?.message || "").toLowerCase();
  return (
    code.includes("model") ||
    message.includes("model not found") ||
    message.includes("unknown model") ||
    message.includes("not a valid model")
  );
}

function buildLegacyUrl(cleanPrompt, finalModel, opts) {
  const params = new URLSearchParams();
  // Official 2026 Pollinations auth: identify the web app via referrer param.
  // The referrer is not an authentication token; it only identifies the
  // client on the free legacy endpoint.
  params.append("referrer", POLLINATIONS_REFERRER);
  params.append("model", finalModel);
  if (opts.hasValidNegative) {
    params.append("negative_prompt", opts.cleanNegativePrompt);
  }
  if (opts.width && opts.width > 0) {
    params.append("width", opts.width);
  }
  if (opts.height && opts.height > 0) {
    params.append("height", opts.height);
  }
  if (opts.seed) {
    params.append("seed", opts.seed);
  }
  if (opts.enhance) {
    params.append("enhance", "true");
  }
  if (opts.safe) {
    params.append("safe", "true");
  }
  if (opts.nologo) {
    params.append("nologo", "true");
  }
  if (opts.private) {
    params.append("private", "true");
  }
  const paramString = params.toString();
  return `${POLLINATIONS_LEGACY_BASE}${encodeURIComponent(cleanPrompt)}${paramString ? "?" + paramString : ""}`;
}

/**
 * Generates an image using the authenticated Pollinations gen API
 * (POST https://gen.pollinations.ai/v1/images/generations). This endpoint
 * enforces Bearer auth, honors the selected model, and accounts key usage.
 * Failures are reported explicitly; there is no fallback to the legacy
 * endpoint or to a different model.
 */
function generateViaGenEndpoint(
  finalModel,
  genPrompt,
  cleanPrompt,
  originalPrompt,
  width,
  height,
  token,
  { onSuccess, onFailure, onAuthFailure },
  myToken,
) {
  const url = POLLINATIONS_GEN_ENDPOINT;
  const payload = {
    model: finalModel,
    prompt: genPrompt,
    n: 1,
    size: `${width}x${height}`,
  };

  logInfo("POLLINATIONS", "Generating via authenticated gen endpoint", {
    endpoint: url,
    model: finalModel,
    size: payload.size,
  });

  const xhr = GM_xmlhttpRequest({
    method: "POST",
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify(payload),
    onload: async (response) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      const text = await readResponseText(response);

      if (response.status >= 200 && response.status < 300) {
        try {
          const data = JSON.parse(text);
          const imageUrls = extractGenImageUrls(data);
          if (imageUrls.length > 0) {
            // Convert any remote URLs to persistent data: URLs so history
            // stores actual image content, not ephemeral endpoints that 404.
            // b64_json responses are already data: URLs; only remote url
            // responses need a secondary fetch + FileReader conversion.
            try {
              const dataUrls = await Promise.all(
                imageUrls.map(async (imageUrl) => {
                  if (imageUrl.startsWith("data:")) {
                    return imageUrl;
                  }
                  return await fetchRemoteImageAsDataUrl(imageUrl, myToken);
                }),
              );
              if (abortRegistry.getCancelToken() !== myToken) {
                return;
              }
              onSuccess(dataUrls, cleanPrompt, "Pollinations", finalModel);
            } catch (fetchError) {
              if (abortRegistry.getCancelToken() !== myToken) {
                return;
              }
              onFailure(
                `Failed to preserve generated image: ${fetchError.message}`,
                originalPrompt,
                "Pollinations",
                finalModel,
              );
            }
          } else {
            onFailure(
              `Pollinations gen endpoint returned no usable image data: ${text}`,
              originalPrompt,
              "Pollinations",
              finalModel,
            );
          }
        } catch (parseError) {
          onFailure(
            `Failed to parse Pollinations gen response: ${parseError.message}`,
            originalPrompt,
            "Pollinations",
            finalModel,
          );
        }
        return;
      }

      // Error path: the gen endpoint returns a JSON error envelope shaped as
      // { success: false, error: { message, code }, status }. Parse it so
      // invalid models and auth failures are surfaced explicitly instead of
      // being masked by the legacy endpoint's silent fallback.
      let errorObj = null;
      let errorMessage = `Error ${response.status}: ${text}`;
      try {
        const parsed = JSON.parse(text);
        errorObj = parsed?.error || null;
        if (errorObj?.message) {
          errorMessage = errorObj.message;
        }
      } catch {
        // Non-JSON error body; keep the raw text message.
      }

      if (
        response.status === 401 ||
        response.status === 402 ||
        response.status === 403
      ) {
        onAuthFailure(errorMessage, originalPrompt);
        return;
      }

      if (isGenModelError(errorObj)) {
        clearCachedModels("pollinations");
        onFailure(
          `Model error: ${errorMessage}. Refreshing model list.`,
          originalPrompt,
          "Pollinations",
          finalModel,
        );
        return;
      }

      onFailure(errorMessage, originalPrompt, "Pollinations", finalModel);
    },
    onerror: (error) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      onFailure(JSON.stringify(error), originalPrompt, "Pollinations", finalModel);
    },
  });
  abortRegistry.trackRequest(xhr);
}

/**
 * Generates an image using the legacy free Pollinations endpoint
 * (GET https://image.pollinations.ai/prompt/...). This path is used only
 * without an API key. The response is verified via the X-Model-Used header:
 * if the server used a different model than requested (silent fallback), the
 * generation fails explicitly instead of reporting success with the wrong
 * model.
 */
function generateViaLegacyEndpoint(
  finalModel,
  cleanPrompt,
  originalPrompt,
  opts,
  { onSuccess, onFailure, onAuthFailure },
  myToken,
) {
  const url = buildLegacyUrl(cleanPrompt, finalModel, opts);

  logInfo("POLLINATIONS", "Generating via legacy free endpoint", {
    endpoint: "image.pollinations.ai",
    model: finalModel,
  });

  const xhr = GM_xmlhttpRequest({
    method: "GET",
    url: url,
    responseType: "blob",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      if (response.status >= 200 && response.status < 300) {
        // Verify the server actually used the requested model. The legacy
        // endpoint silently falls back to a free default (e.g. "sana") for
        // unauthenticated or unauthorized requests, returning HTTP 200 with
        // the wrong model. Treat any mismatch as a hard failure rather than
        // presenting the wrong image as the requested model.
        const headers = parseResponseHeaders(response.responseHeaders);
        const modelUsed = (headers["x-model-used"] || "").trim().toLowerCase();
        if (modelUsed && modelUsed !== finalModel.toLowerCase()) {
          onFailure(
            `Pollinations used "${modelUsed}" instead of the requested model "${finalModel}". ` +
              `The selected model likely requires an API key (paid tier). Add a Pollinations API key in settings to use "${finalModel}".`,
            originalPrompt,
            "Pollinations",
            finalModel,
          );
          return;
        }

        // Convert the blob to a persistent data: URL so history stores
        // actual image content, not a session-only blob: URL or a
        // regeneration endpoint URL that may 404 or yield a different image.
        const reader = new FileReader();
        reader.onloadend = () => {
          if (abortRegistry.getCancelToken() !== myToken) {
            return;
          }
          if (reader.error) {
            onFailure(
              `Failed to encode generated image: ${
                reader.error.message || "FileReader error"
              }`,
              originalPrompt,
              "Pollinations",
              finalModel,
            );
            return;
          }
          onSuccess([reader.result], cleanPrompt, "Pollinations", finalModel);
        };
        reader.onerror = () => {
          if (abortRegistry.getCancelToken() !== myToken) {
            return;
          }
          onFailure(
            "Failed to encode generated image",
            originalPrompt,
            "Pollinations",
            finalModel,
          );
        };
        reader.readAsDataURL(response.response);
      } else {
        const text = await readResponseText(response);
        if (text.toLowerCase().includes("model not found")) {
          onFailure(
            `Model error: ${text}. Refreshing model list.`,
            originalPrompt,
            "Pollinations",
            finalModel,
          );
          clearCachedModels("pollinations");
          return;
        }

        // Check for authentication/payment requirements in any status code.
        // Restricted Pollinations models may direct users to
        // enter.pollinations.ai for authentication.
        if (
          response.status === 402 ||
          (response.status === 403 &&
            text.includes("enter.pollinations.ai")) ||
          text.includes("enter.pollinations.ai") ||
          (text.toLowerCase().includes("authentication") &&
            text.toLowerCase().includes("enter.pollinations.ai"))
        ) {
          try {
            const errorData = JSON.parse(text);
            onAuthFailure(
              errorData.message || errorData.error || text,
              originalPrompt,
            );
            return;
          } catch (e) {
            // If JSON parsing fails, still trigger auth modal
            onAuthFailure(text, originalPrompt);
            return;
          }
        }

        onFailure(
          `Error ${response.status}: ${text}`,
          originalPrompt,
          "Pollinations",
          finalModel,
        );
      }
    },
    onerror: (error) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      onFailure(JSON.stringify(error), originalPrompt, "Pollinations", finalModel);
    },
  });
  abortRegistry.trackRequest(xhr);
}

/**
 * Generates an image using the Pollinations.ai API.
 *
 * With an API key: uses POST https://gen.pollinations.ai/v1/images/generations
 * (OpenAI-compatible), which enforces Bearer auth, honors the selected model,
 * and accounts key usage on the dashboard.
 *
 * Without an API key: uses the legacy free GET image.pollinations.ai/prompt
 * endpoint, but verifies the X-Model-Used response header so a silent
 * fallback to a different model is reported as a failure, never as success.
 *
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess, onFailure, and onAuthFailure callbacks.
 */
export async function generate(
  prompt,
  { onSuccess, onFailure, onAuthFailure },
) {
  const config = await getConfig();
  const {
    pollinationsModel: model,
    pollinationsToken,
    pollinationsWidth,
    pollinationsHeight,
    pollinationsSeed,
    pollinationsEnhance,
    pollinationsSafe,
    pollinationsNologo,
    pollinationsPrivate,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  // Base positive prompt from queue (StyledPrompt or EnhancedPrompt).
  const basePositive = typeof prompt === "string" ? prompt : "";

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const cleanNegativePrompt = getApiReadyPrompt(
    negText,
    "pollinations_negative_prompt",
  );
  const hasValidNegative = negEnabled && cleanNegativePrompt.length > 0;
  const cleanPrompt = getApiReadyPrompt(basePositive, "pollinations_api_prompt");
  const finalModel = normalizePollinationsModel(model);
  const hasToken =
    typeof pollinationsToken === "string" &&
    pollinationsToken.trim().length > 0;
  const myToken = abortRegistry.getCancelToken();

  logDebug("POLLINATIONS", "Model configuration", {
    originalModel: model,
    finalModel: finalModel,
    authenticated: hasToken,
    endpoint: hasToken ? "gen" : "legacy",
  });
  logDebug("POLLINATIONS", "Prompt construction", {
    path: hasToken
      ? "gen_inline_negative_prompt"
      : "positive_path_prompt_with_negative_prompt_query",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? cleanNegativePrompt.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  const callbacks = { onSuccess, onFailure, onAuthFailure };

  if (hasToken) {
    // Authenticated path: the gen endpoint honors the model and accounts the
    // key. The OpenAI-compatible image generations API has no dedicated
    // negative_prompt field, so the negative prompt is inlined into the
    // prompt text (mirroring the OpenAI-compatible provider behavior).
    const genPrompt = hasValidNegative
      ? getApiReadyPrompt(
          `${cleanPrompt}, negative prompt: ${cleanNegativePrompt}`,
          "pollinations_gen_prompt",
        )
      : cleanPrompt;
    generateViaGenEndpoint(
      finalModel,
      genPrompt,
      cleanPrompt,
      prompt,
      pollinationsWidth,
      pollinationsHeight,
      pollinationsToken.trim(),
      callbacks,
      myToken,
    );
  } else {
    generateViaLegacyEndpoint(
      finalModel,
      cleanPrompt,
      prompt,
      {
        hasValidNegative,
        cleanNegativePrompt,
        width: pollinationsWidth,
        height: pollinationsHeight,
        seed: pollinationsSeed,
        enhance: pollinationsEnhance,
        safe: pollinationsSafe,
        nologo: pollinationsNologo,
        private: pollinationsPrivate,
      },
      callbacks,
      myToken,
    );
  }
}
