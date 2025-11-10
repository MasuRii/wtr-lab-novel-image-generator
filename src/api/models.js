// --- IMPORTS ---
import { TOP_MODELS } from "../config/models.js";
import * as cache from "../utils/cache.js";
import * as storage from "../utils/storage.js";
import * as logger from "../utils/logger.js";

// --- PUBLIC FUNCTIONS ---

/**
 * Fetches Pollinations models and populates the dropdown
 */
export async function fetchPollinationsModels(selectedModel) {
  const select = document.getElementById("nig-pollinations-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache.getCachedModelsForProvider("pollinations");
    if (cachedModels && cachedModels.length > 0) {
      logger.logInfo("CACHE", "Loading Pollinations models from cache");
      populatePollinationsSelect(select, cachedModels, selectedModel);
      return;
    }
  } catch (error) {
    logger.logError("CACHE", "Failed to get cached Pollinations models", {
      error: error.message,
    });
  }

  logger.logInfo("NETWORK", "Fetching Pollinations models from API");
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://image.pollinations.ai/models",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      try {
        const models = JSON.parse(response.responseText);
        await cache.setCachedModels("pollinations", models);
        logger.logInfo("NETWORK", "Fetched and cached Pollinations models", {
          count: models.length,
        });
        populatePollinationsSelect(select, models, selectedModel);
      } catch (e) {
        logger.logError("NETWORK", "Failed to parse Pollinations models", {
          error: e.message,
        });
        select.innerHTML = "<option>flux</option>";
        select.value = "flux";
      }
    },
    onerror: (error) => {
      logger.logError("NETWORK", "Failed to fetch Pollinations models", {
        error: error,
      });
      select.innerHTML = "<option>flux</option>";
      select.value = "flux";
    },
  });
}

/**
 * Populates the Pollinations model dropdown
 */
function populatePollinationsSelect(select, models, selectedModel) {
  select.innerHTML = "";
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    let textContent = model;
    if (model === "gptimage") {
      textContent += " (Recommended: Quality)";
    } else if (model === "flux") {
      textContent += " (Default: Speed)";
    }
    option.textContent = textContent;
    select.appendChild(option);
  });
  if (models.includes(selectedModel)) {
    select.value = selectedModel;
  } else {
    select.value = "flux";
  }
}

/**
 * Fetches AI Horde models and populates the dropdown
 */
export async function fetchAIHordeModels(selectedModel) {
  const select = document.getElementById("nig-horde-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache.getCachedModelsForProvider("aiHorde");
    if (cachedModels && cachedModels.length > 0) {
      logger.logInfo("CACHE", "Loading AI Horde models from cache");
      populateAIHordeSelect(select, cachedModels, selectedModel);
      return;
    }
  } catch (error) {
    logger.logError("CACHE", "Failed to get cached AI Horde models", {
      error: error.message,
    });
  }

  logger.logInfo("NETWORK", "Fetching AI Horde models from API");
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://aihorde.net/api/v2/status/models?type=image",
    onload: async (response) => {
      try {
        const apiModels = JSON.parse(response.responseText);
        await cache.setCachedModels("aiHorde", apiModels);
        logger.logInfo("NETWORK", "Fetched and cached AI Horde models", {
          count: apiModels.length,
        });
        populateAIHordeSelect(select, apiModels, selectedModel);
      } catch (e) {
        logger.logError("NETWORK", "Failed to parse AI Horde models", {
          error: e.message,
        });
        select.innerHTML = "<option>Stable Diffusion</option>";
        select.value = "Stable Diffusion";
      }
    },
    onerror: (error) => {
      logger.logError("NETWORK", "Failed to fetch AI Horde models", {
        error: error,
      });
      select.innerHTML = "<option>Stable Diffusion</option>";
      select.value = "Stable Diffusion";
    },
  });
}

/**
 * Populates the AI Horde model dropdown
 */
