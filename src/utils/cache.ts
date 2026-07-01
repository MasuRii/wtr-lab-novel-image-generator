import { log, logInfo } from "./logger";
import { showToast } from "./uiUtils";

export const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const CACHE_SCHEMA_VERSION = 2;

// Cache entry shape (schema v2):
//   { models: any[], timestamp: number, endpoint?: string, schemaVersion: number }
//
// Legacy shape (schema v1 / unversioned):
//   { [provider]: any[] }  ← bare array of models with no metadata
// Legacy entries are treated as cache misses and overwritten on next fetch.

/**
 * Validates a cache entry against the current schema, TTL, and endpoint.
 * @param entry - The cache entry to validate
 * @param endpoint - Optional endpoint URL that must match the stored value
 * @returns true if the entry is valid, fresh, and endpoint-matched
 */
function isCacheEntryValid(entry: any, endpoint?: string): boolean {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return false;
  }
  if (entry.schemaVersion !== CACHE_SCHEMA_VERSION) {
    return false;
  }
  if (typeof entry.timestamp !== "number") {
    return false;
  }
  if (Date.now() - entry.timestamp > CACHE_EXPIRATION_MS) {
    return false;
  }
  if (
    endpoint &&
    typeof entry.endpoint === "string" &&
    entry.endpoint !== endpoint
  ) {
    return false;
  }
  if (!Array.isArray(entry.models)) {
    return false;
  }
  return true;
}

export async function getCachedModels() {
  try {
    const cachedData = await GM_getValue("cachedModels", "{}");
    if (typeof cachedData === "string" && cachedData.trim()) {
      return JSON.parse(cachedData);
    } else if (typeof cachedData === "object" && cachedData !== null) {
      return cachedData;
    } else {
      // Invalid or empty data, return empty object
      return {};
    }
  } catch (error) {
    log(
      "error",
      "CACHE",
      "Failed to parse cached models data, resetting cache",
      { error: error.message },
    );
    // Clear the corrupted cache and return empty object
    await GM_setValue("cachedModels", "{}");
    return {};
  }
}

/**
 * Gets cached models for a specific provider.
 * Returns the models array only when the cache entry is valid (correct schema
 * version, not expired, endpoint matches). Legacy bare-array entries and
 * expired/endpoint-mismatched entries are treated as cache misses (null).
 * @param provider - The provider name (e.g. 'pollinations', 'aiHorde')
 * @param endpoint - Optional endpoint URL to validate against the stored value
 * @returns {Promise<Array|null>} Array of cached models or null if not found/expired
 */
export async function getCachedModelsForProvider(provider, endpoint?) {
  try {
    const cache = await getCachedModels();
    const entry = cache[provider];
    if (isCacheEntryValid(entry, endpoint)) {
      return entry.models;
    }
    return null;
  } catch (error) {
    log("error", "CACHE", `Failed to get cached models for ${provider}`, {
      error: error.message,
    });
    return null;
  }
}

/**
 * Sets cached models for a specific provider with timestamp, endpoint, and
 * schema version metadata so the cache can auto-expire and invalidate on
 * endpoint changes.
 * @param provider - The provider name
 * @param models - Array of model objects/strings to cache
 * @param endpoint - Optional endpoint URL the models were fetched from
 */
export async function setCachedModels(provider, models, endpoint?) {
  try {
    const cache = await getCachedModels();
    cache[provider] = {
      models: models,
      timestamp: Date.now(),
      endpoint: endpoint || null,
      schemaVersion: CACHE_SCHEMA_VERSION,
    };
    await GM_setValue("cachedModels", JSON.stringify(cache));
    log("info", "CACHE", `Cached models for ${provider}`);
  } catch (error) {
    log("error", "CACHE", "Failed to cache models", {
      provider,
      error: error.message,
    });
    // Try to reset the cache and retry once
    await GM_setValue("cachedModels", "{}");
    try {
      const resetCache = await getCachedModels();
      resetCache[provider] = models;
      await GM_setValue("cachedModels", JSON.stringify(resetCache));
      log("info", "CACHE", `Cached models for ${provider} after cache reset`);
    } catch (retryError) {
      log("error", "CACHE", "Failed to cache models even after reset", {
        provider,
        error: retryError.message,
      });
    }
  }
}

