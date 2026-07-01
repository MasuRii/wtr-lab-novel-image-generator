import { getConfig } from "../utils/storage";
import { clearCachedModels } from "../utils/cache";
import { getApiReadyPrompt } from "../utils/promptUtils";
import { logInfo, logDebug, logError } from "../utils/logger";
import * as abortRegistry from "../utils/abortRegistry";

const AI_HORDE_CLIENT_AGENT =
  "WTR-Lab-Novel-Image-Generator:6.2.0:https://github.com/MasuRii/wtr-lab-novel-image-generator";
const AI_HORDE_API_BASE = "https://aihorde.net/api/v2";

function getAIHordeHeaders(aiHordeApiKey = "0000000000") {
  return {
    "Content-Type": "application/json",
    apikey: aiHordeApiKey || "0000000000",
    "Client-Agent": AI_HORDE_CLIENT_AGENT,
  };
}

function parseJsonResponse(response) {
  return JSON.parse(response.responseText || "{}");
}

function getAIHordeImageUrl(imageData) {
  if (typeof imageData !== "string" || !imageData.trim()) {
    return null;
  }

  const value = imageData.trim();
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return `data:image/webp;base64,${value}`;
}

function fetchFinalStatus(
  id,
  prompt,
  startTime,
  model,
  aiHordeApiKey,
  { onSuccess, onFailure, updateStatus },
  myToken,
) {
  const xhr = GM_xmlhttpRequest({
    method: "GET",
    url: `${AI_HORDE_API_BASE}/generate/status/${id}`,
    headers: getAIHordeHeaders(aiHordeApiKey),
    onload: (response) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      try {
        const data = parseJsonResponse(response);
        const finalElapsedTime = Date.now() - startTime;
        logDebug("AIHORDE", "AI Horde final status response received", {
          generationId: id,
          responseData: data,
          isDone: data.done,
          generations: data.generations ? data.generations.length : 0,
          totalElapsedTime: finalElapsedTime,
        });

        if (!data.generations || data.generations.length === 0) {
          logError("AIHORDE", "Generation completed but no images returned", {
            generationId: id,
            data: data,
          });
          onFailure(
            "Generation completed but no images were returned",
            prompt,
            "AIHorde",
          );
          return;
        }

        updateStatus("Completed!");

        const imageUrls = data.generations
          .map((gen) => getAIHordeImageUrl(gen.img))
          .filter(Boolean);

        if (imageUrls.length === 0) {
          onFailure(
            "Generation completed but no usable image data was returned",
            prompt,
            "AIHorde",
          );
          return;
        }

        logInfo("AIHORDE", "AI Horde generation completed successfully", {
          generationId: id,
          imagesGenerated: imageUrls.length,
          totalElapsedTime: finalElapsedTime,
        });
        onSuccess(imageUrls, prompt, "AIHorde", model);
      } catch (e) {
        logError("AIHORDE", "Error retrieving AI Horde final status", {
          generationId: id,
          error: e.message,
          responseText: response.responseText,
        });
        onFailure(`Error retrieving results: ${e.message}`, prompt, "AIHorde");
      }
    },
    onerror: (error) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      logError("AIHORDE", "Failed to retrieve results from AI Horde", {
        generationId: id,
        error: error,
      });
      onFailure("Failed to retrieve results from AI Horde.", prompt, "AIHorde");
    },
  });
  abortRegistry.trackRequest(xhr);
}

function checkStatus(
  id,
  prompt,
  startTime,
  model,
  aiHordeApiKey,
  { onSuccess, onFailure, updateStatus },
  myToken,
) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  logDebug("AIHORDE", "Checking AI Horde generation status", {
    generationId: id,
    elapsedTimeMs: elapsedTime,
    promptPreview:
      prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
  });

  const xhr = GM_xmlhttpRequest({
    method: "GET",
    url: `${AI_HORDE_API_BASE}/generate/check/${id}`,
    headers: getAIHordeHeaders(aiHordeApiKey),
    onload: (response) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      try {
        const data = parseJsonResponse(response);
        logDebug("AIHORDE", "AI Horde check response received", {
          generationId: id,
          responseData: data,
          isDone: data.done,
          queuePosition: data.queue_position,
          processing: data.processing,
          waitTime: data.wait_time,
        });

        if (data.done) {
          fetchFinalStatus(id, prompt, startTime, model, aiHordeApiKey, {
            onSuccess,
            onFailure,
            updateStatus,
          }, myToken);
          return;
        }

        let statusText = "Waiting for worker...";
        if (data.queue_position > 0) {
          statusText = `Queue: ${data.queue_position}. Est: ${data.wait_time}s.`;
          logInfo("AIHORDE", "AI Horde generation waiting in queue", {
            generationId: id,
            queuePosition: data.queue_position,
            estimatedWaitTime: data.wait_time,
            statusText: statusText,
          });
        } else if (data.processing > 0) {
          // More user-friendly status with elapsed time
          const elapsedSeconds = Math.floor(elapsedTime / 1000);
          const minutes = Math.floor(elapsedSeconds / 60);
          const seconds = elapsedSeconds % 60;
          const timeStr =
            minutes > 0
              ? `${minutes}:${seconds.toString().padStart(2, "0")}`
              : `${seconds}s`;

          statusText = `AI Horde: Generating... (${timeStr})`;
          logInfo("AIHORDE", "AI Horde generation actively processing", {
            generationId: id,
            processingWorkers: data.processing,
            elapsedTime: timeStr,
            statusText: statusText,
          });
        } else {
          logInfo("AIHORDE", "AI Horde generation waiting for worker", {
            generationId: id,
            statusText: statusText,
          });
        }

        // Call updateStatus with the detailed status information
        // This ensures the status widget shows the specific AI Horde status
        logDebug("AIHORDE", "Calling updateStatus callback", {
          generationId: id,
          statusText: statusText,
          elapsedTimeMs: elapsedTime,
        });

        updateStatus(statusText);

        const timer = setTimeout(
          () =>
            checkStatus(id, prompt, startTime, model, aiHordeApiKey, {
              onSuccess,
              onFailure,
              updateStatus,
            }, myToken),
          5000,
        );
        abortRegistry.trackTimer(timer);
      } catch (e) {
        logError("AIHORDE", "Error checking AI Horde status", {
          generationId: id,
          error: e.message,
          responseText: response.responseText,
        });
        onFailure(`Error checking status: ${e.message}`, prompt, "AIHorde");
      }
    },
    onerror: (error) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      logError("AIHORDE", "Failed to get status from AI Horde", {
        generationId: id,
        error: error,
      });
      onFailure("Failed to get status from AI Horde.", prompt, "AIHorde");
    },
  });
  abortRegistry.trackRequest(xhr);
}