function populateAIHordeSelect(select, models, selectedModel) {
  select.innerHTML = "";

  const apiModelMap = new Map(models.map((m) => [m.name, m]));
  const topModelNames = new Set(TOP_MODELS.map((m) => m.name));

  const topGroup = document.createElement("optgroup");
  topGroup.label = "Top 10 Popular Models";

  const otherGroup = document.createElement("optgroup");
  otherGroup.label = "Other Models";

  // Add top models first
  TOP_MODELS.forEach((topModel) => {
    if (apiModelMap.has(topModel.name)) {
      const apiData = apiModelMap.get(topModel.name);
      const option = document.createElement("option");
      option.value = topModel.name;
      option.textContent = `${topModel.name} - ${topModel.desc} (${apiData.count} workers)`;
      topGroup.appendChild(option);
    }
  });

  // Add other models
  const otherModels = models
    .filter((m) => !topModelNames.has(m.name))
    .sort((a, b) => b.count - a.count);
  otherModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = `${model.name} (${model.count} workers)`;
    otherGroup.appendChild(option);
  });

  select.appendChild(topGroup);
  select.appendChild(otherGroup);

  if (Array.from(select.options).some((opt) => opt.value === selectedModel)) {
    select.value = selectedModel;
  } else {
    select.value = models[0]?.name || "Stable Diffusion";
  }
}

/**
 * Checks if a model is free to use, based primarily on plan_requirements.
 *
 * New rules:
 * - FREE if plan_requirements contains "free"
 * - PAID if plan_requirements does NOT contain "free" but contains "basic" or any higher tier
 * - Ignore intermediate tiers as separate categories; only free vs paid matters
 *
 * Robust handling:
 * - If plan_requirements missing/empty/malformed → fall back to legacy fields for backward compatibility
 *
 * @param {object} model
 * @returns {boolean} true if classified as free, false otherwise
 */
function isModelFree(model) {
  if (!model || typeof model !== "object") {
    // Malformed data - safe default is paid
    return false;
  }

  const tiersPriority = {
    free: 0,
    economy: 1,
    basic: 2,
    premium: 3,
    pro: 4,
    ultra: 5,
    enterprise: 6,
    admin: 7,
  };

  const hasValidPlanRequirements =
    Object.prototype.hasOwnProperty.call(model, "plan_requirements") &&
    Array.isArray(model.plan_requirements);

  if (hasValidPlanRequirements) {
    const normalized = model.plan_requirements
      .filter((t) => typeof t === "string")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);

    if (normalized.length > 0) {
      if (normalized.includes("free")) {
        return true;
      }

      // Detect if any basic-or-higher tier is present.
      const hasBasicOrHigher = normalized.some((t) => {
        const rank = tiersPriority[t];
        return typeof rank === "number" && rank >= tiersPriority.basic;
      });

      if (hasBasicOrHigher) {
        return false;
      }

      // If we reach here, plan_requirements existed but only contained unknown/low tiers
      // that are not explicitly "free" and not mapped as paid → safe default is paid.
      return false;
    }
    // If it's an array but empty, fall through to legacy logic.
  }

  // Legacy / backward-compatible behavior:
  if (typeof model.is_free === "boolean") {
    return model.is_free;
  }
  if (typeof model.premium_model === "boolean") {
    return !model.premium_model;
  }
  if (Array.isArray(model.tiers)) {
    const normalizedTiers = model.tiers
      .filter((t) => typeof t === "string")
      .map((t) => t.trim().toLowerCase());
    if (normalizedTiers.includes("free")) {
      return true;
    }
  }

  // Default safe behavior when nothing else is conclusive: treat as paid.
  return false;
}

/**
 * Populates the OpenAI compatible model dropdown
 */
function populateOpenAICompatSelect(select, models, selectedModel) {
  select.innerHTML = "";
  const freeGroup = document.createElement("optgroup");
  freeGroup.label = "Free Models";
  const paidGroup = document.createElement("optgroup");
  paidGroup.label = "Paid Models";

  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = model.id;
    if (isModelFree(model)) {
      freeGroup.appendChild(option);
    } else {
      paidGroup.appendChild(option);
    }
  });

  if (freeGroup.childElementCount > 0) {
    select.appendChild(freeGroup);
  }
  if (paidGroup.childElementCount > 0) {
    select.appendChild(paidGroup);
  }

  if (models.some((m) => m.id === selectedModel)) {
    select.value = selectedModel;
  }
}

/**
 * Fetches OpenAI compatible models
 */
