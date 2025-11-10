/**
 * Core application module for WTR Lab Novel Image Generator
 * This module provides the main application entry point and coordinates between different components
 */

import * as storage from "../utils/storage.js";
import * as logger from "../utils/logger.js";
import * as configPanel from "../components/configPanel.js";

export const App = {
  /**
   * Initialize the application
   */
  async init() {
    try {
      await logger.updateLoggingStatus();

      // Initialize config panel
      configPanel.initialize();

      // Clean up old history entries
      await this.cleanupHistory();

      logger.logInfo(
        "APP",
        "WTR Lab Novel Image Generator initialized successfully",
      );
    } catch (error) {
      logger.logError("APP", "Failed to initialize application", {
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Clean up old history entries
   */
  async cleanupHistory() {
    try {
      const removedCount = await storage.cleanOldHistory();
      if (removedCount > 0) {
        logger.logInfo(
          "APP",
          `Cleaned ${removedCount} old history entries on startup`,
        );
      }
    } catch (error) {
      logger.logError("APP", "Failed to clean old history entries", {
        error: error.message,
      });
    }
  },

  /**
   * Show configuration panel
   */
  showConfig() {
    configPanel.show();
  },
};

// Auto-initialize when the module is imported
if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
} else {
  // If DOM is already loaded, initialize immediately
  App.init();
}
