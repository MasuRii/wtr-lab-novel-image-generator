import { logInfo, logDebug, logWarn, logError } from "../utils/logger.js";
import { getApiReadyPrompt } from "../utils/promptUtils.js";

/**
 * Determines if the selected provider's built-in enhancement should be used.
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
      config.enhancementApiKey &&
      (!shouldUse || config.enhancementOverrideProvider),
  });

  return shouldUse;
}

/**
 * Enhances a given prompt using the Google Gemini API with robust retry and fallback logic.
 * @param {string} originalPrompt - The user's original prompt.
 * @param {object} config - The current script configuration.
 * @returns {Promise<string>} The enhanced prompt.
 */
export async function enhancePromptWithGemini(originalPrompt, config) {
  const startTime = Date.now();

  // Resolve effective enhancement instruction that RESPECTS user style/main/sub-style
  const {
    enhancementApiKey: apiKey,
    enhancementModel: rawModel,
    enhancementTemplate: userTemplateOverride,
    // enhancementTemplateSelected,
    mainPromptStyle,
    subPromptStyle,
    customStyleEnabled,
    customStyleText,
    enhancementMaxRetriesPerModel = 2,
    enhancementRetryDelay = 1000,
    enhancementModelsFallback = [
      "models/gemini-2.5-pro",
      "models/gemini-flash-latest",
      "models/gemini-flash-lite-latest",
      "models/gemini-2.5-flash",
      "models/gemini-2.5-flash-lite",
    ],
    _enhancementLogLevel = "info",
    enhancementAlwaysFallback = true,
  } = config;

  // Build a style-respecting instruction layer:
  // - If custom style is enabled, explicitly tell Gemini to preserve and reinforce it.
  // - Else if main/sub styles are set, tell Gemini to keep them.
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
        `Do NOT override it with photorealistic/technical photography language unless this style explicitly implies it.`,
        `All enhancements must be consistent with this selected style.`,
      ].join(" ");
    }

    return "";
  })();

  // Base template to use:
  // - Prefer userTemplateOverride when provided (from UI textarea).
  // - Otherwise, derive from presets (standard/safety/artistic/technical/character) via DEFAULTS.enhancementTemplate in config.
  //   (config should already contain the selected preset mapping.)
  const baseTemplate =
    userTemplateOverride && userTemplateOverride.trim().length > 0
      ? userTemplateOverride.trim()
      : (config.enhancementTemplate || "").trim();

  // Merge base template and style directives into final template sent to Gemini.
  const mergedTemplate = [
    baseTemplate ||
      "Extract visual, image-ready elements from the text without changing its intended style.",
    styleDirectives,
  ]
    .filter(Boolean)
    .join(" ");

  if (!apiKey) {
    throw new Error("Gemini API key is required for prompt enhancement.");
  }

  // Build model list with primary model first, followed by fallbacks
  const modelsList = [
    rawModel,
    ...enhancementModelsFallback.filter((m) => m !== rawModel),
  ];

  logInfo("ENHANCEMENT", "Starting robust prompt enhancement with Gemini AI", {
    originalLength: originalPrompt.length,
    primaryModel: rawModel,
    fallbackModels: enhancementModelsFallback,
    totalModels: modelsList.length,
    maxRetriesPerModel: enhancementMaxRetriesPerModel,
    apiKeyPresent: Boolean(apiKey),
  });

  let lastError = null;

  // Try each model in the list
  for (let modelIndex = 0; modelIndex < modelsList.length; modelIndex++) {
    const modelWithPrefix = modelsList[modelIndex];
    const model = modelWithPrefix.startsWith("models/")
      ? modelWithPrefix.substring(7)
      : modelWithPrefix;
    const isPrimaryModel = modelIndex === 0;

    logInfo("ENHANCEMENT", `Attempting enhancement with model: ${model}`, {
      modelIndex: modelIndex + 1,
      totalModels: modelsList.length,
      isPrimaryModel,
      modelName: model,
    });

    let attemptsForThisModel = 0;

    // Retry logic for each model
    while (attemptsForThisModel < enhancementMaxRetriesPerModel) {
      attemptsForThisModel++;

      try {
        const enhancedText = await attemptEnhancementWithModel(
          originalPrompt,
          model,
          mergedTemplate,
          apiKey,
          isPrimaryModel,
          attemptsForThisModel,
          enhancementMaxRetriesPerModel,
        );

        const duration = Date.now() - startTime;
        logInfo("ENHANCEMENT", "Prompt enhancement successful", {
          model,
          attempts: attemptsForThisModel,
          duration,
          totalModelsTried: modelIndex + 1,
        });

        return enhancedText;
      } catch (error) {
        lastError = error;
        logError(
          "ENHANCEMENT",
          `Enhancement failed for model ${model} (attempt ${attemptsForThisModel}/${enhancementMaxRetriesPerModel})`,
          {
            model,
            attemptNumber: attemptsForThisModel,
            error: error.message,
            isPrimaryModel,
          },
        );

        // If this is not the last retry for this model, wait before retrying
        if (attemptsForThisModel < enhancementMaxRetriesPerModel) {
          logInfo("ENHANCEMENT", `Retrying model ${model} after delay`, {
            retryDelay: enhancementRetryDelay,
            nextAttempt: attemptsForThisModel + 1,
          });
          await sleep(enhancementRetryDelay);
        }
      }
    }

    // If we exhausted retries for this model, try the next one
    logWarn(
      "ENHANCEMENT",
      `Exhausted retries for model ${model}, switching to next model`,
      {
        model,
        attemptsMade: attemptsForThisModel,
        maxRetries: enhancementMaxRetriesPerModel,
        nextModelIndex: modelIndex + 1,
        remainingModels: modelsList.length - modelIndex - 1,
      },
    );
  }

  // All models failed
  const duration = Date.now() - startTime;
  logError(
    "ENHANCEMENT",
    "All models and retries exhausted for prompt enhancement",
    {
      totalModelsTried: modelsList.length,
      duration,
      lastError: lastError?.message,
      originalPrompt:
        originalPrompt.substring(0, 100) +
        (originalPrompt.length > 100 ? "..." : ""),
    },
  );

  // Enhanced fallback behavior
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
    `All enhancement models failed. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Attempts enhancement with a specific model
 */
async function attemptEnhancementWithModel(
  originalPrompt,
  model,
  template,
  apiKey,
  isPrimaryModel,
  _attemptNumber,
  _maxRetries,
) {
  // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
  const cleanPrompt = getApiReadyPrompt(originalPrompt, "gemini_enhancement");

  const enhancementPrompt = template
    ? `${template}\n\nOriginal prompt: "${cleanPrompt}"\n\nEnhanced prompt:`
    : `Convert this text into a focused visual description for image generation... \n\n"${cleanPrompt}"\n\nEnhanced version:`;

  const requestData = {
    contents: [{ parts: [{ text: enhancementPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 65536,
    },
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return new Promise((resolve, reject) => {
    // Use shorter timeout for fallback models to speed up switching
    const timeout = isPrimaryModel ? 45000 : 30000;

    GM_xmlhttpRequest({
      method: "POST",
      url: apiUrl,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(requestData),
      timeout: timeout,
      onload: (response) => {
        try {
          if (!response.responseText) {
            throw new Error("Empty response received from Gemini API");
          }
          const data = JSON.parse(response.responseText);

          if (data.error) {
            throw new Error(data.error.message || "Gemini API error");
          }

          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            const enhancedText =
              data.candidates[0].content.parts[0].text.trim();
            const cleanedText = enhancedText.replace(/^["']|["']$/g, "");
            resolve(cleanedText);
          } else {
            throw new Error("No enhancement result received from Gemini API");
          }
        } catch (e) {
          reject(e);
        }
      },
      onerror: () => {
        reject(new Error("Network error during enhancement request."));
      },
      ontimeout: () => {
        reject(
          new Error(
            `Enhancement request timed out after ${timeout / 1000} seconds.`,
          ),
        );
      },
    });
  });
}

/**
 * Creates a basic enhancement fallback when all models fail
 */
function createBasicEnhancementFallback(originalPrompt) {
  // Simple heuristic-based enhancement
  let enhanced = originalPrompt;

  // Add common quality boosters if not already present
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

  // Clean up any double commas
  enhanced = enhanced.replace(/,+/g, ",").replace(/,\s*$/, "");

  return enhanced;
}

/**
 * Utility function to sleep for a given number of milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
