// --- IMPORTS ---
import {
  updateVisibleSettings,
  updateSubStyles,
  exportConfig,
  handleImportFile,
} from "../config/configManager";
import * as cache from "../utils/cache";
import * as storage from "../utils/storage";
import * as logger from "../utils/logger";
import * as models from "../api/models";
import { PROMPT_CATEGORIES } from "../config/styles";
import { showToast, showConfirm, escapeHtml } from "../utils/uiUtils";
import { updateEnhancementUI } from "./enhancementPanel";
import {
  populateHistoryTab,
  cleanHistory,
  handleHistoryDaysChange,
} from "./historyManager";

/**
 * Initialize show/hide toggles for all password-like API key fields.
 * This is UI-only and does not affect storage, validation, or submission behavior.
 */
function initializePasswordVisibilityToggles(panelElement) {
  try {
    const toggles = panelElement.querySelectorAll(".nig-password-toggle");
    if (!toggles || toggles.length === 0) {
      // Graceful no-op: ensure keys remain hidden by default.
      return;
    }

    toggles.forEach((toggleBtn) => {
      // Avoid double-binding if panel is re-initialized.
      if (toggleBtn.dataset.nigToggleBound === "true") {
        return;
      }
      toggleBtn.dataset.nigToggleBound = "true";

      toggleBtn.addEventListener("click", (event) => {
        try {
          event.preventDefault();
          event.stopPropagation();

          const targetId = toggleBtn.getAttribute("data-target");
          if (!targetId) {
            return;
          }

          const input = panelElement.querySelector(`#${CSS.escape(targetId)}`);
          if (!input) {
            return;
          }

          const isCurrentlyHidden = input.type === "password";
          input.type = isCurrentlyHidden ? "text" : "password";

          const icon = toggleBtn.querySelector(".material-symbols-outlined");
          if (icon) {
            icon.textContent = isCurrentlyHidden
              ? "visibility"
              : "visibility_off";
          }

          toggleBtn.setAttribute(
            "aria-pressed",
            isCurrentlyHidden ? "true" : "false",
          );
          toggleBtn.setAttribute(
            "aria-label",
            isCurrentlyHidden ? "Hide API key" : "Show API key",
          );
        } catch (err) {
          // Safety: log but do not break other behaviors.
          try {
            logger.logError("UI", "Failed to toggle API key visibility", {
              error: err.message,
            });
          } catch (_) {
            // Swallow if logger itself is unavailable in this context.
          }
        }
      });
    });
  } catch (error) {
    // If anything unexpected happens, API keys remain masked by default.
    try {
      logger.logError("UI", "Failed to initialize API key visibility toggles", {
        error: error.message,
      });
    } catch (_) {
      // Swallow secondary errors.
    }
  }
}

// --- PUBLIC FUNCTIONS ---

/**
 * Sets up all the tab functionality event listeners with ARIA keyboard navigation.
 * Implements the WAI-ARIA Tabs pattern: ArrowLeft/ArrowRight to move between
 * tabs, Home/End for first/last, and activation on click or Enter/Space.
 */
export function setupTabEventListeners(panelElement) {
  // Initialize password visibility toggles once panel DOM is ready
  initializePasswordVisibilityToggles(panelElement);

  const tabs = Array.from(panelElement.querySelectorAll(".nig-tab")) as any[];

  function activateTab(tab) {
    panelElement
      .querySelectorAll(".nig-tab, .nig-tab-content")
      .forEach((el) => {
        el.classList.remove("active");
        if (el.classList.contains("nig-tab")) {
          el.setAttribute("aria-selected", "false");
          el.setAttribute("tabindex", "-1");
        }
      });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.focus();
    panelElement
      .querySelector(`#${tab.getAttribute("aria-controls")}`)
      .classList.add("active");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      activateTab(tab);
      if (tab.dataset.tab === "history") {
        await populateHistoryTab();
        panelElement.querySelector("#nig-save-btn").style.display = "none";
      } else {
        panelElement.querySelector("#nig-save-btn").style.display = "block";
      }
    });

    // Keyboard navigation per WAI-ARIA Tabs pattern
    tab.addEventListener("keydown", async (e) => {
      const currentIndex = tabs.indexOf(tab);
      let newIndex = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = tabs.length - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        newIndex = currentIndex;
      }

      if (newIndex !== null) {
        const targetTab = tabs[newIndex];
        activateTab(targetTab);
        if (targetTab.dataset.tab === "history") {
          await populateHistoryTab();
          panelElement.querySelector("#nig-save-btn").style.display = "none";
        } else {
          panelElement.querySelector("#nig-save-btn").style.display = "block";
        }
      }
    });
  });
}

