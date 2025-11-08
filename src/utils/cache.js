import { log, logInfo } from './logger.js';

export const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedModels() {
    try {
        const cachedData = await GM_getValue('cachedModels', '{}');
        if (typeof cachedData === 'string' && cachedData.trim()) {
            return JSON.parse(cachedData);
        } else if (typeof cachedData === 'object' && cachedData !== null) {
            return cachedData;
        } else {
            // Invalid or empty data, return empty object
            return {};
        }
    } catch (error) {
        log('error', 'CACHE', 'Failed to parse cached models data, resetting cache', { error: error.message });
        // Clear the corrupted cache and return empty object
        await GM_setValue('cachedModels', '{}');
        return {};
    }
}

export async function setCachedModels(provider, models) {
    try {
        const cache = await getCachedModels();
        cache[provider] = models;
        await GM_setValue('cachedModels', JSON.stringify(cache));
        log('info', 'CACHE', `Cached models for ${provider}`);
    } catch (error) {
        log('error', 'CACHE', 'Failed to cache models', { provider, error: error.message });
        // Try to reset the cache and retry once
        await GM_setValue('cachedModels', '{}');
        try {
            cache[provider] = models;
            await GM_setValue('cachedModels', JSON.stringify(cache));
            log('info', 'CACHE', `Cached models for ${provider} after cache reset`);
        } catch (retryError) {
            log('error', 'CACHE', 'Failed to cache models even after reset', { provider, error: retryError.message });
        }
    }
}

export async function clearCachedModels(provider = null) {
    try {
        if (provider) {
            const cache = await getCachedModels();
            delete cache[provider];
            await GM_setValue('cachedModels', JSON.stringify(cache));
            logInfo('CACHE', `Cleared cached models for ${provider}.`);
        } else {
            // Only clear the cached models, preserve all profile data
            // The profiles contain important user data like base URLs and API keys
            // that should not be affected by cache clearing
            await clearCachedOpenAICompatModels();

            logInfo('CACHE', 'Cleared all cached models and reset OpenAI Compatible model selections.');
            alert('All cached models have been cleared. They will be re-fetched when you next open the settings.');
        }
    } catch (error) {
        log('error', 'CACHE', 'Failed to clear cached models', { provider, error: error.message });
        // Force reset cache as fallback
        try {
            await GM_setValue('cachedModels', '{}');
            // Only reset the models cache, preserve profile data
            log('info', 'CACHE', 'Force reset cache data as fallback');
        } catch (fallbackError) {
            log('error', 'CACHE', 'Failed to force reset cache', { error: fallbackError.message });
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
        const cachedData = await GM_getValue(cacheKey, '[]');
        if (typeof cachedData === 'string' && cachedData.trim()) {
            return JSON.parse(cachedData);
        } else if (Array.isArray(cachedData)) {
            return cachedData;
        } else {
            return [];
        }
    } catch (error) {
        log('error', 'CACHE', 'Failed to parse OpenAI compatible models cache', { profileUrl, error: error.message });
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
        log('info', 'CACHE', `Cached models for OpenAI compatible provider: ${profileUrl}`);
    } catch (error) {
        log('error', 'CACHE', 'Failed to cache OpenAI compatible models', { profileUrl, error: error.message });
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
            const profilesData = await GM_getValue('openAICompatProfiles', '{}');
            if (typeof profilesData === 'string' && profilesData.trim()) {
                profiles = JSON.parse(profilesData);
            } else if (typeof profilesData === 'object' && profilesData !== null) {
                profiles = profilesData;
            }
        } catch (error) {
            log('error', 'CACHE', 'Failed to get OpenAI profiles for cache clearing', { error: error.message });
            return;
        }

        // Clear cache for each known profile
        for (const profileUrl of Object.keys(profiles)) {
            const cacheKey = `openAICompatModels_${profileUrl}`;
            await GM_setValue(cacheKey, '[]');
        }
        
        logInfo('CACHE', 'Cleared cached models for all OpenAI compatible providers.');
    } catch (error) {
        log('error', 'CACHE', 'Failed to clear OpenAI compatible model caches', { error: error.message });
    }
}