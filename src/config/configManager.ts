// --- IMPORTS ---
import { showToast, showConfirm } from "../utils/uiUtils";
import * as storage from "../utils/storage";
import * as logger from "../utils/logger";
import * as file from "../utils/file";
import {
  populateEnhancementSettings,
  updateEnhancementUI,
} from "../components/enhancementPanel";
import { populateProviderForms as populateProviderFormsModels } from "../api/models";
import { PROMPT_CATEGORIES } from "./styles";
import { DEFAULTS } from "./defaults";
// --- INTERNAL HELPERS ---

/**
 * Normalize imported configuration for compatibility between legacy and current schemas.
 * Goals:
 * - Safely consume older exports (5.x / early 6.x) and newer variants
 * - Start from DEFAULTS as baseline
 * - Overlay imported configuration while:
 *      - Preserving valid known fields (including presets, negative prompts, enhancements)
 *      - Preserving unknown fields for forward compatibility
 *      - Avoiding invalid type overwrites
 * - Apply targeted fixes for:
 *      - Nested payloads (e.g. { config: { ... }, meta: { ... } })
 *      - Legacy/renamed keys
 *      - String vs number coercions for numeric settings
 * - Preserve sensitive values (API keys, tokens) when present and valid
 * @param {object} importedConfigRaw
 * @returns {object} normalized configuration object
 */