/**
 * Sets up provider settings event listeners
 */
export function setupProviderEventListeners(panelElement) {
  // Provider selection change
  panelElement
    .querySelector("#nig-provider")
    .addEventListener("change", (_e) => {
      updateVisibleSettings();
    });
}

/**
 * Sets up OpenAI Compatible functionality event listeners
 */
export function setupOpenAIEventListeners(panelElement) {
  // OpenAI Compatible fetch models
  panelElement
    .querySelector("#nig-openai-compat-fetch-models")
    .addEventListener("click", () => {
      models.fetchOpenAICompatModels();
    });

  // OpenAI Compatible profile selection
  panelElement
    .querySelector("#nig-openai-compat-profile-select")
    .addEventListener("change", models.loadSelectedOpenAIProfile);

  // OpenAI Compatible delete profile
  panelElement
    .querySelector("#nig-openai-compat-delete-profile")
    .addEventListener("click", models.deleteSelectedOpenAIProfile);

  // Switch to manual input mode
  panelElement
    .querySelector("#nig-openai-compat-switch-to-manual")
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "none";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "block";
    });

  // Switch back to select mode
  panelElement
    .querySelector("#nig-openai-compat-switch-to-select")
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(
        "nig-openai-model-container-select",
      ).style.display = "block";
      document.getElementById(
        "nig-openai-model-container-manual",
      ).style.display = "none";
    });
}

/**
 * Sets up utility function event listeners
 */
export function setupUtilityEventListeners(panelElement) {
  // Export configuration
  panelElement
    .querySelector("#nig-export-btn")
    .addEventListener("click", exportConfig);

  // Import configuration
  panelElement
    .querySelector("#nig-import-file")
    .addEventListener("change", handleImportFile);

  // History cleanup
  panelElement
    .querySelector("#nig-history-clean-btn")
    .addEventListener("click", cleanHistory);

  // Auto-save history days setting when input changes
  panelElement
    .querySelector("#nig-history-clean-days")
    .addEventListener("change", handleHistoryDaysChange);

  // Clear cache
  panelElement
    .querySelector("#nig-clear-cache-btn")
    .addEventListener("click", () => cache.clearCachedModels());
}

/**
 * Sets up logging functionality event listeners
 */