export async function generate(prompt, { onSuccess, onFailure, updateStatus }) {
  const config = await getConfig();
  const myToken = abortRegistry.getCancelToken();
  const {
    aiHordeApiKey,
    aiHordeModel,
    aiHordeSampler,
    aiHordeCfgScale,
    aiHordeSteps,
    aiHordeWidth,
    aiHordeHeight,
    aiHordeSeed,
    aiHordePostProcessing,
    enableNegPrompt,
    globalNegPrompt,
  } = config;

  // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
  // For AI Horde, "prompt" must remain strictly the positive prompt (Styled/Enhanced).
  const cleanPrompt = getApiReadyPrompt(prompt, "aihorde_api_positive_only");

  const negEnabled = Boolean(enableNegPrompt);
  const negText = (globalNegPrompt || "").trim();
  const hasValidNegative = negEnabled && negText.length > 0;

  logInfo("AIHORDE", "Starting AI Horde generation", {
    promptConstructionPath: "AIHorde: positive_prompt_with_hash_separator_negative",
    positivePromptLength: cleanPrompt.length,
    positivePromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    model: aiHordeModel,
    apiKeyProvided: Boolean(aiHordeApiKey),
    enableNegPrompt: negEnabled,
    hasNegativePromptText: hasValidNegative,
    negativePromptLength: hasValidNegative ? negText.length : 0,
  });

  const params: any = {
    sampler_name: aiHordeSampler,
    cfg_scale: parseFloat(aiHordeCfgScale),
    steps: parseInt(aiHordeSteps, 10),
    width: parseInt(aiHordeWidth, 10),
    height: parseInt(aiHordeHeight, 10),
  };
  if (aiHordeSeed) {
    params.seed = aiHordeSeed;
  }
  if (aiHordePostProcessing.length > 0) {
    params.post_processing = aiHordePostProcessing;
  }

  const payloadPrompt = hasValidNegative
    ? `${cleanPrompt}###${getApiReadyPrompt(negText, "aihorde_negative_prompt")}`
    : cleanPrompt;
  const payload: any = { prompt: payloadPrompt, params, models: [aiHordeModel] };

  logDebug("AIHORDE", "Sending generation request to AI Horde", {
    url: `${AI_HORDE_API_BASE}/generate/async`,
    model: aiHordeModel,
    params,
    usesHashSeparatorNegativePrompt: hasValidNegative,
    negativePromptLength: hasValidNegative ? negText.length : 0,
    negativePromptPreview: hasValidNegative
      ? negText.substring(0, 200) + (negText.length > 200 ? "..." : "")
      : null,
  });

  updateStatus("Requesting...");

  const xhr = GM_xmlhttpRequest({
    method: "POST",
    url: `${AI_HORDE_API_BASE}/generate/async`,
    headers: getAIHordeHeaders(aiHordeApiKey),
    data: JSON.stringify(payload),
    onload: (response) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      try {
        const data = JSON.parse(response.responseText);
        logDebug("AIHORDE", "AI Horde API response received", {
          status: response.status,
          hasGenerationId: Boolean(data.id),
          message: data.message,
          error: data.error,
        });

        if (data.id) {
          logInfo("AIHORDE", "AI Horde generation request accepted", {
            generationId: data.id,
            model: aiHordeModel,
          });

          updateStatus("Waiting for status...");
          checkStatus(
            data.id,
            prompt,
            Date.now(),
            aiHordeModel,
            aiHordeApiKey,
            {
              onSuccess,
              onFailure,
              updateStatus,
            },
            myToken,
          );
        } else {
          if (data.message && data.message.toLowerCase().includes("model")) {
            logError("AIHORDE", "Model error from AI Horde API", {
              error: data.message,
              willRefreshModels: true,
            });
            onFailure(
              `Model error: ${data.message}. Refreshing model list.`,
              prompt,
              "AIHorde",
            );
            clearCachedModels("aiHorde");
            return;
          }
          logError("AIHORDE", "Failed to initiate generation", {
            error: data.message || "Unknown error",
            responseData: data,
          });
          throw new Error(data.message || "Failed to initiate generation.");
        }
      } catch (e) {
        logError("AIHORDE", "Error processing AI Horde response", {
          error: e.message,
          responseText: response.responseText,
        });
        onFailure(e.message, prompt, "AIHorde");
      }
    },
    onerror: (error) => {
      abortRegistry.untrackRequest(xhr);
      if (abortRegistry.getCancelToken() !== myToken) {
        return;
      }
      logError("AIHORDE", "Network error during AI Horde request", {
        error: error,
      });
      onFailure(JSON.stringify(error), prompt, "AIHorde");
    },
  });
  abortRegistry.trackRequest(xhr);
}
