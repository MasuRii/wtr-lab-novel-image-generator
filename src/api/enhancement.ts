import { logInfo, logDebug, logError } from "../utils/logger";
import { getApiReadyPrompt } from "../utils/promptUtils";
import * as abortRegistry from "../utils/abortRegistry";

/**
 * Extracts the Retry-After delay (in milliseconds) from an HTTP response.
 * Returns null when no valid Retry-After header is present.
 * @param {object} response - GM_xmlhttpRequest response object
 * @returns {number|null} Delay in ms, or null
 */
export function parseRetryAfter(response) {
  if (!response) {
    return null;
  }
  const headers = response.responseHeaders || "";
  const match = headers.match(/^retry-after:\s*(\d+)/im);
  if (match) {
    return Math.min(parseInt(match[1], 10) * 1000, 60000);
  }
  return null;
}

/**
 * Detects if response content is HTML instead of JSON.
 * Mirrors the pattern from openAI.ts for consistent error handling.
 * @param {string} responseText - The response text to check
 * @returns {boolean} - True if content appears to be HTML
 */
function isHtmlResponse(responseText) {
  const trimmed = responseText.trim().toLowerCase();
  return (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<!doctype") ||
    trimmed.includes("<html>") ||
    trimmed.startsWith("<!") ||
    trimmed.startsWith("<head>") ||
    trimmed.includes("<title>")
  );
}

/**
 * Safely parses JSON with enhanced error handling.
 * @param {string} responseText - The response text to parse
 * @param {string} endpointUrl - The endpoint URL for context in error messages
 * @returns {object} - Parsed JSON object
 */
function safeJsonParse(responseText, endpointUrl) {
  try {
    return JSON.parse(responseText);
  } catch (e) {
    if (isHtmlResponse(responseText)) {
      throw new Error(
        `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`,
      );
    }
    throw new Error(
      `JSON parsing error: ${e.message}. This may indicate server issues or malformed response.`,
    );
  }
}

/**
 * Determines if the selected image provider's built-in enhancement should be used.
 * This is provider-agnostic: it checks the IMAGE provider (e.g., Pollinations)
 * for built-in enhancement, not the enhancement endpoint provider.
 * @param {string} provider - The name of the image generation provider.
 * @param {object} config - The current script configuration.
 * @returns {boolean} - True if provider enhancement should be used.
 */
export function shouldUseProviderEnhancement(provider, config) {
  logDebug("ENHANCEMENT", "Checking provider priority for enhancement", {
    provider,
    config,
  });

  const shouldUse = (() => {
    if (provider === "Pollinations") {
      const result = config.pollinationsEnhance;
      logInfo(
        "ENHANCEMENT",
        `Provider ${provider} has built-in enhancement: ${result}`,
      );
      return result;
    }
    logInfo(
      "ENHANCEMENT",
      `Provider ${provider} does not have built-in enhancement`,
    );
    return false;
  })();

  logDebug("ENHANCEMENT", "Provider priority decision completed", {
    shouldUseProviderEnhancement: shouldUse,
    willUseExternalAI:
      config.enhancementEnabled &&
      config.enhancementBaseUrl &&
      (!shouldUse || config.enhancementOverrideProvider),
  });

  return shouldUse;
}

/**
 * Enhances a given prompt using an OpenAI-compatible /chat/completions endpoint
 * with robust retry and fallback logic.
 *
 * Supports any OpenAI-compatible provider (cloud or local) including OpenAI,
 * OpenRouter, Ollama, LM Studio, and vLLM.
 *
 * @param {string} originalPrompt - The user's original prompt.
 * @param {object} config - The current script configuration.
 * @returns {Promise<string>} The enhanced prompt.
 */