export function normalizeImportedConfig(importedConfigRaw = {}) {
  try {
    let importedConfig = importedConfigRaw;

    // --- Support nested payloads: { config: { ... }, meta: { ... } } ---
    if (
      importedConfig &&
      typeof importedConfig === "object" &&
      !Array.isArray(importedConfig)
    ) {
      if (
        (importedConfig as any).config &&
        typeof (importedConfig as any).config === "object" &&
        !Array.isArray((importedConfig as any).config)
      ) {
        importedConfig = (importedConfig as any).config;
      }
    }

    // Guard against non-object payloads after unwrapping
    if (
      !importedConfig ||
      typeof importedConfig !== "object" ||
      Array.isArray(importedConfig)
    ) {
      logger.logError(
        "CONFIG_IMPORT",
        "Invalid configuration format after normalization; using DEFAULTS",
        {
          importedType: typeof importedConfig,
        },
      );
      return { ...DEFAULTS };
    }

    // Start from defaults (shallow clone - structure is flat enough for our use)
    const normalized = { ...DEFAULTS };

    // --- Overlay imported config with cautious merging ---
    // We:
    //  - Apply values for known keys when types are compatible or coercible
    //  - Keep unknown keys as-is for forward compatibility
    //  - Avoid breaking core structure with obviously invalid types

    const _coerceNumber = (value) => {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
      }
      return undefined;
    };

    const _isBoolean = (value) => typeof value === "boolean";
    const isNonEmptyString = (v) =>
      typeof v === "string" && v.trim().length > 0;

    // First copy all keys from importedConfig, then selectively clean/fix known ones.
    Object.assign(normalized, importedConfig);

    // --- Backward compatibility and field normalization ---

    // Detect legacy enhancement template selection:
    // If enhancementTemplateSelected missing but enhancementTemplate present:
    if (!("enhancementTemplateSelected" in importedConfig)) {
      const importedTemplate = (importedConfig as any).enhancementTemplate;
      let matchedKey = null;

      if (
        importedTemplate &&
        typeof importedTemplate === "string" &&
        DEFAULTS.enhancementPresets
      ) {
        for (const [key, preset] of Object.entries(
          DEFAULTS.enhancementPresets,
        )) {
          if (
            preset &&
            typeof preset === "object" &&
            preset.template === importedTemplate
          ) {
            matchedKey = key;
            break;
          }
        }
      }

      if (matchedKey) {
        normalized.enhancementTemplateSelected = matchedKey;
      } else {
        // Default to custom while preserving enhancementTemplate content
        normalized.enhancementTemplateSelected = "custom";
      }
    } else {
      // Validate enhancementTemplateSelected if present
      const sel = normalized.enhancementTemplateSelected;
      const presets = DEFAULTS.enhancementPresets || {};
      if (!sel || (sel !== "custom" && !presets[sel])) {
        normalized.enhancementTemplateSelected =
          DEFAULTS.enhancementTemplateSelected || "standard";
      }
    }

    // Ensure enhancement-related new tuning fields are populated when missing/invalid
    const ensureNumber = (value, fallback) =>
      typeof value === "number" && !isNaN(value) && value >= 0
        ? value
        : fallback;

    const ensureLogLevel = (value, fallback) => {
      const allowed = ["debug", "info", "warn", "error"];
      return allowed.includes(value) ? value : fallback;
    };

    // --- Migrate legacy enhancement config to OpenAI-compatible ---
    // Remove dead keys that no longer exist in DEFAULTS.
    delete (normalized as any).enhancementProvider;
    delete (normalized as any).enhancementModelsFallback;

    // Clear legacy provider-prefixed model names — they won't work with OpenAI-compatible endpoints.
    const legacyModel = (normalized as any).enhancementModel;
    if (
      typeof legacyModel === "string" &&
      legacyModel.startsWith("models/")
    ) {
      normalized.enhancementModel = DEFAULTS.enhancementModel;
    }

    // Ensure enhancementBaseUrl field exists for OpenAI-compatible enhancement.
    if (typeof (normalized as any).enhancementBaseUrl !== "string") {
      normalized.enhancementBaseUrl = DEFAULTS.enhancementBaseUrl;
    }

    // enhancementMaxRetriesPerModel
    normalized.enhancementMaxRetriesPerModel = ensureNumber(
      (importedConfig as any).enhancementMaxRetriesPerModel,
      DEFAULTS.enhancementMaxRetriesPerModel,
    );

    // enhancementRetryDelay
    normalized.enhancementRetryDelay = ensureNumber(
      (importedConfig as any).enhancementRetryDelay,
      DEFAULTS.enhancementRetryDelay,
    );

    // enhancementModelsFallback normalization removed — legacy fallback list
    // is stripped above during migration. OpenAI-compatible enhancement uses a single model.

    // enhancementLogLevel
    normalized.enhancementLogLevel = ensureLogLevel(
      (importedConfig as any).enhancementLogLevel,
      DEFAULTS.enhancementLogLevel,
    );

    // enhancementAlwaysFallback
    if (typeof (importedConfig as any).enhancementAlwaysFallback === "boolean") {
      normalized.enhancementAlwaysFallback =
        (importedConfig as any).enhancementAlwaysFallback;
    } else {
      normalized.enhancementAlwaysFallback = DEFAULTS.enhancementAlwaysFallback;
    }

    // enhancementPresets: if missing or invalid, fill from defaults
    if (
      !(importedConfig as any).enhancementPresets ||
      typeof (importedConfig as any).enhancementPresets !== "object"
    ) {
      normalized.enhancementPresets = DEFAULTS.enhancementPresets;
    }

    // --- Enhancement Template Selection & Legacy Preset Handling ---

    /**
     * Resolve a possibly legacy or invalid enhancement template key
     * to a safe, supported key.
     *
     * Rules:
     * - Allow 'standard', 'safety', 'artistic', 'technical', 'character', 'custom'
     * - Map legacy/removed defaults:
     *     - 'clean' -> 'safety'
     *     - 'environment' -> 'standard'
     *     - 'composition' -> 'technical'
     * - For any other unknown/non-string value, fall back to DEFAULTS.enhancementTemplateSelected or 'standard'
     */
    const resolveEnhancementTemplateKey = (rawKey) => {
      const validKeys = [
        "standard",
        "safety",
        "artistic",
        "technical",
        "character",
        "custom",
      ];
      if (typeof rawKey === "string" && rawKey.trim().length > 0) {
        const key = rawKey.trim();
        if (validKeys.includes(key)) {
          return key;
        }
        switch (key) {
          case "clean":
            return "safety";
          case "environment":
            return "standard";
          case "composition":
            return "technical";
          default:
            break;
        }
      }
      return DEFAULTS.enhancementTemplateSelected || "standard";
    };

    // Ensure enhancementTemplateSelected is normalized using resolver
    normalized.enhancementTemplateSelected = resolveEnhancementTemplateKey(
      normalized.enhancementTemplateSelected ||
        (importedConfig as any).enhancementTemplateSelected,
    );

    // Pollinations legacy public model aliases now resolve to the current
    // source-backed public default, while preserving any non-legacy model name.
    if (
      typeof normalized.pollinationsModel !== "string" ||
      !normalized.pollinationsModel.trim()
    ) {
      normalized.pollinationsModel = DEFAULTS.pollinationsModel;
    } else if (["flux", "turbo"].includes(normalized.pollinationsModel.trim())) {
      normalized.pollinationsModel = DEFAULTS.pollinationsModel;
    }

    // historyDays: default only when missing/invalid
    if (!("historyDays" in importedConfig)) {
      normalized.historyDays = DEFAULTS.historyDays ?? 30;
    } else {
      const parsedDays = parseInt((importedConfig as any).historyDays, 10);
      if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
        normalized.historyDays = DEFAULTS.historyDays ?? 30;
      } else {
        normalized.historyDays = parsedDays;
      }
    }

    // --- Sensitive / critical fields preservation ---

    // Direct provider API keys / tokens
    if (isNonEmptyString((importedConfig as any).aiHordeApiKey)) {
      normalized.aiHordeApiKey = (importedConfig as any).aiHordeApiKey;
    }

    if (isNonEmptyString((importedConfig as any).pollinationsToken)) {
      normalized.pollinationsToken = (importedConfig as any).pollinationsToken;
    }

    if (isNonEmptyString((importedConfig as any).enhancementApiKey)) {
      normalized.enhancementApiKey = (importedConfig as any).enhancementApiKey;
    }

    // OpenAI-compatible profiles: ensure structure and preserve apiKey-like fields
    if (
      (importedConfig as any).openAICompatProfiles &&
      typeof (importedConfig as any).openAICompatProfiles === "object"
    ) {
      const normalizedProfiles: any = {};
      for (const [url, profile] of Object.entries(
        (importedConfig as any).openAICompatProfiles,
      ) as [string, any][]) {
        if (profile && typeof profile === "object") {
          const cloned: any = { ...profile };
          if (isNonEmptyString(profile.apiKey)) {
            cloned.apiKey = profile.apiKey;
          }
          normalizedProfiles[url] = cloned;
        }
      }
      normalized.openAICompatProfiles = normalizedProfiles;
    } else if (DEFAULTS.openAICompatProfiles) {
      normalized.openAICompatProfiles = DEFAULTS.openAICompatProfiles;
    }

    // Preserve active profile URL if valid string, otherwise use default
    if (isNonEmptyString((importedConfig as any).openAICompatActiveProfileUrl)) {
      normalized.openAICompatActiveProfileUrl =
        (importedConfig as any).openAICompatActiveProfileUrl;
    } else {
      normalized.openAICompatActiveProfileUrl =
        DEFAULTS.openAICompatActiveProfileUrl;
    }

    // Preserve openAICompatModelManualInput boolean
    if (typeof (importedConfig as any).openAICompatModelManualInput === "boolean") {
      normalized.openAICompatModelManualInput =
        (importedConfig as any).openAICompatModelManualInput;
    } else if (typeof normalized.openAICompatModelManualInput !== "boolean") {
      normalized.openAICompatModelManualInput =
        DEFAULTS.openAICompatModelManualInput;
    }

    // Preserve enhancementModelManualInput boolean (dropdown vs manual model input)
    if (typeof (importedConfig as any).enhancementModelManualInput === "boolean") {
      normalized.enhancementModelManualInput =
        (importedConfig as any).enhancementModelManualInput;
    } else if (typeof normalized.enhancementModelManualInput !== "boolean") {
      normalized.enhancementModelManualInput =
        DEFAULTS.enhancementModelManualInput;
    }

    // Ensure we do not overwrite valid sensitive values with empty defaults
    // If normalized has empty string but imported had non-empty, restore imported
    const sensitiveKeys = [
      "aiHordeApiKey",
      "pollinationsToken",
      "enhancementApiKey",
    ];
    for (const key of sensitiveKeys) {
      if (
        isNonEmptyString(importedConfig[key]) &&
        !isNonEmptyString(normalized[key])
      ) {
        normalized[key] = importedConfig[key];
      }
    }

    return normalized;
  } catch (error) {
    logger.logError("CONFIG_IMPORT", "Failed to normalize imported config", {
      error: error.message,
    });
    // On failure, fall back to DEFAULTS merged with raw imported config to avoid total breakage.
    try {
      const safeImported =
        importedConfigRaw &&
        typeof importedConfigRaw === "object" &&
        !Array.isArray(importedConfigRaw)
          ? importedConfigRaw
          : {};
      return { ...DEFAULTS, ...safeImported };
    } catch {
      return { ...DEFAULTS };
    }
  }
}

