import { getConfig } from "../utils/storage.js";
import { clearCachedModels } from "../utils/cache.js";
import { getApiReadyPrompt } from "../utils/promptUtils.js";
import { logInfo, logDebug, logError } from "../utils/logger.js";

function checkStatus(
  id,
  prompt,
  startTime,
  model,
  { onSuccess, onFailure, updateStatus },
) {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;

  logDebug("AIHORDE", "Checking AI Horde generation status", {
    generationId: id,
    elapsedTimeMs: elapsedTime,
    promptPreview:
      prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
  });

  GM_xmlhttpRequest({
    method: "GET",
    url: `https://aihorde.net/api/v2/generate/status/${id}`,
    onload: (response) => {
      try {
        const data = JSON.parse(response.responseText);
        logDebug("AIHORDE", "AI Horde status response received", {
          generationId: id,
          responseData: data,
          isDone: data.done,
          queuePosition: data.queue_position,
          processing: data.processing,
          waitTime: data.wait_time,
        });

        if (data.done) {
          const finalElapsedTime = Date.now() - startTime;
          logInfo("AIHORDE", "AI Horde generation completed successfully", {
            generationId: id,
            imagesGenerated: data.generations ? data.generations.length : 0,
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

          // Clear the status text when completing to prevent stale status
          updateStatus("Completed!");

          const imageUrls = data.generations.map((gen) => gen.img);
          onSuccess(imageUrls, prompt, "AIHorde", model);
        } else {
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

          setTimeout(
            () =>
              checkStatus(id, prompt, startTime, model, {
                onSuccess,
                onFailure,
                updateStatus,
              }),
            5000,
          );
        }
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
      logError("AIHORDE", "Failed to get status from AI Horde", {
        generationId: id,
        error: error,
      });
      onFailure("Failed to get status from AI Horde.", prompt, "AIHorde");
    },
  });
}

export async function generate(prompt, { onSuccess, onFailure, updateStatus }) {
  const config = await getConfig();
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
    promptConstructionPath: "AIHorde: positive_only + separate_negative_field",
    positivePromptLength: cleanPrompt.length,
    positivePromptPreview:
      cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    model: aiHordeModel,
    apiKeyProvided: Boolean(aiHordeApiKey),
    enableNegPrompt: negEnabled,
    hasNegativePromptText: hasValidNegative,
    negativePromptLength: hasValidNegative ? negText.length : 0,
  });

  const params = {
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

  const payload = { prompt: cleanPrompt, params, models: [aiHordeModel] };
  if (hasValidNegative) {
    payload.negative_prompt = negText;
  }

  logDebug("AIHORDE", "Sending generation request to AI Horde", {
    url: "https://aihorde.net/api/v2/generate/async",
    model: aiHordeModel,
    params,
    usesNegativePromptField: Boolean(payload.negative_prompt),
    negativePromptLength: payload.negative_prompt
      ? payload.negative_prompt.length
      : 0,
    negativePromptPreview: payload.negative_prompt
      ? payload.negative_prompt.substring(0, 200) +
        (payload.negative_prompt.length > 200 ? "..." : "")
      : null,
  });

  updateStatus("Requesting...");

  GM_xmlhttpRequest({
    method: "POST",
    url: "https://aihorde.net/api/v2/generate/async",
    headers: {
      "Content-Type": "application/json",
      apikey: aiHordeApiKey || "0000000000",
    },
    data: JSON.stringify(payload),
    onload: (response) => {
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
          checkStatus(data.id, prompt, Date.now(), aiHordeModel, {
            onSuccess,
            onFailure,
            updateStatus,
          });
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
      logError("AIHORDE", "Network error during AI Horde request", {
        error: error,
      });
      onFailure(JSON.stringify(error), prompt, "AIHorde");
    },
  });
}
