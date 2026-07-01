// --- IMPORTS ---
import * as cache from "../utils/cache";
import * as storage from "../utils/storage";
import * as logger from "../utils/logger";
import { showToast, showConfirm } from "../utils/uiUtils";

// --- PUBLIC FUNCTIONS ---

const POLLINATIONS_DEFAULT_MODEL = "zimage";
const POLLINATIONS_LEGACY_ALIASES = new Set(["sana", "turbo"]);
const POLLINATIONS_MODELS_ENDPOINT = "https://gen.pollinations.ai/image/models";
const AI_HORDE_MODELS_ENDPOINT =
  "https://aihorde.net/api/v2/status/models?type=image";

function normalizePollinationsModelName(model) {
  const value = typeof model === "string" ? model.trim() : "";
  if (!value || POLLINATIONS_LEGACY_ALIASES.has(value.toLowerCase())) {
    return POLLINATIONS_DEFAULT_MODEL;
  }
  return value;
}

/**
 * Parses the Pollinations /image/models response (array of objects with name,
 * category, etc.) into a sorted list of image model name strings.
 * Filters out non-image models (e.g. video) using the category field.
 * @param {Array} data - Array of model objects from gen.pollinations.ai/image/models
 * @returns {string[]} Sorted image model names
 */
export function parsePollinationsModelsResponse(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof entry.name === "string" &&
        entry.name.trim().length > 0 &&
        (!entry.category || entry.category === "image"),
    )
    .map((entry) => entry.name.trim())
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Fetches Pollinations models and populates the dropdown
 */
export async function fetchPollinationsModels(selectedModel) {
  const select = document.getElementById("nig-pollinations-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache.getCachedModelsForProvider("pollinations", POLLINATIONS_MODELS_ENDPOINT);
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
    url: POLLINATIONS_MODELS_ENDPOINT,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
    onload: async (response) => {
      try {
        const models = parsePollinationsModelsResponse(JSON.parse(response.responseText));
        await cache.setCachedModels("pollinations", models, POLLINATIONS_MODELS_ENDPOINT);
        logger.logInfo("NETWORK", "Fetched and cached Pollinations models", {
          count: models.length,
        });
        populatePollinationsSelect(select, models, selectedModel);
      } catch (e) {
        logger.logError("NETWORK", "Failed to parse Pollinations models", {
          error: e.message,
        });
        select.innerHTML = "<option>zimage</option>";
        select.value = POLLINATIONS_DEFAULT_MODEL;
      }
    },
    onerror: (error) => {
      logger.logError("NETWORK", "Failed to fetch Pollinations models", {
        error: error,
      });
      select.innerHTML = "<option>zimage</option>";
      select.value = POLLINATIONS_DEFAULT_MODEL;
    },
  });
}

/**
 * Populates the Pollinations model dropdown
 */
function populatePollinationsSelect(select, models, selectedModel) {
  select.innerHTML = "";
  const normalizedSelected = normalizePollinationsModelName(selectedModel);
  const normalizedModels = Array.from(
    new Set(
      [POLLINATIONS_DEFAULT_MODEL, ...models.map(normalizePollinationsModelName)]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    ),
  );

  normalizedModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    let textContent = model;
    if (model === POLLINATIONS_DEFAULT_MODEL) {
      textContent += " (Current default)";
    }
    option.textContent = textContent;
    select.appendChild(option);
  });

  if (normalizedModels.includes(normalizedSelected)) {
    select.value = normalizedSelected;
  } else {
    select.value = POLLINATIONS_DEFAULT_MODEL;
  }
}

/**
 * Fetches AI Horde models and populates the dropdown
 */
