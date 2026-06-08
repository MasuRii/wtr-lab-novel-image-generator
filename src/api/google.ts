import { getConfig } from "../utils/storage";
import { getApiReadyPrompt } from "../utils/promptUtils";
import { logDebug } from "../utils/logger";

const GOOGLE_GEMINI_IMAGE_MODEL_ALIASES = {
  "gemini-3-pro-image-preview": "gemini-3-pro-image",
  "models/gemini-3-pro-image-preview": "gemini-3-pro-image",
};

const GOOGLE_GEMINI_IMAGE_MODELS = new Set([
  "gemini-3.1-flash-image",
  "gemini-3-pro-image",
  "gemini-2.5-flash-image",
]);

function normalizeGoogleModel(rawModel) {
  const modelName = typeof rawModel === "string" ? rawModel.trim() : "";
  const withoutPrefix = modelName.startsWith("models/")
    ? modelName.substring(7)
    : modelName;

  return GOOGLE_GEMINI_IMAGE_MODEL_ALIASES[modelName] ||
    GOOGLE_GEMINI_IMAGE_MODEL_ALIASES[withoutPrefix] ||
    withoutPrefix ||
    "imagen-4.0-generate-001";
}

function isGeminiImageModel(model) {
  return model.startsWith("gemini-") || GOOGLE_GEMINI_IMAGE_MODELS.has(model);
}

function getImageSizeLabel(imageSize) {
  const sizeNum = parseInt(imageSize, 10);
  return sizeNum >= 2048 ? "2K" : "1K";
}

function getPromptWithInlineNegative(prompt, globalNegPrompt, enableNegPrompt) {
  const basePositive = typeof prompt === "string" ? prompt : "";
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = Boolean(enableNegPrompt) && negText.length > 0;
  const finalPrompt = hasValidNegative
    ? `${basePositive}, negative prompt: ${negText}`
    : basePositive;

  return {
    basePositive,
    cleanPrompt: getApiReadyPrompt(finalPrompt, "google_api_final"),
    hasValidNegative,
    negText,
  };
}

/**
 * Generates an image using the Google Imagen or Gemini image generation API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess and onFailure callbacks.
 */
export async function generate(prompt, { onSuccess, onFailure }) {
  const config = await getConfig();
  const {
    model: configuredModel,
    googleApiKey,
    numberOfImages,
    aspectRatio,
    personGeneration,
    imageSize,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  const model = normalizeGoogleModel(configuredModel);
  const { basePositive, cleanPrompt, hasValidNegative, negText } =
    getPromptWithInlineNegative(prompt, globalNegPrompt, enableNegPrompt);

  // Debug-only diagnostics respecting the global logging toggle
  logDebug("GOOGLE", "Prompt construction", {
    path: "google_provider_prompt",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: Boolean(enableNegPrompt),
    negativePromptLength: hasValidNegative ? negText.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    configuredModel,
    normalizedModel: model,
  });

  if (isGeminiImageModel(model)) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
    const imageConfig: any = {
      aspectRatio: aspectRatio,
      imageSize: getImageSizeLabel(imageSize),
    };
    const payload = {
      contents: [{ parts: [{ text: cleanPrompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        responseFormat: {
          image: imageConfig,
        },
      },
    };

    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "x-goog-api-key": googleApiKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload),
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);
          if (data.error) {
            throw new Error(JSON.stringify(data.error));
          }
          if (
            !data.candidates ||
            !data.candidates[0] ||
            !data.candidates[0].content ||
            !data.candidates[0].content.parts
          ) {
            throw new Error("No image data found in response");
          }
          const imageUrls = data.candidates[0].content.parts
            .filter((p) => p.inlineData && p.inlineData.data)
            .map(
              (p) =>
                `data:${p.inlineData.mimeType || "image/png"};base64,${p.inlineData.data}`,
            );
          onSuccess(imageUrls, cleanPrompt, "Google", model);
        } catch (e) {
          onFailure(e.message, prompt, "Google");
        }
      },
      onerror: (error) => onFailure(JSON.stringify(error), prompt, "Google"),
    });
  } else {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;
    const parameters: any = {
      sampleCount: parseInt(numberOfImages, 10),
      aspectRatio,
      personGeneration,
    };

    const isNewImagen =
      model.startsWith("imagen-3") || model.startsWith("imagen-4");

    if (model.includes("fast")) {
      // Fast Imagen models don't support imageSize.
    } else if (isNewImagen) {
      parameters.imageSize = getImageSizeLabel(imageSize);
    } else {
      // Legacy/unverified models may still expect a numeric imageSize.
      parameters.imageSize = parseInt(imageSize, 10);
    }

    GM_xmlhttpRequest({
      method: "POST",
      url,
      headers: {
        "x-goog-api-key": googleApiKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        instances: [{ prompt: cleanPrompt }],
        parameters,
      }),
      onload: (response) => {
        try {
          const data = JSON.parse(response.responseText);
          if (data.error) {
            throw new Error(JSON.stringify(data.error));
          }
          const imageUrls = data.predictions.map(
            (p) => `data:image/png;base64,${p.bytesB64Encoded}`,
          );
          // Pass the exact FinalPrompt string used for the API to the viewer/history
          onSuccess(imageUrls, cleanPrompt, "Google", model);
        } catch (e) {
          onFailure(e.message, prompt, "Google");
        }
      },
      onerror: (error) => onFailure(JSON.stringify(error), prompt, "Google"),
    });
  }
}
