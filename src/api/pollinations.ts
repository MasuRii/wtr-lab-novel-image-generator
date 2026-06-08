import { getConfig } from "../utils/storage";
import { clearCachedModels } from "../utils/cache";
import { getApiReadyPrompt } from "../utils/promptUtils";
import { logDebug } from "../utils/logger";

const POLLINATIONS_CURRENT_DEFAULT_MODEL = "sana";
const POLLINATIONS_LEGACY_MODEL_ALIASES = new Set(["flux", "turbo"]);

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

async function readResponseText(response) {
  if (response?.response && typeof response.response.text === "function") {
    return await response.response.text();
  }
  return response?.responseText || "";
}

/**
 * Generates an image using the Pollinations.ai API.
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
  // Pollinations now accepts negative prompts as the source-backed
  // negative_prompt query parameter, so keep the path prompt positive-only.
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

  // Debug logging to track model configuration and prompt construction
  logDebug("POLLINATIONS", "Model configuration", {
    originalModel: model,
    finalModel: finalModel,
  });
  logDebug("POLLINATIONS", "Prompt construction", {
    path: "positive_path_prompt_with_negative_prompt_query",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? cleanNegativePrompt.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  const params = new URLSearchParams();
  if (pollinationsToken) {
    params.append("token", pollinationsToken);
  }
  params.append("model", finalModel);
  if (hasValidNegative) {
    params.append("negative_prompt", cleanNegativePrompt);
  }
  if (pollinationsWidth && pollinationsWidth > 0) {
    params.append("width", pollinationsWidth);
  }
  if (pollinationsHeight && pollinationsHeight > 0) {
    params.append("height", pollinationsHeight);
  }
  if (pollinationsSeed) {
    params.append("seed", pollinationsSeed);
  }
  if (pollinationsEnhance) {
    params.append("enhance", "true");
  }
  if (pollinationsSafe) {
    params.append("safe", "true");
  }
  if (pollinationsNologo) {
    params.append("nologo", "true");
  }
  if (pollinationsPrivate) {
    params.append("nofeed", "true");
  }

  const paramString = params.toString();
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}${paramString ? "?" + paramString : ""}`;

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    responseType: "blob",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      if (response.status >= 200 && response.status < 300) {
        const blobUrl = URL.createObjectURL(response.response);
        // Pass the exact FinalPrompt string used for the API to the viewer/history
        onSuccess([blobUrl], cleanPrompt, "Pollinations", finalModel, [url]);
      } else {
        const text = await readResponseText(response);
        if (text.toLowerCase().includes("model not found")) {
          onFailure(
            `Model error: ${text}. Refreshing model list.`,
            prompt,
            "Pollinations",
            finalModel,
          );
          clearCachedModels("pollinations");
          return;
        }

        // Check for authentication/payment requirements in any status code.
        // Restricted Pollinations models may direct users to auth.pollinations.ai
        // or enter.pollinations.ai depending on the current service path.
        if (
          response.status === 402 ||
          (response.status === 403 && text.includes("auth.pollinations.ai")) ||
          text.includes("enter.pollinations.ai") ||
          (text.toLowerCase().includes("authentication") &&
            text.toLowerCase().includes("auth.pollinations.ai"))
        ) {
          try {
            const errorData = JSON.parse(text);
            onAuthFailure(errorData.message || errorData.error || text, prompt);
            return;
          } catch (e) {
            // If JSON parsing fails, still trigger auth modal
            onAuthFailure(text, prompt);
            return;
          }
        }

        onFailure(
          `Error ${response.status}: ${text}`,
          prompt,
          "Pollinations",
          finalModel,
        );
      }
    },
    onerror: (error) =>
      onFailure(JSON.stringify(error), prompt, "Pollinations", finalModel),
  });
}