export async function clearCachedModels(provider = null) {
  try {
    if (provider) {
      const cache = await getCachedModels();
      delete cache[provider];
      await GM_setValue("cachedModels", JSON.stringify(cache));
      logInfo("CACHE", `Cleared cached models for ${provider}.`);
    } else {
      // Only clear the cached models, preserve all profile data
      // The profiles contain important user data like base URLs and API keys
      // that should not be affected by cache clearing
      await clearCachedOpenAICompatModels();

      // Also clear the main cached models (Pollinations, AI Horde, etc.)
      await GM_setValue("cachedModels", "{}");

      logInfo(
        "CACHE",
        "Cleared all cached models and reset OpenAI Compatible model selections.",
      );
      showToast(
        "All cached models have been cleared. They will be re-fetched when you next open the settings.",
        "success",
      );
    }
  } catch (error) {
    log("error", "CACHE", "Failed to clear cached models", {
      provider,
      error: error.message,
    });
    // Force reset cache as fallback
    try {
      await GM_setValue("cachedModels", "{}");
      // Only reset the models cache, preserve profile data
      log("info", "CACHE", "Force reset cache data as fallback");
    } catch (fallbackError) {
      log("error", "CACHE", "Failed to force reset cache", {
        error: fallbackError.message,
      });
    }
  }
}

// --- OpenAI Compatible Provider Caching Functions ---

/**
 * Gets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @returns {Promise<Array>} Array of cached model objects or empty array
 */
export async function getCachedOpenAICompatModels(profileUrl) {
  try {
    const cacheKey = `openAICompatModels_${profileUrl}`;
    const cachedData = await GM_getValue(cacheKey, "[]");
    if (typeof cachedData === "string" && cachedData.trim()) {
      return JSON.parse(cachedData);
    } else if (Array.isArray(cachedData)) {
      return cachedData;
    } else {
      return [];
    }
  } catch (error) {
    log("error", "CACHE", "Failed to parse OpenAI compatible models cache", {
      profileUrl,
      error: error.message,
    });
    return [];
  }
}

/**
 * Sets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @param {Array} models - Array of model objects to cache
 */
export async function setCachedOpenAICompatModels(profileUrl, models) {
  try {
    const cacheKey = `openAICompatModels_${profileUrl}`;
    await GM_setValue(cacheKey, JSON.stringify(models));
    log(
      "info",
      "CACHE",
      `Cached models for OpenAI compatible provider: ${profileUrl}`,
    );
  } catch (error) {
    log("error", "CACHE", "Failed to cache OpenAI compatible models", {
      profileUrl,
      error: error.message,
    });
  }
}

/**
 * Clears cached models for all OpenAI compatible providers
 */
export async function clearCachedOpenAICompatModels() {
  try {
    // Get the profiles to know which cache keys to clear
    let profiles = {};
    try {
      const profilesData = await GM_getValue("openAICompatProfiles", "{}");
      if (typeof profilesData === "string" && profilesData.trim()) {
        profiles = JSON.parse(profilesData);
      } else if (typeof profilesData === "object" && profilesData !== null) {
        profiles = profilesData;
      }
    } catch (error) {
      log(
        "error",
        "CACHE",
        "Failed to get OpenAI profiles for cache clearing",
        { error: error.message },
      );
      return;
    }

    // Clear cache for each known profile
    for (const profileUrl of Object.keys(profiles)) {
      const cacheKey = `openAICompatModels_${profileUrl}`;
      await GM_setValue(cacheKey, "[]");
    }

    logInfo(
      "CACHE",
      "Cleared cached models for all OpenAI compatible providers.",
    );
  } catch (error) {
    log("error", "CACHE", "Failed to clear OpenAI compatible model caches", {
      error: error.message,
    });
  }
}
