import { DEFAULTS } from "../config/defaults.js";
import { filterExpiredLinks } from "./linkValidator.js";

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
    const historyData = await GM_getValue("history", "[]");
    if (typeof historyData === "string" && historyData.trim()) {
      return JSON.parse(historyData);
    } else if (Array.isArray(historyData)) {
      return historyData;
    } else {
      // Invalid or empty data, return empty array
      return [];
    }
  } catch (error) {
    console.error("Failed to parse history data, resetting", error);
    // Clear the corrupted history and return empty array
    await GM_setValue("history", "[]");
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
  await GM_setValue("history", JSON.stringify(history));
}

/**
 * Retrieves the history days setting from storage.
 * @returns {Promise<number>} The number of days for history retention.
 */
export async function getHistoryDays() {
  try {
    const days = await GM_getValue("historyDays", DEFAULTS.historyDays);
    // Validate and ensure the value is a positive number
    const parsedDays = parseInt(days);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      console.warn("Invalid historyDays value, using default:", days);
      await setHistoryDays(DEFAULTS.historyDays);
      return DEFAULTS.historyDays;
    }
    return parsedDays;
  } catch (error) {
    console.error("Failed to get historyDays setting:", error);
    return DEFAULTS.historyDays;
  }
}

/**
 * Sets the history days setting in storage.
 * @param {number} days - The number of days to retain history.
 */
export async function setHistoryDays(days) {
  try {
    // Validate the input
    const parsedDays = parseInt(days);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      throw new Error(
        `Invalid historyDays value: ${days}. Must be between 1 and 365.`,
      );
    }
    await GM_setValue("historyDays", parsedDays);
    return true;
  } catch (error) {
    console.error("Failed to set historyDays:", error);
    throw error;
  }
}

/**
 * Gets filtered history based on the configured days setting.
 * @returns {Promise<Array<object>>} The filtered history array.
 */
export async function getFilteredHistory() {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    return history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });
  } catch (error) {
    console.error("Failed to get filtered history:", error);
    return await getHistory(); // Fallback to unfiltered history
  }
}

/**
 * Cleans old history entries based on the configured days setting.
 * @returns {Promise<number>} The number of entries removed.
 */
export async function cleanOldHistory() {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    const filteredHistory = history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });

    const removedCount = history.length - filteredHistory.length;

    if (removedCount > 0) {
      await GM_setValue("history", JSON.stringify(filteredHistory));
    }

    return removedCount;
  } catch (error) {
    console.error("Failed to clean old history:", error);
    throw error;
  }
}

/**
 * Enhanced cleaning function that removes both expired links and old entries.
 * @param {Function} progressCallback - Optional callback for progress updates during link validation
 * @returns {Promise<Object>} Object containing cleaning statistics.
 */
export async function cleanHistoryEnhanced(progressCallback = null) {
  try {
    const history = await getHistory();
    const historyDays = await getHistoryDays();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - historyDays);

    // Step 1: Filter out old entries based on age
    const ageFilteredHistory = history.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate > cutoffDate;
    });

    const oldEntriesRemoved = history.length - ageFilteredHistory.length;

    // Step 2: Filter out entries with broken/expired links
    const linkValidationResult = await filterExpiredLinks(
      ageFilteredHistory,
      progressCallback,
    );
    const expiredLinksRemoved = linkValidationResult.expiredLinksCount;
    const finalFilteredHistory = linkValidationResult.filteredHistory;

    // Step 3: Save the cleaned history
    const totalRemoved = oldEntriesRemoved + expiredLinksRemoved;
    if (totalRemoved > 0) {
      await GM_setValue("history", JSON.stringify(finalFilteredHistory));
    }

    return {
      totalRemoved: totalRemoved,
      oldEntriesRemoved: oldEntriesRemoved,
      expiredLinksRemoved: expiredLinksRemoved,
      totalLinksChecked: linkValidationResult.totalLinksChecked,
      finalHistoryCount: finalFilteredHistory.length,
    };
  } catch (error) {
    console.error("Failed to clean history with enhanced method:", error);
    throw error;
  }
}