export function setupLoggingEventListeners(panelElement) {
  // Toggle console logging and enhancement logs
  panelElement
    .querySelector("#nig-toggle-logging-btn")
    .addEventListener("click", async () => {
      const currentState = await storage.getConfigValue("loggingEnabled");
      const newState = !currentState;
      await storage.setConfigValue("loggingEnabled", newState);
      await logger.updateLoggingStatus();
      await logger.loadEnhancementLogHistory();
      showToast(
        `Debug Console & Enhancement Logs are now ${newState ? "ENABLED" : "DISABLED"}.`,
        "info",
      );
    });

  // View enhancement logs
  panelElement
    .querySelector("#nig-view-enhancement-logs-btn")
    .addEventListener("click", async () => {
      const logs = await logger.getEnhancementLogHistory();
      if (logs.length === 0) {
        showToast(
          "No enhancement logs found. Enhancement logging is disabled or no enhancement operations have been performed yet.",
          "info",
        );
        return;
      }
      // Create logs modal
      const logModal = document.createElement("div");
      logModal.className = "nig-modal-overlay";
      logModal.innerHTML = `
            <div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-logs-title">
                <button type="button" class="nig-close-btn" aria-label="Close logs dialog">&times;</button>
                <h2 id="nig-logs-title">Enhancement Operation Logs</h2>
                <p>Detailed logs of prompt enhancement operations with timestamps and performance data.</p>
                <div style="max-height: 400px; overflow-y: auto; background: var(--nig-color-bg-tertiary); border-radius: var(--nig-radius-md); padding: var(--nig-space-lg); margin: var(--nig-space-lg) 0;">
                    <div id="nig-enhancement-logs-display"></div>
                </div>
            </div>
        `;
      document.body.appendChild(logModal);

      const logsDisplay = logModal.querySelector(
        "#nig-enhancement-logs-display",
      );
      logs.slice(0, 50).forEach((log) => {
        // Format the log entry similar to the original formatLogEntry function
        const time = new Date(log.timestamp || log.time).toLocaleString();
        const levelColors = {
          ERROR: "#ef4444",
          WARN: "#f59e0b",
          INFO: "#6366f1",
          DEBUG: "#8b5cf6",
        };
        const color = levelColors[log.level?.toUpperCase()] || "#6366f1";

        const logEntry = document.createElement("div");
        logEntry.style.cssText = `
                padding: var(--nig-space-sm) 0;
                border-bottom: 1px solid var(--nig-color-border);
                font-family: 'Fira Code', monospace;
                font-size: var(--nig-font-size-xs);
            `;
        logEntry.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--nig-space-sm); margin-bottom: var(--nig-space-xs);">
                    <span style="color: ${color}; font-weight: 600;">[${escapeHtml(log.level?.toUpperCase() || "INFO")}]</span>
                    <span style="color: var(--nig-color-text-muted); font-size: var(--nig-font-size-xs);">${escapeHtml(time)}</span>
                    <span style="color: var(--nig-color-accent-primary); font-weight: 500;">[${escapeHtml(log.category || "LOG")}]</span>
                </div>
                <div style="color: var(--nig-color-text-primary); margin-bottom: var(--nig-space-xs);">${escapeHtml(log.message || "No message")}</div>
                ${log.data ? `<pre style="color: var(--nig-color-text-secondary); font-size: var(--nig-font-size-xs); background: var(--nig-color-bg-primary); padding: var(--nig-space-sm); border-radius: var(--nig-radius-sm); margin: 0; overflow-x: auto;">${escapeHtml(JSON.stringify(log.data, null, 2))}</pre>` : ""}
            `;
        logsDisplay.appendChild(logEntry);
      });

      logModal
        .querySelector(".nig-close-btn")
        .addEventListener("click", () => logModal.remove());
    });

  // Clear enhancement logs
  panelElement
    .querySelector("#nig-clear-enhancement-logs-btn")
    .addEventListener("click", async () => {
      const logs = await logger.getEnhancementLogHistory();
      if (logs.length === 0) {
        showToast("No enhancement logs to clear.", "info");
        return;
      }
      const shouldClear = await showConfirm(
        `Are you sure you want to clear all ${logs.length} enhancement logs? This action cannot be undone.`,
        "Clear Enhancement Logs",
      );
      if (shouldClear) {
        logger.clearEnhancementLogs();
        showToast("All enhancement logs have been cleared.", "success");
      }
    });
}

/**
 * Sets up style functionality event listeners
 */
export function setupStyleEventListeners(panelElement) {
  // Main style change
  panelElement
    .querySelector("#nig-main-style")
    .addEventListener("change", (e) => {
      updateSubStyles(e.target.value);
    });

  // Sub style change
  panelElement
    .querySelector("#nig-sub-style")
    .addEventListener("change", () => {
      const subStyle = panelElement.querySelector("#nig-sub-style").value;
      const subStyleDesc = document.getElementById("nig-sub-style-desc");
      const selectedCategory = PROMPT_CATEGORIES.find(
        (cat) =>
          cat.name === panelElement.querySelector("#nig-main-style").value,
      );
      const selectedSubStyle = selectedCategory
        ? selectedCategory.subStyles.find((sub) => sub.value === subStyle)
        : null;
      subStyleDesc.textContent = selectedSubStyle
        ? selectedSubStyle.description
        : "";
    });
}

/**
 * Sets up custom style toggle event listeners
 */
export function setupCustomStyleEventListeners(panelElement) {
  const customStyleEnable = panelElement.querySelector(
    "#nig-custom-style-enable",
  );
  const customStyleText = panelElement.querySelector("#nig-custom-style-text");

  customStyleEnable.addEventListener("change", () => {
    customStyleText.disabled = !customStyleEnable.checked;
  });
}

/**
 * Sets up provider change listener for enhancement UI
 */
export function setupProviderEnhancementListener(panelElement) {
  panelElement
    .querySelector("#nig-provider")
    .addEventListener("change", async (e) => {
      const newProvider = e.target.value;
      const config = await storage.getConfig();
      updateEnhancementUI(newProvider, config);
    });
}