// --- PUBLIC FUNCTIONS ---

/**
 * Updates which provider settings are visible based on selected provider
 */
export function updateVisibleSettings() {
  const provider = document.getElementById("nig-provider").value;
  document
    .querySelectorAll(".nig-provider-settings")
    .forEach((el) => (el.style.display = "none"));
  const settingsEl = document.getElementById(`nig-provider-${provider}`);
  if (settingsEl) {
    settingsEl.style.display = "block";
  }
}

/**
 * Updates sub-styles dropdown based on main style selection
 */
export function updateSubStyles(mainStyleName) {
  const subStyleSelect = document.getElementById("nig-sub-style");
  const mainStyleDesc = document.getElementById("nig-main-style-desc");
  const subStyleDesc = document.getElementById("nig-sub-style-desc");

  const selectedCategory = PROMPT_CATEGORIES.find(
    (cat) => cat.name === mainStyleName,
  );
  mainStyleDesc.textContent = selectedCategory
    ? selectedCategory.description
    : "";
  subStyleSelect.innerHTML = "";

  if (selectedCategory && selectedCategory.subStyles.length > 0) {
    subStyleSelect.disabled = false;
    selectedCategory.subStyles.forEach((sub) => {
      const option = document.createElement("option");
      option.value = sub.value;
      option.textContent = sub.name;
      subStyleSelect.appendChild(option);
    });
    subStyleSelect.dispatchEvent(new Event("change"));
  } else {
    subStyleSelect.disabled = true;
    subStyleDesc.textContent = "";
  }
}

