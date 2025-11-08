import { DEFAULTS } from '../config/defaults.js';

/**
 * Retrieves a single configuration value from storage.
 * @param {string} key - The key of the config value to retrieve.
 * @returns {Promise<any>} The value from storage or the default value.
 */
export async function getConfigValue(key) {
    return await GM_getValue(key, DEFAULTS[key]);
}

/**
 * Retrieves the entire configuration object from storage.
 * @returns {Promise<object>} The complete configuration object.
 */
export async function getConfig() {
    const config = {};
    for (const key in DEFAULTS) {
        config[key] = await GM_getValue(key, DEFAULTS[key]);
    }
    return config;
}

/**
 * Sets a configuration value in storage.
 * @param {string} key - The key of the config value to set.
 * @param {any} value - The value to store.
 */
export async function setConfigValue(key, value) {
    await GM_setValue(key, value);
}

/**
 * Retrieves the generation history from storage.
 * @returns {Promise<Array<object>>} The history array.
 */
export async function getHistory() {
    try {
        const historyData = await GM_getValue('history', '[]');
        if (typeof historyData === 'string' && historyData.trim()) {
            return JSON.parse(historyData);
        } else if (Array.isArray(historyData)) {
            return historyData;
        } else {
            // Invalid or empty data, return empty array
            return [];
        }
    } catch (error) {
        console.error('Failed to parse history data, resetting', error);
        // Clear the corrupted history and return empty array
        await GM_setValue('history', '[]');
        return [];
    }
}

/**
 * Adds a new item to the generation history.
 * @param {object} item - The history item to add.
 */
export async function addToHistory(item) {
    const history = await getHistory();
    history.unshift(item);
    // Limit history to the last 100 entries
    if (history.length > 100) {
        history.pop();
    }
    await GM_setValue('history', JSON.stringify(history));
}