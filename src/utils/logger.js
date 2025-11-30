import { getConfigValue } from "./storage.js";

let loggingEnabled = false;
let enhancementLogHistory = [];

/**
 * Updates the logging status from storage. Should be called on init.
 */
export async function updateLoggingStatus() {
  loggingEnabled = await getConfigValue("loggingEnabled");
}

/**
 * The core logging function.
 * @param {'info'|'debug'|'warn'|'error'} level - The log level.
 * @param {string} category - The category of the log (e.g., 'UI', 'API').
 * @param {string} message - The log message.
 * @param {any} [data=null] - Optional data to log.
 */
export function log(level, category, message, data = null) {
  const normalizedLevel = (level || "").toLowerCase();

  // Always log critical errors and warnings, regardless of toggle state
  const isCritical =
    normalizedLevel === "error" ||
    normalizedLevel === "warn" ||
    category === "SECURITY" ||
    category === "ERROR" ||
    category === "APP" ||
    category === "CONFIG_IMPORT";

  if (!loggingEnabled && !isCritical) {
    // When logging is disabled, completely suppress debug/info and non-critical logs
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: normalizedLevel,
    category,
    message,
    data,
  };

  const prefix = `[NIG-${normalizedLevel.toUpperCase()}]`;
  const categoryPrefix = `[${category}]`;
  const style = {
    error: "color: #ef4444",
    warn: "color: #f59e0b",
    debug: "color: #8b5cf6",
    info: "color: #6366f1",
  }[normalizedLevel];

  // Route to appropriate console method, ensuring critical visibility
  const consoleMethod = (() => {
    if (normalizedLevel === "error") {
      return console.error;
    }
    if (normalizedLevel === "warn") {
      return console.warn;
    }
    if (normalizedLevel === "info") {
      return console.info;
    }
    if (normalizedLevel === "debug") {
      return console.debug || console.log;
    }
    return console.log;
  })();

  if (data !== null && data !== undefined) {
    consoleMethod(`%c${prefix}`, style, categoryPrefix, message, data);
  } else {
    consoleMethod(`%c${prefix}`, style, categoryPrefix, message);
  }

  // Persist enhancement-related logs for history when logging is enabled
  if (loggingEnabled && category === "ENHANCEMENT") {
    enhancementLogHistory.unshift(logEntry);
    if (enhancementLogHistory.length > 50) {
      enhancementLogHistory = enhancementLogHistory.slice(0, 50);
    }
    GM_setValue(
      "enhancementLogHistory",
      JSON.stringify(enhancementLogHistory.slice(0, 20)),
    );
  }
}

// Convenience methods for different log levels
export const logInfo = (category, message, data) =>
  log("info", category, message, data);
export const logDebug = (category, message, data) =>
  log("debug", category, message, data);
export const logWarn = (category, message, data) =>
  log("warn", category, message, data);
export const logError = (category, message, data) =>
  log("error", category, message, data);

/**
 * Loads enhancement log history from storage.
 */
export async function loadEnhancementLogHistory() {
  try {
    const stored = await GM_getValue("enhancementLogHistory", "[]");
    if (typeof stored === "string" && stored.trim()) {
      enhancementLogHistory = JSON.parse(stored);
    } else if (Array.isArray(stored)) {
      enhancementLogHistory = stored;
    } else {
      enhancementLogHistory = [];
    }
    logDebug(
      "LOG",
      `Loaded ${enhancementLogHistory.length} enhancement log entries from storage`,
    );
  } catch (e) {
    logError("LOG", "Failed to load enhancement log history", e);
    enhancementLogHistory = [];
    // Clear corrupted data
    try {
      await GM_setValue("enhancementLogHistory", "[]");
    } catch (clearError) {
      logError(
        "LOG",
        "Failed to clear corrupted enhancement log history",
        clearError,
      );
    }
  }
}

export async function getEnhancementLogHistory() {
  await loadEnhancementLogHistory();
  return enhancementLogHistory;
}

export function clearEnhancementLogs() {
  enhancementLogHistory = [];
  GM_setValue("enhancementLogHistory", "[]");
  logInfo("LOG", "Enhancement logs cleared by user");
}

export function formatLogEntry(entry) {
  const time = new Date(entry.timestamp).toLocaleString();
  const levelColors = {
    ERROR: "#ef4444",
    WARN: "#f59e0b",
    INFO: "#6366f1",
    DEBUG: "#8b5cf6",
  };
  const color = levelColors[entry.level.toUpperCase()] || "#6366f1";

  return {
    time,
    level: entry.level,
    category: entry.category,
    message: entry.message,
    color,
    data: entry.data,
  };
}