/**
 * Populates the configuration form with current settings
 */
export async function populateConfigForm() {
  const config = await storage.getConfig();

  // Provider selection
  document.getElementById("nig-provider").value = config.selectedProvider;

  // Style settings
  const mainStyleSelect = document.getElementById("nig-main-style");
  mainStyleSelect.innerHTML = "";
  PROMPT_CATEGORIES.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    mainStyleSelect.appendChild(option);
  });
  mainStyleSelect.value = config.mainPromptStyle;
  updateSubStyles(config.mainPromptStyle);
  document.getElementById("nig-sub-style").value = config.subPromptStyle;
  document.getElementById("nig-sub-style").dispatchEvent(new Event("change"));

  // Custom style settings
  const customStyleEnable = document.getElementById("nig-custom-style-enable");
  const customStyleText = document.getElementById("nig-custom-style-text");
  customStyleEnable.checked = config.customStyleEnabled;
  customStyleText.value = config.customStyleText;
  customStyleText.disabled = !config.customStyleEnabled;

  // Enhancement settings
  document.getElementById("nig-enhancement-enabled").checked =
    config.enhancementEnabled;
  document.getElementById("nig-enhancement-base-url").value =
    config.enhancementBaseUrl || "";
  document.getElementById("nig-enhancement-api-key").value =
    config.enhancementApiKey || "";
  document.getElementById("nig-enhancement-model-manual").value =
    config.enhancementModel || "";

  // Enhancement template selection will be handled by enhancementPanel.js

  // Negative prompt settings
  document.getElementById("nig-enable-neg-prompt").checked =
    config.enableNegPrompt;
  document.getElementById("nig-global-neg-prompt").value =
    config.globalNegPrompt;

  // Provider-specific settings will be handled by models.js
  // This will be called after the provider forms are populated

  // History days setting
  const historyDays = await storage.getHistoryDays();
  document.getElementById("nig-history-clean-days").value = historyDays;

  updateVisibleSettings();
}

/**
 * Populates provider-specific form sections
 */
export async function populateProviderForms(config) {
  // Import and call the populateProviderForms from models.js
  const { populateProviderForms: populateProviderFormsModels } = await import(
    "../api/models"
  );
  await populateProviderFormsModels(config);
}

/**
 * Saves configuration from form to storage
 */
export async function saveConfig() {
  // Style configuration
  await storage.setConfigValue(
    "mainPromptStyle",
    document.getElementById("nig-main-style").value,
  );
  await storage.setConfigValue(
    "subPromptStyle",
    document.getElementById("nig-sub-style").value,
  );
  await storage.setConfigValue(
    "customStyleEnabled",
    document.getElementById("nig-custom-style-enable").checked,
  );
  await storage.setConfigValue(
    "customStyleText",
    document.getElementById("nig-custom-style-text").value.trim(),
  );

  // Enhancement configuration (will be handled by enhancementPanel.js)
  await storage.setConfigValue(
    "enhancementEnabled",
    document.getElementById("nig-enhancement-enabled").checked,
  );
  await storage.setConfigValue(
    "enhancementBaseUrl",
    document.getElementById("nig-enhancement-base-url").value.trim(),
  );
  await storage.setConfigValue(
    "enhancementApiKey",
    document.getElementById("nig-enhancement-api-key").value.trim(),
  );
  const enhancementManualContainer = document.getElementById(
    "nig-enhancement-model-container-manual",
  );
  const enhancementIsManualMode = Boolean(
    enhancementManualContainer &&
      enhancementManualContainer.style.display !== "none",
  );
  await storage.setConfigValue(
    "enhancementModel",
    enhancementIsManualMode
      ? document.getElementById("nig-enhancement-model-manual").value.trim()
      : document.getElementById("nig-enhancement-model").value.trim(),
  );
  await storage.setConfigValue(
    "enhancementTemplate",
    document.getElementById("nig-enhancement-template").value.trim(),
  );
  await storage.setConfigValue(
    "enhancementTemplateSelected",
    document.getElementById("nig-enhancement-template-select").value,
  );

  // Negative prompt configuration
  await storage.setConfigValue(
    "enableNegPrompt",
    document.getElementById("nig-enable-neg-prompt").checked,
  );
  await storage.setConfigValue(
    "globalNegPrompt",
    document.getElementById("nig-global-neg-prompt").value.trim(),
  );

  // Provider selection
  await storage.setConfigValue(
    "selectedProvider",
    document.getElementById("nig-provider").value,
  );

  // Provider-specific configurations will be saved by their respective modules
  // (models.js for Pollinations, AI Horde, and OpenAI compatible)

  // Alert will be handled by the main saveConfig function in configPanel.js
}