export async function enhancePrompt(originalPrompt, config) {
  const startTime = Date.now();
  const myToken = abortRegistry.getCancelToken();

  const {
    enhancementBaseUrl: baseUrl,
    enhancementApiKey: apiKey,
    enhancementModel: rawModel,
    enhancementTemplate: userTemplateOverride,
    mainPromptStyle,
    subPromptStyle,
    customStyleEnabled,
    customStyleText,
    enhancementMaxRetriesPerModel = 2,
    enhancementRetryDelay = 1000,
    enhancementAlwaysFallback = true,
  } = config;

  const model = typeof rawModel === "string" ? rawModel.trim() : "";
  const endpointUrl =
    typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";

  // Build a style-respecting instruction layer:
  // - If custom style is enabled, explicitly tell the model to preserve and reinforce it.
  // - Else if main/sub styles are set, tell the model to keep them.
  // - Otherwise, no extra constraint.
  const styleDirectives = (() => {
    if (
      customStyleEnabled &&
      customStyleText &&
      customStyleText.trim().length > 0
    ) {
      return [
        `The user has explicitly chosen this style: "${customStyleText.trim()}".`,
        `You MUST preserve and honor this exact style and aesthetic.`,
        `Do NOT replace it with "photorealistic", "professional photography", or any other conflicting medium unless the user text itself asks for that.`,
        `All enhancements must be consistent with this declared style.`,
      ].join(" ");
    }

    if (mainPromptStyle && mainPromptStyle !== "None") {
      if (subPromptStyle && subPromptStyle !== "none") {
        return [
          `The user has selected main style "${mainPromptStyle}" and sub-style "${subPromptStyle}".`,
          `You MUST preserve and honor these styles as the primary aesthetic.`,
          `Do NOT override them with photorealistic/technical photography language unless these styles explicitly imply it.`,
          `All enhancements must be consistent with these selected styles.`,
        ].join(" ");
      }
      return [
        `The user has selected main style "${mainPromptStyle}".`,
        `You MUST preserve and honor this style as the primary aesthetic.`,
        `Do NOT override them with photorealistic/technical photography language unless this style explicitly implies it.`,
        `All enhancements must be consistent with this selected style.`,
      ].join(" ");
    }

    return "";
  })();

  // Base template: prefer user override from UI textarea, otherwise use config default.
  const baseTemplate =
    userTemplateOverride && userTemplateOverride.trim().length > 0
      ? userTemplateOverride.trim()
      : (config.enhancementTemplate || "").trim();

  // Merge base template and style directives into the system message.
  const mergedTemplate = [
    baseTemplate ||
      "Extract visual, image-ready elements from the text without changing its intended style.",
    styleDirectives,
  ]
    .filter(Boolean)
    .join(" ");

  if (!endpointUrl) {
    throw new Error("Enhancement endpoint URL is required for prompt enhancement.");
  }

  if (!model) {
    throw new Error("Enhancement model is required for prompt enhancement.");
  }

  logInfo("ENHANCEMENT", "Starting prompt enhancement via OpenAI-compatible endpoint", {
    originalLength: originalPrompt.length,
    endpointUrl,
    model,
    maxRetries: enhancementMaxRetriesPerModel,
    apiKeyPresent: Boolean(apiKey),
  });

  let lastError = null;
  let attempts = 0;

  while (attempts < enhancementMaxRetriesPerModel) {
    attempts++;

    try {
      const enhancedText = await attemptEnhancement(
        originalPrompt,
        model,
        mergedTemplate,
        endpointUrl,
        apiKey,
        attempts,
        enhancementMaxRetriesPerModel,
        myToken,
      );

      const duration = Date.now() - startTime;
      logInfo("ENHANCEMENT", "Prompt enhancement successful", {
        model,
        attempts,
        duration,
      });

      return enhancedText;
    } catch (error) {
      lastError = error;

      // Don't retry if the request was cancelled by the user
      if (abortRegistry.getCancelToken() !== myToken) {
        throw error;
      }

      logInfo(
        "ENHANCEMENT",
        `Enhancement failed (attempt ${attempts}/${enhancementMaxRetriesPerModel})`,
        {
          model,
          attemptNumber: attempts,
          error: error.message,
        },
      );

      // If this is not the last retry, wait before retrying
      if (attempts < enhancementMaxRetriesPerModel) {
        // Use Retry-After header value if available (e.g. from 429), otherwise default delay
        const delay =
          error.retryAfter !== undefined && error.retryAfter !== null
            ? error.retryAfter
            : enhancementRetryDelay;
        logInfo("ENHANCEMENT", `Retrying after delay`, {
          retryDelay: delay,
          nextAttempt: attempts + 1,
          isRateLimited: error.status === 429,
        });
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  const duration = Date.now() - startTime;
  logError(
    "ENHANCEMENT",
    "All retries exhausted for prompt enhancement",
    {
      totalAttempts: attempts,
      duration,
      lastError: lastError?.message,
      originalPrompt:
        originalPrompt.substring(0, 100) +
        (originalPrompt.length > 100 ? "..." : ""),
    },
  );

  if (enhancementAlwaysFallback) {
    const fallbackPrompt = createBasicEnhancementFallback(originalPrompt);
    logInfo("ENHANCEMENT", "Providing basic enhancement fallback", {
      fallbackType: "basic_enhancement",
      originalLength: originalPrompt.length,
      fallbackLength: fallbackPrompt.length,
    });
    return fallbackPrompt;
  }

  throw new Error(
    `All enhancement attempts failed. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Attempts enhancement with the configured model via /chat/completions.
 */
async function attemptEnhancement(
  originalPrompt,
  model,
  template,
  endpointUrl,
  apiKey,
  _attemptNumber,
  _maxRetries,
  myToken,
) {
  const cleanPrompt = getApiReadyPrompt(originalPrompt, "enhancement");

  const url = `${endpointUrl}/chat/completions`;

  const requestData = {
    model,
    messages: [
      { role: "system", content: template },
      { role: "user", content: cleanPrompt },
    ],
    temperature: 0.7,
    stream: false,
  };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Send Bearer auth only when an API key is configured (supports no-auth local servers).
  if (apiKey && apiKey.trim().length > 0) {
    headers["Authorization"] = `Bearer ${apiKey.trim()}`;
  }

  return new Promise((resolve, reject) => {
    const timeout = 45000;

    const xhr = GM_xmlhttpRequest({
      method: "POST",
      url,
      headers,
      data: JSON.stringify(requestData),
      timeout,
      onload: (response) => {
        abortRegistry.untrackRequest(xhr);
        if (abortRegistry.getCancelToken() !== myToken) {
          reject(new Error("Request canceled"));
          return;
        }

        // Handle HTTP 429 rate-limiting with Retry-After support
        if (response.status === 429) {
          const retryAfter = parseRetryAfter(response);
          reject(
            Object.assign(new Error("Rate limited (429)"), {
              retryable: true,
              retryAfter,
              status: 429,
            }),
          );
          return;
        }

        try {
          if (!response.responseText) {
            throw new Error("Empty response received from enhancement endpoint");
          }

          const data = safeJsonParse(response.responseText, endpointUrl);

          // Check for OpenAI-compatible error shape
          if (data.error) {
            throw new Error(
              data.error.message || "Enhancement API error",
            );
          }

          const content = data.choices?.[0]?.message?.content;
          if (content && typeof content === "string" && content.trim().length > 0) {
            const enhancedText = content.trim();
            const cleanedText = enhancedText.replace(/^["']|["']$/g, "");
            resolve(cleanedText);
          } else {
            throw new Error("No enhancement result received from endpoint");
          }
        } catch (e) {
          reject(e);
        }
      },
      onerror: () => {
        abortRegistry.untrackRequest(xhr);
        if (abortRegistry.getCancelToken() !== myToken) {
          reject(new Error("Request canceled"));
          return;
        }
        reject(new Error("Network error during enhancement request."));
      },
      ontimeout: () => {
        abortRegistry.untrackRequest(xhr);
        if (abortRegistry.getCancelToken() !== myToken) {
          reject(new Error("Request canceled"));
          return;
        }
        reject(
          new Error(
            `Enhancement request timed out after ${timeout / 1000} seconds.`,
          ),
        );
      },
    });
    abortRegistry.trackRequest(xhr);
  });
}

/**
 * Creates a basic enhancement fallback when all retries fail.
 * Provider-agnostic heuristic-based enhancement.
 */
function createBasicEnhancementFallback(originalPrompt) {
  let enhanced = originalPrompt;

  const qualityBoosters = [
    "highly detailed",
    "sharp focus",
    "8K resolution",
    "masterpiece",
  ];

  const hasQualityTerms = qualityBoosters.some((term) =>
    enhanced.toLowerCase().includes(term.toLowerCase()),
  );

  if (!hasQualityTerms) {
    enhanced += ", " + qualityBoosters.join(", ");
  }

  enhanced = enhanced.replace(/,+/g, ",").replace(/,\s*$/, "");

  return enhanced;
}

/**
 * Utility function to sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