export async function fetchOpenAICompatModels() {
  const baseUrl = document
    .getElementById("nig-openai-compat-base-url")
    .value.trim();
  const apiKey = document
    .getElementById("nig-openai-compat-api-key")
    .value.trim();

  if (!baseUrl) {
    alert("Please enter a Base URL first.");
    return;
  }

  const select = document.getElementById("nig-openai-compat-model");
  select.innerHTML = "<option>Fetching models...</option>";

  logger.logInfo(
    "NETWORK",
    `Fetching OpenAI compatible models from ${baseUrl}`,
  );

  GM_xmlhttpRequest({
    method: "GET",
    url: `${baseUrl}/models`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    onload: async (response) => {
      try {
        const data = JSON.parse(response.responseText);
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error("Invalid model list format received.");
        }

        let imageModels = [];
        if (data.data.some((m) => m.endpoint || m.endpoints)) {
          imageModels = data.data.filter(
            (model) =>
              model.endpoint === "/v1/images/generations" ||
              model.endpoints?.includes("/v1/images/generations"),
          );
        } else if (data.data.some((m) => m.type === "images.generations")) {
          imageModels = data.data.filter(
            (model) => model.type === "images.generations",
          );
        } else {
          // If no explicit image models found, try to identify them by name patterns
          imageModels = data.data.filter((model) => {
            const modelId = model.id.toLowerCase();
            return (
              modelId.includes("dall-e") ||
              modelId.includes("dalle") ||
              modelId.includes("image") ||
              modelId.includes("midjourney") ||
              modelId.includes("stable diffusion") ||
              modelId.includes("flux") ||
              modelId.includes("imagen")
            );
          });
        }

        imageModels.sort((a, b) => {
          const aIsFree = isModelFree(a);
          const bIsFree = isModelFree(b);
          if (aIsFree && !bIsFree) {
            return -1;
          }
          if (!aIsFree && bIsFree) {
            return 1;
          }
          return a.id.localeCompare(b.id);
        });

        if (imageModels.length === 0) {
          throw new Error(
            "No image generation models found. This provider may not support image generation.",
          );
        }

        populateOpenAICompatSelect(select, imageModels);

        // Cache the models for this profile
        await cache.setCachedOpenAICompatModels(baseUrl, imageModels);
        logger.logInfo(
          "NETWORK",
          `Successfully fetched and cached ${imageModels.length} models for ${baseUrl}`,
        );
      } catch (error) {
        logger.logError("NETWORK", "Failed to parse OpenAI compatible models", {
          error: error.message,
        });
        select.innerHTML = "<option>Failed to fetch models</option>";
        alert(
          `Failed to fetch models. Check the Base URL and API Key. You can enter the model name manually. Error: ${error.message}`,
        );

        // Switch to manual input mode
        document.getElementById(
          "nig-openai-model-container-select",
        ).style.display = "none";
        document.getElementById(
          "nig-openai-model-container-manual",
        ).style.display = "block";
      }
    },
    onerror: (error) => {
      logger.logError("NETWORK", "Failed to fetch OpenAI compatible models", {
        error,
      });
      select.innerHTML = "<option>Failed to fetch models</option>";
      alert(
        "Failed to fetch models. Check your network connection and the Base URL. Switching to manual input.",
      );

      // Switch to manual input mode
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "none";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "block";
    },
  });
}

/**
 * Loads cached OpenAI compatible models for a profile
 */
export async function loadCachedOpenAICompatModels(profileUrl, selectedModel) {
  const select = document.getElementById("nig-openai-compat-model");
  const cachedModels = await cache.getCachedOpenAICompatModels(profileUrl);

  if (cachedModels && cachedModels.length > 0) {
    populateOpenAICompatSelect(select, cachedModels, selectedModel);
  } else {
    // No cached models, show fetch prompt
    select.innerHTML =
      "<option>No cached models. Click Fetch to get models.</option>";
  }
}

/**
 * Loads OpenAI profiles and populates the dropdown
 */
export async function loadOpenAIProfiles() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const config = await storage.getConfig();
  const profiles = config.openAICompatProfiles || {};
  const activeUrl = config.openAICompatActiveProfileUrl;

  select.innerHTML = "";

  Object.keys(profiles).forEach((url) => {
    const option = document.createElement("option");
    option.value = url;
    option.textContent = url;
    select.appendChild(option);
  });

  const newOption = document.createElement("option");
  newOption.value = "__new__";
  newOption.textContent = "— Add or Edit Profile —";
  select.appendChild(newOption);

  if (activeUrl && profiles[activeUrl]) {
    select.value = activeUrl;
  } else {
    select.value = "__new__";
  }
  loadSelectedOpenAIProfile();
}

/**
 * Loads the selected OpenAI profile
 */