export async function fetchAIHordeModels(selectedModel) {
  const select = document.getElementById("nig-horde-model");
  select.innerHTML = "<option>Loading models...</option>";

  try {
    const cachedModels = await cache.getCachedModelsForProvider("aiHorde", AI_HORDE_MODELS_ENDPOINT);
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
    url: AI_HORDE_MODELS_ENDPOINT,
    onload: async (response) => {
      try {
        const apiModels = JSON.parse(response.responseText);
        await cache.setCachedModels("aiHorde", apiModels, AI_HORDE_MODELS_ENDPOINT);
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
 * Groups AI Horde models into top (popular) and other buckets based on live
 * API metadata (worker count), replacing the former static curated list.
 * @param {Array} models - Array of AI Horde model objects with { name, count, ... }
 * @returns {{ top: Array, other: Array }}
 */
export function groupAIHordeModels(models) {
  const sorted = [...models].sort((a, b) => (b.count || 0) - (a.count || 0));
  const topCount = Math.min(10, sorted.length);
  return {
    top: sorted.slice(0, topCount),
    other: sorted.slice(topCount),
  };
}

/**
 * Populates the AI Horde model dropdown.
 * Top/popular grouping is derived from live API metadata (worker count),
 * not from any hardcoded list.
 */
function populateAIHordeSelect(select, models, selectedModel) {
  select.innerHTML = "";

  const { top, other } = groupAIHordeModels(models);
  const topCount = top.length;

  const topGroup = document.createElement("optgroup");
  topGroup.label =
    topCount > 0 ? `Top ${topCount} Popular Models` : "Popular Models";

  const otherGroup = document.createElement("optgroup");
  otherGroup.label = "Other Models";

  top.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = `${model.name} (${model.count || 0} workers)`;
    topGroup.appendChild(option);
  });

  other.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.name;
    option.textContent = `${model.name} (${model.count || 0} workers)`;
    otherGroup.appendChild(option);
  });

  select.appendChild(topGroup);
  if (otherGroup.childElementCount > 0) {
    select.appendChild(otherGroup);
  }

  if (Array.from(select.options).some((opt: any) => opt.value === selectedModel)) {
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
    showToast("Please enter a Base URL first.", "error");
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
              modelId.includes("gpt-image") ||
              modelId.includes("chatgpt-image") ||
              modelId.includes("image") ||
              modelId.includes("midjourney") ||
              modelId.includes("stable diffusion") ||
              modelId.includes("flux")
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

        populateOpenAICompatSelect(select, imageModels, undefined);

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
        showToast(
          `Failed to fetch models. Check the Base URL and API Key. You can enter the model name manually. Error: ${error.message}`,
          "error",
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
      showToast(
        "Failed to fetch models. Check your network connection and the Base URL. Switching to manual input.",
        "error",
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
    showToast("You can't delete the 'Add New' option.", "error");
    return;
  }

  if (await showConfirm(`Delete profile for "${selectedUrl}"?`, "Delete Profile")) {
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

// --- Enhancement Model Discovery ---

/**
 * Name patterns for models that are unambiguously NOT chat/text models.
 * Used as a permissive fallback when no explicit capability metadata is present.
 */
const ENHANCEMENT_NON_CHAT_PATTERNS = [
  /\bembed/i,
  /\btts/i,
  /whisper/i,
  /moderation/i,
  /\baudio\b/i,
  /transcri/i,
  /image/i,
];

/**
 * Builds the request URL and headers for fetching enhancement models from an
 * OpenAI-compatible /models endpoint.
 *
 * Authorization is omitted when no API key is provided, supporting no-auth
 * local servers (Ollama, LM Studio, vLLM).
 * @param {string} baseUrl - Enhancement endpoint base URL (e.g. https://api.openai.com/v1)
 * @param {string} apiKey - Optional Bearer token; empty for no-auth servers
 * @returns {{ url: string, headers: Record<string, string> }}
 */
export function buildEnhancementModelsRequest(baseUrl, apiKey) {
  const endpointUrl =
    typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = typeof apiKey === "string" ? apiKey.trim() : "";
  if (key) {
    headers["Authorization"] = `Bearer ${key}`;
  }
  return { url: `${endpointUrl}/models`, headers };
}

/**
 * Extracts model entries from common OpenAI-compatible /models response shapes.
 * Handles: { data: [...] }, bare arrays, { models: [...] }, and string arrays.
 * Returns deduplicated { id, meta } entries.
 */
function extractEnhancementModelEntries(data) {
  let modelList = [];
  if (data && Array.isArray(data.data)) {
    modelList = data.data;
  } else if (Array.isArray(data)) {
    modelList = data;
  } else if (data && Array.isArray(data.models)) {
    modelList = data.models;
  } else {
    return [];
  }

  const entries = [];
  const seen = new Set();
  for (const entry of modelList) {
    let id = null;
    let meta: any = {};
    if (typeof entry === "string") {
      id = entry;
    } else if (entry && typeof entry === "object") {
      id = entry.id || entry.name || entry.model;
      if (id) {
        meta = entry;
      }
    }
    if (typeof id === "string") {
      id = id.trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        entries.push({ id, meta });
      }
    }
  }
  return entries;
}

/**
 * Filters model entries to chat/text models.
 * - Uses explicit endpoint/type metadata when available.
 * - Falls back to name heuristics for providers with minimal metadata.
 * - Never returns an empty list if the input had entries (falls back to all)
 *   so local providers with minimal metadata are never left without options.
 * @param {Array} entries - Array of { id, meta } entries
 * @returns {Array} Filtered entries
 */
function filterEnhancementChatModels(entries) {
  const isChat = (entry) => {
    const meta = entry.meta || {};
    // Explicit endpoint metadata — strongest signal
    if (meta.endpoint === "/v1/chat/completions") {
      return true;
    }
    if (
      Array.isArray(meta.endpoints) &&
      meta.endpoints.includes("/v1/chat/completions")
    ) {
      return true;
    }
    // Explicit type metadata
    if (typeof meta.type === "string" && meta.type.trim().length > 0) {
      const t = meta.type.toLowerCase();
      if (
        t.includes("image") ||
        t.includes("embedding") ||
        t.includes("audio") ||
        t.includes("transcription") ||
        t.includes("tts")
      ) {
        return false;
      }
      return true; // chat / text / llm / language
    }
    // No explicit metadata — use name heuristics (permissive for local servers)
    const id = entry.id.toLowerCase();
    if (ENHANCEMENT_NON_CHAT_PATTERNS.some((re) => re.test(id))) {
      return false;
    }
    return true;
  };

  const filtered = entries.filter(isChat);
  // Never leave the user with an empty list; fall back to all entries.
  return filtered.length > 0 ? filtered : entries;
}

/**
 * Determines if a model is free on OpenCode Zen.
 * Free models include IDs containing "free" plus "big-pickle" (a stealth free model).
 * The Zen /models API returns no pricing field, so the name heuristic is required.
 * @param {string} modelId - The model ID to check
 * @returns {boolean} true if the model is free on Zen
 */
export function isZenFreeModel(modelId) {
  const id = typeof modelId === "string" ? modelId.toLowerCase() : "";
  return id.includes("free") || id === "big-pickle";
}

/**
 * Determines if a base URL points to OpenCode Zen.
 * @param {string} baseUrl - The enhancement endpoint base URL
 * @returns {boolean} true if the URL is an OpenCode Zen endpoint
 */
export function isZenEndpoint(baseUrl) {
  return (
    typeof baseUrl === "string" && baseUrl.includes("opencode.ai/zen")
  );
}

/**
 * Parses an OpenAI-compatible /models response into a sorted list of chat model ids.
 * Pure function: no DOM, no network. Handles common response shapes and filters
 * non-chat models (embeddings, tts, image, etc.) without excluding local providers
 * that expose minimal metadata.
 * @param {object|Array} data - Parsed JSON response from GET {baseUrl}/models
 * @param {{ zenFreeOnly?: boolean }} [options] - When zenFreeOnly is true, filters to Zen free models only
 * @returns {string[]} Sorted, deduplicated chat model ids
 */
export function parseEnhancementModelsResponse(data, options: { zenFreeOnly?: boolean } = {}) {
  const entries = extractEnhancementModelEntries(data);
  let filtered = filterEnhancementChatModels(entries);
  if (options.zenFreeOnly) {
    filtered = filtered.filter((e) => isZenFreeModel(e.id));
  }
  return filtered.map((e) => e.id).sort((a, b) => a.localeCompare(b));
}

/**
 * Populates the enhancement model <select> with fetched model ids.
 * Preserves a saved model that is absent from the fetched list.
 */
function populateEnhancementModelSelect(select, modelIds, selectedModel) {
  select.innerHTML = "";
  modelIds.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    select.appendChild(option);
  });

  // Preserve a saved model that is absent from the fetched list
  if (selectedModel && !modelIds.includes(selectedModel)) {
    const option = document.createElement("option");
    option.value = selectedModel;
    option.textContent = `${selectedModel} (saved)`;
    select.insertBefore(option, select.firstChild);
  }

  if (
    selectedModel &&
    Array.from(select.options).some((opt: any) => opt.value === selectedModel)
  ) {
    select.value = selectedModel;
  } else if (modelIds.length > 0) {
    select.value = modelIds[0];
  }
}

/**
 * Switches the enhancement model UI to manual input mode (used on fetch failure).
 */
function switchEnhancementToManual() {
  const selectContainer = document.getElementById(
    "nig-enhancement-model-container-select",
  );
  const manualContainer = document.getElementById(
    "nig-enhancement-model-container-manual",
  );
  if (selectContainer) {
    selectContainer.style.display = "none";
  }
  if (manualContainer) {
    manualContainer.style.display = "block";
  }
}

/**
 * Fetches enhancement models from {enhancementBaseUrl}/models and populates the dropdown.
 * @param {string} baseUrl - Enhancement endpoint base URL
 * @param {string} apiKey - Optional Bearer token; empty for no-auth local servers
 */
export async function fetchEnhancementModels(baseUrl, apiKey) {
  const endpointUrl =
    typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
  if (!endpointUrl) {
    showToast("Please enter an Enhancement Endpoint URL first.", "error");
    return;
  }

  const key = typeof apiKey === "string" ? apiKey.trim() : "";
  const select = document.getElementById("nig-enhancement-model");
  if (!select) {
    return;
  }
  select.innerHTML = "<option>Fetching models...</option>";

  const { url, headers } = buildEnhancementModelsRequest(endpointUrl, key);

  logger.logInfo("NETWORK", `Fetching enhancement models from ${url}`);

  GM_xmlhttpRequest({
    method: "GET",
    url,
    headers,
    onload: async (response) => {
      try {
        const data = JSON.parse(response.responseText);
        const isZen = isZenEndpoint(endpointUrl);
        const zenFreeOnly = isZen && !key;
        const modelIds = parseEnhancementModelsResponse(data, { zenFreeOnly });
        if (modelIds.length === 0) {
          throw new Error("No chat/text models found at this endpoint.");
        }
        await cache.setCachedModels("enhancement", modelIds, endpointUrl);
        logger.logInfo(
          "NETWORK",
          `Fetched and cached ${modelIds.length} enhancement models`,
        );
        // Preserve the current selection (if it is a real model id) across refresh
        const currentModel =
          select.value &&
          !select.value.toLowerCase().includes("fetch") &&
          !select.value.toLowerCase().includes("enter")
            ? select.value
            : "";
        populateEnhancementModelSelect(select, modelIds, currentModel);
      } catch (error) {
        logger.logError("NETWORK", "Failed to parse enhancement models", {
          error: error.message,
        });
        select.innerHTML = "<option>Failed to fetch models</option>";
        showToast(
          `Failed to fetch enhancement models. Check the endpoint URL and API key. You can enter the model name manually. Error: ${error.message}`,
          "error",
        );
        switchEnhancementToManual();
      }
    },
    onerror: (error) => {
      logger.logError("NETWORK", "Failed to fetch enhancement models", {
        error,
      });
      select.innerHTML = "<option>Failed to fetch models</option>";
      showToast(
        "Failed to fetch enhancement models. Check your network connection and endpoint URL. Switching to manual input.",
        "error",
      );
      switchEnhancementToManual();
    },
  });
}

/**
 * Loads cached enhancement models (if available) into the dropdown and preserves
 * the saved model selection. Called when populating the enhancement settings.
 * For Zen endpoints with no API key and an empty cache, auto-fetches the free
 * model list so the dropdown is not blank.
 * @param selectedModel - The currently saved enhancement model name
 * @param baseUrl - The enhancement endpoint base URL (for cache validation)
 * @param apiKey - Optional API key (used to decide auto-fetch for Zen)
 */
export async function loadEnhancementModels(selectedModel, baseUrl, apiKey) {
  const select = document.getElementById("nig-enhancement-model");
  if (!select) {
    return;
  }

  const normalizedBaseUrl =
    typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";

  try {
    const cached = await cache.getCachedModelsForProvider("enhancement", normalizedBaseUrl);
    if (Array.isArray(cached) && cached.length > 0) {
      populateEnhancementModelSelect(select, cached, selectedModel);
      return;
    }
  } catch (error) {
    logger.logError("CACHE", "Failed to get cached enhancement models", {
      error: error.message,
    });
  }

  // No cache available: preserve the saved model or show a fetch prompt
  select.innerHTML = "";
  if (selectedModel && typeof selectedModel === "string" && selectedModel.trim()) {
    const option = document.createElement("option");
    option.value = selectedModel;
    option.textContent = `${selectedModel} (saved — click Fetch to refresh list)`;
    select.appendChild(option);
    select.value = selectedModel;
  } else {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Enter endpoint URL and fetch...";
    select.appendChild(option);
  }

  // Auto-fetch Zen free models when endpoint is Zen and no API key is set.
  // Zen free models work without authentication, so auto-fetch is safe and
  // prevents a blank dropdown for existing users after migration.
  if (isZenEndpoint(normalizedBaseUrl) && !apiKey) {
    logger.logInfo(
      "NETWORK",
      "Auto-fetching Zen free models for enhancement dropdown",
    );
    fetchEnhancementModels(normalizedBaseUrl, apiKey);
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
  ).map((cb: any) => cb.value);
  await storage.setConfigValue("aiHordePostProcessing", postProcessing);

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