/**
 * Exports configuration to a JSON file
 */
export async function exportConfig() {
  // Export the current normalized configuration.
  // storage.getConfig() already merges stored values over DEFAULTS to produce a flat config.
  const config = await storage.getConfig();
  const configData = JSON.stringify(config, null, 2);
  const filename = `wtr-lab-image-generator-config-${new Date().toISOString().split("T")[0]}.json`;
  file.downloadFile(filename, configData, "application/json");
}

/**
 * Imports configuration from a JSON file
 */
export async function handleImportFile(event) {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    return;
  }

  try {
    const text = await selectedFile.text();
    const importedConfig = JSON.parse(text);

    if (
      !importedConfig ||
      typeof importedConfig !== "object" ||
      Array.isArray(importedConfig)
    ) {
      throw new Error("Invalid configuration format: root must be an object.");
    }

    if (await showConfirm("This will overwrite all current settings. Continue?", "Import Configuration")) {
      const normalizedConfig = normalizeImportedConfig(importedConfig);

      try {
        // Persist all normalized keys to storage
        await Promise.all(
          Object.keys(normalizedConfig).map((key) =>
            storage.setConfigValue(key, normalizedConfig[key]),
          ),
        );

        // Retrieve the fully merged config (storage over DEFAULTS)
        const updatedConfig = await storage.getConfig();

        // --- Reactive UI synchronization (no panel reopen required) ---

        // 1) Core config + styling + history
        try {
          await populateConfigForm();
        } catch (uiError) {
          logger.logError(
            "CONFIG_IMPORT",
            "Failed to update core configuration form after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 2) Provider-specific sections (Pollinations, AI Horde, OpenAICompat)
        try {
          await populateProviderFormsModels(updatedConfig);
        } catch (uiError) {
          logger.logError(
            "CONFIG_IMPORT",
            "Failed to update provider configuration forms after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 3) Enhancement panel (enhancement settings)
        try {
          if (typeof populateEnhancementSettings === "function") {
            await populateEnhancementSettings(updatedConfig);
          }
        } catch (uiError) {
          logger.logError(
            "CONFIG_IMPORT",
            "Failed to update enhancement settings after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        // 4) Enhancement UI state in styling tab (provider-aware)
        try {
          if (typeof updateEnhancementUI === "function") {
            const provider =
              updatedConfig.selectedProvider || DEFAULTS.selectedProvider;
            updateEnhancementUI(provider, updatedConfig);
          }
        } catch (uiError) {
          logger.logError(
            "CONFIG_IMPORT",
            "Failed to update enhancement UI state after import",
            {
              error: uiError?.message || uiError,
            },
          );
        }

        showToast(
          "Configuration imported successfully! All visible settings have been updated.",
          "success",
        );
      } catch (persistError) {
        // If persisting or UI sync fails in a critical way, surface a clear error
        logger.logError(
          "CONFIG_IMPORT",
          "Failed during configuration import application",
          {
            error: persistError?.message || persistError,
          },
        );
        showToast(
          "Configuration import failed while applying settings. " +
            "Your previous configuration is still in effect. " +
            `Details: ${persistError?.message || persistError}`,
          "error",
        );
      }
    }
  } catch (error) {
    // Robust error handling for:
    // - Invalid JSON
    // - Non-object / malformed structures
    // - Unexpected runtime errors
    logger.logError("CONFIG_IMPORT", "Failed to import configuration", {
      error: error?.message || error,
    });
    showToast(`Failed to import configuration: ${error?.message || error}`, "error");
  } finally {
    // Always clear file input to allow re-import attempts
    event.target.value = "";
  }
}
