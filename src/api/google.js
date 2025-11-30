import { getConfig } from "../utils/storage.js";
import { getApiReadyPrompt } from "../utils/promptUtils.js";
import { logDebug } from "../utils/logger.js";

/**
 * Generates an image using the Google Imagen API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess and onFailure callbacks.
 */
export async function generate(prompt, { onSuccess, onFailure }) {
  const config = await getConfig();
  const {
    model,
    googleApiKey,
    numberOfImages,
    aspectRatio,
    personGeneration,
    imageSize,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  const basePositive = typeof prompt === "string" ? prompt : "";

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  // For non-AI Horde providers:
  // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
  // when enabled and non-empty.
  const finalPrompt = hasValidNegative
    ? `${basePositive}, negative prompt: ${negText}`
    : basePositive;

  // Apply prompt cleaning on the fully-formed FinalPrompt
  const cleanPrompt = getApiReadyPrompt(finalPrompt, "google_api_final");

  // Debug-only diagnostics respecting the global logging toggle
  logDebug("GOOGLE", "Prompt construction", {
    path: "non-horde inline negative",
    basePositivePromptLength: basePositive.length,
    hasNegativePrompt: hasValidNegative,
    enableNegPrompt: negEnabled,
    negativePromptLength: hasValidNegative ? negText.length : 0,
    finalPromptLength: cleanPrompt.length,
    finalPromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
  });

  if (model.startsWith("gemini-")) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload = {
      contents: [{ parts: [{ text: cleanPrompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        candidateCount: parseInt(numberOfImages, 10),
        imageConfig: {
          aspectRatio: aspectRatio,
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
    const parameters = {
      sampleCount: parseInt(numberOfImages, 10),
      aspectRatio,
      personGeneration,
    };

    const isNewImagen =
      model.startsWith("imagen-3") || model.startsWith("imagen-4");

    if (model.includes("fast")) {
      // Fast models don't support imageSize
    } else if (isNewImagen) {
      // New Standard/Ultra models require string "1K" or "2K"
      const sizeNum = parseInt(imageSize, 10);
      parameters.imageSize = sizeNum >= 2048 ? "2K" : "1K";
    } else {
      // Legacy models expect number
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
