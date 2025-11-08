import { log, logInfo } from './logger.js';

export const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedModels() {
    return JSON.parse(await GM_getValue('cachedModels', '{}'));
}

export async function setCachedModels(provider, models) {
    const cache = await getCachedModels();
    cache[provider] = models;
    await GM_setValue('cachedModels', JSON.stringify(cache));
}

export async function clearCachedModels(provider = null) {
    if (provider) {
        const cache = await getCachedModels();
        delete cache[provider];
        await GM_setValue('cachedModels', JSON.stringify(cache));
        logInfo('CACHE', `Cleared cached models for ${provider}.`);
    } else {
        await GM_setValue('cachedModels', '{}');
        const profiles = JSON.parse(await GM_getValue('openAICompatProfiles', '{}'));
        for (const url in profiles) {
            profiles[url].model = '';
        }
        await GM_setValue('openAICompatProfiles', JSON.stringify(profiles));
        await GM_setValue('openAICompatModelManualInput', false);
        await GM_setValue('openAICompatActiveProfileUrl', '');

        logInfo('CACHE', 'Cleared all cached models and reset OpenAI Compatible model selections.');
        alert('All cached models have been cleared. They will be re-fetched when you next open the settings.');
    }
}