export async function loadSelectedOpenAIProfile() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const config = await storage.getConfig();
  const profiles = config.openAICompatProfiles || {};
  const selectedUrl = select.value;

  if (selectedUrl && profiles[selectedUrl]) {
    const profile = profiles[selectedUrl];
    document.getElementById("nig-openai-compat-base-url").value = selectedUrl;
    document.getElementById("nig-openai-compat-api-key").value = profile.apiKey;

    if (config.openAICompatModelManualInput) {
      document.getElementById("nig-openai-compat-model-manual").value =
        profile.model;
    } else {
      document.getElementById("nig-openai-compat-model").value = profile.model;
      // Load cached models for this profile, if available
      loadCachedOpenAICompatModels(selectedUrl, profile.model);
    }
  } else {
    // New profile mode - clear the model selection
    document.getElementById("nig-openai-compat-base-url").value = "";
    document.getElementById("nig-openai-compat-api-key").value = "";
    document.getElementById("nig-openai-compat-model").innerHTML =
      "<option>Enter URL/Key and fetch...</option>";
  }
}

/**
 * Deletes the selected OpenAI profile
 */
export async function deleteSelectedOpenAIProfile() {
  const select = document.getElementById("nig-openai-compat-profile-select");
  const selectedUrl = select.value;

  if (selectedUrl === "__new__") {
    alert("You can't delete the 'Add New' option.");
    return;
  }

  if (confirm(`Delete profile for "${selectedUrl}"?`)) {
    const config = await storage.getConfig();
    const profiles = config.openAICompatProfiles || {};
    delete profiles[selectedUrl];
    await storage.setConfigValue("openAICompatProfiles", profiles);

    // Clear form fields
    document.getElementById("nig-openai-compat-base-url").value = "";
    document.getElementById("nig-openai-compat-api-key").value = "";
    document.getElementById("nig-openai-compat-model").innerHTML =
      "<option>Enter URL/Key and fetch...</option>";
    document.getElementById("nig-openai-compat-model-manual").value = "";

    await loadOpenAIProfiles();
  }
}

/**
 * Saves provider-specific configuration to storage
 */
export async function saveProviderConfigs() {
  // Pollinations configuration
  await storage.setConfigValue(
    "pollinationsModel",
    document.getElementById("nig-pollinations-model").value,
  );
  await storage.setConfigValue(
    "pollinationsWidth",
    document.getElementById("nig-pollinations-width").value,
  );
  await storage.setConfigValue(
    "pollinationsHeight",
    document.getElementById("nig-pollinations-height").value,
  );
  await storage.setConfigValue(
    "pollinationsSeed",
    document.getElementById("nig-pollinations-seed").value.trim(),
  );
  await storage.setConfigValue(
    "pollinationsEnhance",
    document.getElementById("nig-pollinations-enhance").checked,
  );
  await storage.setConfigValue(
    "pollinationsSafe",
    document.getElementById("nig-pollinations-safe").checked,
  );
  await storage.setConfigValue(
    "pollinationsNologo",
    document.getElementById("nig-pollinations-nologo").checked,
  );
  await storage.setConfigValue(
    "pollinationsPrivate",
    document.getElementById("nig-pollinations-private").checked,
  );
  await storage.setConfigValue(
    "pollinationsToken",
    document.getElementById("nig-pollinations-token").value.trim(),
  );

  // AI Horde configuration
  await storage.setConfigValue(
    "aiHordeApiKey",
    document.getElementById("nig-horde-api-key").value.trim() || "0000000000",
  );
  await storage.setConfigValue(
    "aiHordeModel",
    document.getElementById("nig-horde-model").value,
  );
  await storage.setConfigValue(
    "aiHordeSampler",
    document.getElementById("nig-horde-sampler").value,
  );
  await storage.setConfigValue(
    "aiHordeSteps",
    document.getElementById("nig-horde-steps").value,
  );
  await storage.setConfigValue(
    "aiHordeCfgScale",
    document.getElementById("nig-horde-cfg").value,
  );
  await storage.setConfigValue(
    "aiHordeWidth",
    document.getElementById("nig-horde-width").value,
  );
  await storage.setConfigValue(
    "aiHordeHeight",
    document.getElementById("nig-horde-height").value,
  );
  await storage.setConfigValue(
    "aiHordeSeed",
    document.getElementById("nig-horde-seed").value.trim(),
  );
  const postProcessing = Array.from(
    document.querySelectorAll('input[name="nig-horde-post"]:checked'),
  ).map((cb) => cb.value);
  await storage.setConfigValue("aiHordePostProcessing", postProcessing);

  // Google configuration
  await storage.setConfigValue(
    "googleApiKey",
    document.getElementById("nig-google-api-key").value.trim(),
  );
  await storage.setConfigValue(
    "model",
    document.getElementById("nig-model").value,
  );
  await storage.setConfigValue(
    "numberOfImages",
    document.getElementById("nig-num-images").value,
  );
  await storage.setConfigValue(
    "imageSize",
    document.getElementById("nig-image-size").value,
  );
  await storage.setConfigValue(
    "aspectRatio",
    document.getElementById("nig-aspect-ratio").value,
  );
  await storage.setConfigValue(
    "personGeneration",
    document.getElementById("nig-person-gen").value,
  );

  // OpenAI Compatible configuration
  const baseUrl = document
    .getElementById("nig-openai-compat-base-url")
    .value.trim();
  if (baseUrl) {
    const profiles = await storage.getConfigValue("openAICompatProfiles");
    const isManualMode =
      document.getElementById("nig-openai-model-container-manual").style
        .display !== "none";
    const model = isManualMode
      ? document.getElementById("nig-openai-compat-model-manual").value.trim()
      : document.getElementById("nig-openai-compat-model").value;

    profiles[baseUrl] = {
      apiKey: document.getElementById("nig-openai-compat-api-key").value.trim(),
      model: model,
    };
    await storage.setConfigValue("openAICompatProfiles", profiles);
    await storage.setConfigValue("openAICompatActiveProfileUrl", baseUrl);
    await storage.setConfigValue("openAICompatModelManualInput", isManualMode);

    // Refresh the OpenAI profiles dropdown to show the newly saved profile
    await loadOpenAIProfiles();
  }
}

/**
 * Populates provider-specific form fields
 */
export async function populateProviderForms(config) {
  // Pollinations settings
  document.getElementById("nig-pollinations-width").value =
    config.pollinationsWidth;
  document.getElementById("nig-pollinations-height").value =
    config.pollinationsHeight;
  document.getElementById("nig-pollinations-seed").value =
    config.pollinationsSeed;
  document.getElementById("nig-pollinations-enhance").checked =
    config.pollinationsEnhance;
  document.getElementById("nig-pollinations-safe").checked =
    config.pollinationsSafe;
  document.getElementById("nig-pollinations-nologo").checked =
    config.pollinationsNologo;
  document.getElementById("nig-pollinations-private").checked =
    config.pollinationsPrivate;
  document.getElementById("nig-pollinations-token").value =
    config.pollinationsToken;
  fetchPollinationsModels(config.pollinationsModel);

  // AI Horde settings
  document.getElementById("nig-horde-api-key").value = config.aiHordeApiKey;
  document.getElementById("nig-horde-sampler").value = config.aiHordeSampler;
  document.getElementById("nig-horde-steps").value = config.aiHordeSteps;
  document.getElementById("nig-horde-cfg").value = config.aiHordeCfgScale;
  document.getElementById("nig-horde-width").value = config.aiHordeWidth;
  document.getElementById("nig-horde-height").value = config.aiHordeHeight;
  document.getElementById("nig-horde-seed").value = config.aiHordeSeed;
  document.querySelectorAll('input[name="nig-horde-post"]').forEach((cb) => {
    cb.checked = config.aiHordePostProcessing.includes(cb.value);
  });
  fetchAIHordeModels(config.aiHordeModel);

  // Google settings
  document.getElementById("nig-google-api-key").value = config.googleApiKey;
  document.getElementById("nig-model").value = config.model;
  document.getElementById("nig-num-images").value = config.numberOfImages;
  document.getElementById("nig-image-size").value = config.imageSize;
  document.getElementById("nig-aspect-ratio").value = config.aspectRatio;
  document.getElementById("nig-person-gen").value = config.personGeneration;

  // OpenAI Compatible settings
  await loadOpenAIProfiles();
  if (config.openAICompatModelManualInput) {
    document.getElementById("nig-openai-model-container-select").style.display =
      "none";
    document.getElementById("nig-openai-model-container-manual").style.display =
      "block";
  } else {
    document.getElementById("nig-openai-model-container-select").style.display =
      "block";
    document.getElementById("nig-openai-model-container-manual").style.display =
      "none";
  }
}
