// --- IMPORTS ---
import { DEFAULTS } from "../config/defaults";
import * as storage from "../utils/storage";
import * as apiEnhancement from "../api/enhancement";
import * as models from "../api/models";
import { showToast, showConfirm, showPrompt } from "../utils/uiUtils";

/**
 * Returns true when the enhancement model UI is in manual text-input mode.
 */
function isEnhancementManualMode() {
  const manualContainer = document.getElementById(
    "nig-enhancement-model-container-manual",
  );
  return Boolean(manualContainer && manualContainer.style.display !== "none");
}

// --- PUBLIC FUNCTIONS ---

/**
 * Toggles the enhancement settings UI based on whether enhancement is enabled
 */
export function toggleEnhancementSettings(enabled) {
  const enhancementSettings = document.getElementById(
    "nig-enhancement-settings",
  );
  if (enhancementSettings) {
    if (enabled) {
      enhancementSettings.classList.remove("disabled");
      // Re-enable inputs in tab order (finding #20)
      enhancementSettings
        .querySelectorAll("input, select, textarea, button")
        .forEach((el) => {
          el.removeAttribute("tabindex");
          el.setAttribute("aria-disabled", "false");
        });
    } else {
      enhancementSettings.classList.add("disabled");
      // Remove inputs from tab order (finding #20: disabled inputs were still focusable)
      enhancementSettings
        .querySelectorAll("input, select, textarea, button")
        .forEach((el) => {
          el.setAttribute("tabindex", "-1");
          el.setAttribute("aria-disabled", "true");
        });
    }
  }
}

/**
 * Updates the enhancement UI based on provider and configuration
 */
export function updateEnhancementUI(provider, config) {
  const enhancementEnabled = config.enhancementEnabled;
  const hasEndpoint =
    config.enhancementBaseUrl && config.enhancementBaseUrl.trim().length > 0;
  const hasModel =
    config.enhancementModel && config.enhancementModel.trim().length > 0;
  const isConfigured = hasEndpoint && hasModel;
  const shouldUseProviderEnh = apiEnhancement.shouldUseProviderEnhancement(
    provider,
    config,
  );
  const providerPriorityInfo = document.getElementById(
    "nig-provider-priority-info",
  );
  const statusIndicator = document.getElementById("nig-status-indicator");
  const statusText = document.getElementById("nig-status-text");
  const overrideProviderBtn = document.getElementById("nig-override-provider");

  if (
    enhancementEnabled &&
    shouldUseProviderEnh &&
    !config.enhancementOverrideProvider
  ) {
    providerPriorityInfo.style.display = "block";
    statusIndicator.className = "nig-status-indicator provider-active";
    statusText.textContent = "Provider Enhancement Active";
    if (overrideProviderBtn) {
      overrideProviderBtn.style.display = "inline-block";
    }
  } else {
    providerPriorityInfo.style.display = "none";
    if (enhancementEnabled && isConfigured) {
      statusIndicator.className = "nig-status-indicator external-active";
      statusText.textContent = "External AI Enhancement Active";
    } else if (enhancementEnabled) {
      statusIndicator.className = "nig-status-indicator disabled";
      statusText.textContent = "Enhancement Enabled (No Endpoint)";
    } else {
      statusIndicator.className = "nig-status-indicator disabled";
      statusText.textContent = "Enhancement Disabled";
    }
    if (overrideProviderBtn) {
      overrideProviderBtn.style.display = "none";
    }
  }
}

/**
 * Handles enhancement template selection and updates UI accordingly
 */
/**
 * Load and normalize user presets from config.
 * Ensures backward compatibility with potential legacy shapes.
 */
function getNormalizedUserPresets(config) {
  const raw = config.enhancementUserPresets;
  const normalized: any = {};

  try {
    if (!raw) {
      return normalized;
    }

    // If already an object map of id -> preset
    if (typeof raw === "object" && !Array.isArray(raw)) {
      Object.entries(raw).forEach(([id, value]: [string, any]) => {
        if (value && typeof value.template === "string") {
          const presetId = value.id || id;
          normalized[presetId] = {
            id: presetId,
            name: value.name || presetId,
            description:
              typeof value.description === "string" ? value.description : "",
            template: value.template,
            createdAt: value.createdAt || null,
            updatedAt: value.updatedAt || null,
            version: value.version || 1,
          };
        }
      });
      return normalized;
    }

    // If legacy array: [{ name, template, ... }]
    if (Array.isArray(raw)) {
      raw.forEach((p, index) => {
        if (p && typeof p.template === "string") {
          const safeName =
            p.name && typeof p.name === "string"
              ? p.name.trim()
              : `Preset ${index + 1}`;
          const id =
            p.id ||
            safeName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-_]/g, "") ||
            `preset-${index + 1}`;
          if (!normalized[id]) {
            normalized[id] = {
              id,
              name: safeName,
              description:
                typeof p.description === "string" ? p.description : "",
              template: p.template,
              createdAt: p.createdAt || null,
              updatedAt: p.updatedAt || null,
              version: 1,
            };
          }
        }
      });
      return normalized;
    }
  } catch (e) {
    console.error(
      "[NIG] Failed to normalize enhancementUserPresets, clearing corrupted data",
      e,
    );
  }

  return normalized;
}

/**
 * Persist normalized user presets back to storage.
 */
async function saveUserPresetsToStorage(userPresetsMap) {
  try {
    await storage.setConfigValue(
      "enhancementUserPresets",
      userPresetsMap || {},
    );
  } catch (e) {
    console.error("[NIG] Failed to save enhancementUserPresets", e);
    showToast("Failed to save enhancement preset. See console for details.", "error");
  }
}

/**
 * Populate the Enhancement Template select with grouped user + default presets,
 * ensuring "User Presets" group appears above "Default Presets".
 */
function populateEnhancementTemplateSelect(
  templateSelect,
  userPresetsMap,
  selectedKey,
) {
  const defaultPresets: any = DEFAULTS.enhancementPresets || {};

  // Clear existing options while preserving optgroup structure from template
  templateSelect.innerHTML = "";

  // User Presets group
  const userOptgroup = document.createElement("optgroup");
  userOptgroup.label = "User Presets";
  userOptgroup.dataset.group = "user-presets";

  const userPresetEntries: any[] = Object.values(userPresetsMap || {});
  if (userPresetEntries.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.disabled = true;
    emptyOption.textContent = "No user presets saved yet";
    userOptgroup.appendChild(emptyOption);
  } else {
    userPresetEntries.forEach((preset) => {
      const option = document.createElement("option");
      option.value = `user:${preset.id}`;
      option.textContent = preset.name || preset.id;
      option.title = preset.description || preset.template || "";
      userOptgroup.appendChild(option);
    });
  }

  // Default Presets group (top 5 only per DEFAULTS)
  const defaultOptgroup = document.createElement("optgroup");
  defaultOptgroup.label = "Default Presets";
  defaultOptgroup.dataset.group = "default-presets";

  Object.entries(defaultPresets).forEach(([key, preset]: [string, any]) => {
    if (!preset || typeof preset.template !== "string") {
      return;
    }
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${preset.name} - ${preset.description}`;
    option.title = preset.template;
    defaultOptgroup.appendChild(option);
  });

  // Append groups in required order
  templateSelect.appendChild(userOptgroup);
  templateSelect.appendChild(defaultOptgroup);

  // Custom one-off entry at bottom (not part of any optgroup)
  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Custom (one-off)";
  templateSelect.appendChild(customOption);

  // Resolve selection
  if (
    selectedKey &&
    templateSelect.querySelector(`option[value="${selectedKey}"]`)
  ) {
    templateSelect.value = selectedKey;
  } else if (selectedKey && defaultPresets[selectedKey]) {
    templateSelect.value = selectedKey;
  } else if (selectedKey === "custom") {
    templateSelect.value = "custom";
  } else {
    // Fallback to standard if available
    if (defaultPresets.standard) {
      templateSelect.value = "standard";
    } else {
      templateSelect.value = "custom";
    }
  }
}

/**
 * Handle initial enhancement template selection, including user presets.
 */
export async function handleEnhancementTemplateSelection(config) {
  const templateSelect = document.getElementById(
    "nig-enhancement-template-select",
  );
  const templateTextarea = document.getElementById("nig-enhancement-template");

  if (!templateSelect || !templateTextarea) {
    return;
  }

  const defaultPresets: any = DEFAULTS.enhancementPresets || {};
  const userPresets = getNormalizedUserPresets(config);

  const storedSelected = config.enhancementTemplateSelected;
  const storedTemplate =
    typeof config.enhancementTemplate === "string"
      ? config.enhancementTemplate
      : "";

  // Try to resolve selection:
  // - user:<id> for user presets
  // - default preset keys
  // - 'custom'
  let resolvedKey = null;

  if (storedSelected && typeof storedSelected === "string") {
    if (storedSelected === "custom") {
      resolvedKey = "custom";
    } else if (storedSelected.startsWith("user:")) {
      const id = storedSelected.replace(/^user:/, "");
      if (userPresets[id]) {
        resolvedKey = `user:${id}`;
      }
    } else if (defaultPresets[storedSelected]) {
      resolvedKey = storedSelected;
    }
  }

  // If no direct match, attempt to infer from stored template content
  if (!resolvedKey && storedTemplate) {
    // Check user presets
    for (const preset of Object.values(userPresets) as any[]) {
      if (preset.template === storedTemplate) {
        resolvedKey = `user:${preset.id}`;
        break;
      }
    }

    // Check default presets if still not resolved
    if (!resolvedKey) {
      for (const [key, preset] of Object.entries(defaultPresets) as [string, any][]) {
        if (
          preset &&
          typeof preset === "object" &&
          preset.template === storedTemplate
        ) {
          resolvedKey = key;
          break;
        }
      }
    }

    // Fallback: treat as custom if we have content
    if (!resolvedKey) {
      resolvedKey = "custom";
    }
  }

  // Final fallback to standard if nothing else
  if (!resolvedKey) {
    resolvedKey = defaultPresets.standard ? "standard" : "custom";
  }

  // Populate select with grouped options
  populateEnhancementTemplateSelect(templateSelect, userPresets, resolvedKey);

  // Populate textarea and readonly/editable state
  if (resolvedKey === "custom") {
    templateTextarea.value = storedTemplate || "";
    templateTextarea.disabled = false;
  } else if (resolvedKey.startsWith("user:")) {
    const id = resolvedKey.replace(/^user:/, "");
    const preset = userPresets[id];
    if (preset) {
      templateTextarea.value = preset.template;
      templateTextarea.disabled = true;
    } else {
      // Missing user preset -> fallback to custom with storedTemplate
      templateTextarea.value = storedTemplate || "";
      templateTextarea.disabled = false;
      templateSelect.value = "custom";
    }
  } else {
    const preset = defaultPresets[resolvedKey];
    if (preset) {
      templateTextarea.value = preset.template;
      templateTextarea.disabled = true;
    } else {
      templateTextarea.value = storedTemplate || "";
      templateTextarea.disabled = false;
      templateSelect.value = "custom";
    }
  }
}

/**
 * Populates enhancement settings in the form
 */
export async function populateEnhancementSettings(config) {
  // Handle enhancement template selection
  await handleEnhancementTemplateSelection(config);
  toggleEnhancementSettings(config.enhancementEnabled);
  updateEnhancementUI(config.selectedProvider, config);

  // Enhancement model: select (dynamic fetch) vs manual text-input mode
  const selectContainer = document.getElementById(
    "nig-enhancement-model-container-select",
  );
  const manualContainer = document.getElementById(
    "nig-enhancement-model-container-manual",
  );
  const modelManual = document.getElementById("nig-enhancement-model-manual");

  // Always seed the manual input with the saved model so switching modes is lossless
  if (modelManual) {
    modelManual.value = config.enhancementModel || "";
  }

  if (config.enhancementModelManualInput) {
    if (selectContainer) {
      selectContainer.style.display = "none";
    }
    if (manualContainer) {
      manualContainer.style.display = "block";
    }
  } else {
    if (selectContainer) {
      selectContainer.style.display = "block";
    }
    if (manualContainer) {
      manualContainer.style.display = "none";
    }
    await models.loadEnhancementModels(
      config.enhancementModel,
      config.enhancementBaseUrl,
      config.enhancementApiKey,
    );
  }
}

/**
 * Saves enhancement configuration to storage
 */
export async function saveEnhancementConfig() {
  await storage.setConfigValue(
    "enhancementEnabled",
    document.getElementById("nig-enhancement-enabled").checked,
  );
  await storage.setConfigValue(
    "enhancementApiKey",
    document.getElementById("nig-enhancement-api-key").value.trim(),
  );
  await storage.setConfigValue(
    "enhancementBaseUrl",
    document.getElementById("nig-enhancement-base-url").value.trim(),
  );

  const isManualMode = isEnhancementManualMode();
  const enhancementModelValue = isManualMode
    ? document.getElementById("nig-enhancement-model-manual").value.trim()
    : document.getElementById("nig-enhancement-model").value.trim();
  await storage.setConfigValue("enhancementModel", enhancementModelValue);
  await storage.setConfigValue("enhancementModelManualInput", isManualMode);

  await storage.setConfigValue(
    "enhancementTemplate",
    document.getElementById("nig-enhancement-template").value.trim(),
  );
  await storage.setConfigValue(
    "enhancementTemplateSelected",
    document.getElementById("nig-enhancement-template-select").value,
  );
  await storage.setConfigValue("enhancementOverrideProvider", false); // Reset override on save
}

/**
 * Sets up enhancement event listeners
 */
export function setupEnhancementEventListeners(panelElement) {
  const enhancementEnabled = panelElement.querySelector(
    "#nig-enhancement-enabled",
  );
  const overrideProviderBtn = panelElement.querySelector(
    "#nig-override-provider",
  );
  const templateSelect = panelElement.querySelector(
    "#nig-enhancement-template-select",
  );
  const templateResetBtn = panelElement.querySelector("#nig-template-reset");
  const templateSavePresetBtn = panelElement.querySelector(
    "#nig-template-save-preset",
  );
  const templateDeletePresetBtn = panelElement.querySelector(
    "#nig-template-delete-preset",
  );
  const templateExampleBtn = panelElement.querySelector(
    "#nig-template-example",
  );
  const enhancementFetchBtn = panelElement.querySelector(
    "#nig-enhancement-fetch-models",
  );
  const enhancementSwitchToManual = panelElement.querySelector(
    "#nig-enhancement-switch-to-manual",
  );
  const enhancementSwitchToSelect = panelElement.querySelector(
    "#nig-enhancement-switch-to-select",
  );

  // Enhancement Template Selection Handler
  templateSelect.addEventListener("change", async (e) => {
    const selectedValue = e.target.value;
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const defaultPresets = DEFAULTS.enhancementPresets || {};
    const config = await storage.getConfig();
    const userPresets = getNormalizedUserPresets(config);

    if (selectedValue === "custom") {
      // Custom one-off: textarea editable, not bound to a named preset.
      templateTextarea.disabled = false;
      await storage.setConfigValue("enhancementTemplateSelected", "custom");
    } else if (selectedValue.startsWith("user:")) {
      const id = selectedValue.replace(/^user:/, "");
      const preset = userPresets[id];
      if (preset) {
        templateTextarea.value = preset.template;
        templateTextarea.disabled = true;
        await storage.setConfigValue("enhancementTemplate", preset.template);
        await storage.setConfigValue(
          "enhancementTemplateSelected",
          `user:${id}`,
        );
      } else {
        // Missing user preset -> treat as custom to avoid data loss.
        templateTextarea.disabled = false;
        await storage.setConfigValue("enhancementTemplateSelected", "custom");
      }
    } else {
      // Default preset
      const preset = defaultPresets[selectedValue];
      if (preset) {
        templateTextarea.value = preset.template;
        templateTextarea.disabled = true;
        await storage.setConfigValue("enhancementTemplate", preset.template);
        await storage.setConfigValue(
          "enhancementTemplateSelected",
          selectedValue,
        );
      } else {
        // Unknown key: fallback to custom
        templateTextarea.disabled = false;
        await storage.setConfigValue("enhancementTemplateSelected", "custom");
      }
    }
  });

  // Save as Preset Button
  if (templateSavePresetBtn) {
    templateSavePresetBtn.addEventListener("click", async () => {
      try {
        const templateTextarea = panelElement.querySelector(
          "#nig-enhancement-template",
        );
        const templateSelectEl = panelElement.querySelector(
          "#nig-enhancement-template-select",
        );
        const rawText = (templateTextarea.value || "").trim();

        if (!rawText) {
          showToast("Cannot save an empty enhancement preset.", "error");
          return;
        }

        const name = await showPrompt("Enter a name for this enhancement preset:", "", "Save Enhancement Preset");
        if (!name) {
          return;
        }

        const trimmedName = name.trim();
        if (!trimmedName) {
          showToast("Preset name cannot be empty.", "error");
          return;
        }

        const config = await storage.getConfig();
        const existing = getNormalizedUserPresets(config);

        // Generate stable id from name
        const baseId =
          trimmedName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-_]/g, "")
            .substring(0, 64) || "preset";

        let id = baseId;
        let suffix = 1;
        while (existing[id] && existing[id].name !== trimmedName) {
          id = `${baseId}-${suffix++}`;
        }

        const nowIso = new Date().toISOString();
        existing[id] = {
          id,
          name: trimmedName,
          description: "",
          template: rawText,
          createdAt: existing[id]?.createdAt || nowIso,
          updatedAt: nowIso,
          version: 1,
        };

        await saveUserPresetsToStorage(existing);

        // Refresh select with new user preset list
        populateEnhancementTemplateSelect(
          templateSelectEl,
          existing,
          `user:${id}`,
        );

        // Lock textarea for the saved preset
        templateTextarea.value = rawText;
        templateTextarea.disabled = true;

        await storage.setConfigValue("enhancementTemplate", rawText);
        await storage.setConfigValue(
          "enhancementTemplateSelected",
          `user:${id}`,
        );

        showToast(`Enhancement preset "${trimmedName}" saved under User Presets.`, "success");
      } catch (e) {
        console.error("[NIG] Failed to save enhancement preset", e);
        showToast(
          "Failed to save enhancement preset. Please check the console for details.",
          "error",
        );
      }
    });
  }

  // Delete selected user preset
  if (templateDeletePresetBtn) {
    templateDeletePresetBtn.addEventListener("click", async () => {
      try {
        const templateSelectEl = panelElement.querySelector(
          "#nig-enhancement-template-select",
        );
        const templateTextarea = panelElement.querySelector(
          "#nig-enhancement-template",
        );
        const selected = templateSelectEl ? templateSelectEl.value : "";

        if (!selected || !selected.startsWith("user:")) {
          showToast(
            'Please select a User Preset from the "User Presets" group to delete.',
            "error",
          );
          return;
        }

        const id = selected.replace(/^user:/, "");
        const config = await storage.getConfig();
        const existing = getNormalizedUserPresets(config);

        if (!existing[id]) {
          showToast("The selected user preset no longer exists or is invalid.", "error");
          return;
        }

        const confirmMessage = `Delete user preset "${existing[id].name || id}"? This action cannot be undone.`;
        if (!(await showConfirm(confirmMessage, "Delete User Preset"))) {
          return;
        }

        // Remove preset and persist
        delete existing[id];
        await saveUserPresetsToStorage(existing);

        // Rebuild the select; default to "standard" if available or "custom"
        const fallbackKey = DEFAULTS.enhancementPresets?.standard
          ? "standard"
          : "custom";
        populateEnhancementTemplateSelect(
          templateSelectEl,
          existing,
          fallbackKey,
        );

        // If we deleted the active preset, update textarea and selection accordingly
        if (selected === config.enhancementTemplateSelected) {
          if (fallbackKey === "custom") {
            templateTextarea.value = (config.enhancementTemplate || "").trim();
            templateTextarea.disabled = false;
            await storage.setConfigValue(
              "enhancementTemplateSelected",
              "custom",
            );
          } else {
            const fallbackPreset = DEFAULTS.enhancementPresets[fallbackKey];
            templateTextarea.value = fallbackPreset?.template || "";
            templateTextarea.disabled = Boolean(fallbackPreset);
            if (fallbackPreset) {
              await storage.setConfigValue(
                "enhancementTemplate",
                fallbackPreset.template,
              );
            }
            await storage.setConfigValue(
              "enhancementTemplateSelected",
              fallbackKey,
            );
          }
        }

        showToast("User preset deleted.", "success");
      } catch (e) {
        console.error("[NIG] Failed to delete enhancement user preset", e);
        showToast(
          "Failed to delete user preset. Please check the console for details.",
          "error",
        );
      }
    });
  }

  // Reset to Preset Button
  templateResetBtn.addEventListener("click", async () => {
    const selectedValue = templateSelect.value;
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const defaultPresets = DEFAULTS.enhancementPresets || {};
    const config = await storage.getConfig();
    const userPresets = getNormalizedUserPresets(config);

    if (selectedValue !== "custom") {
      if (selectedValue.startsWith("user:")) {
        const id = selectedValue.replace(/^user:/, "");
        const preset = userPresets[id];
        if (preset) {
          templateTextarea.value = preset.template;
          templateTextarea.disabled = true;
          await storage.setConfigValue("enhancementTemplate", preset.template);
          await storage.setConfigValue(
            "enhancementTemplateSelected",
            `user:${id}`,
          );
        }
      } else {
        const preset = defaultPresets[selectedValue];
        if (preset) {
          templateTextarea.value = preset.template;
          templateTextarea.disabled = true;
          await storage.setConfigValue("enhancementTemplate", preset.template);
          await storage.setConfigValue(
            "enhancementTemplateSelected",
            selectedValue,
          );
        }
      }
    } else {
      // If "custom" is selected, reset should restore stored custom text if any.
      const cfg = await storage.getConfig();
      const customTemplate =
        typeof cfg.enhancementTemplate === "string"
          ? cfg.enhancementTemplate
          : "";
      templateTextarea.value = customTemplate;
      templateTextarea.disabled = false;
      await storage.setConfigValue("enhancementTemplateSelected", "custom");
    }
  });

  // Load Example Button
  templateExampleBtn.addEventListener("click", async () => {
    const exampleTemplate =
      'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
    const templateTextarea = panelElement.querySelector(
      "#nig-enhancement-template",
    );
    const templateSelect = panelElement.querySelector(
      "#nig-enhancement-template-select",
    );

    // Treat example as an explicit template choice: store it and mark as custom.
    templateTextarea.value = exampleTemplate;
    templateTextarea.disabled = false;
    if (templateSelect) {
      templateSelect.value = "custom";
    }
    await storage.setConfigValue("enhancementTemplate", exampleTemplate);
    await storage.setConfigValue("enhancementTemplateSelected", "custom");
  });

  // Enhancement enabled toggle
  enhancementEnabled.addEventListener("change", async (e) => {
    const newState = e.target.checked;
    const config = await storage.getConfig();
    config.enhancementEnabled = newState;
    await storage.setConfigValue("enhancementEnabled", newState);
    toggleEnhancementSettings(newState);
    const provider = document.getElementById("nig-provider").value;
    updateEnhancementUI(provider, config);
  });

  // Override provider enhancement
  overrideProviderBtn.addEventListener("click", async () => {
    const provider = document.getElementById("nig-provider").value;
    await storage.setConfigValue("enhancementOverrideProvider", true);
    const config = await storage.getConfig();
    updateEnhancementUI(provider, config);
  });

  // Enhancement model fetch (dynamic discovery) and select/manual mode toggling
  if (enhancementFetchBtn) {
    enhancementFetchBtn.addEventListener("click", () => {
      const baseUrl = document
        .getElementById("nig-enhancement-base-url")
        .value.trim();
      const apiKey = document
        .getElementById("nig-enhancement-api-key")
        .value.trim();
      models.fetchEnhancementModels(baseUrl, apiKey);
    });
  }

  if (enhancementSwitchToManual) {
    enhancementSwitchToManual.addEventListener("click", (e) => {
      e.preventDefault();
      const selectContainer = document.getElementById(
        "nig-enhancement-model-container-select",
      );
      const manualContainer = document.getElementById(
        "nig-enhancement-model-container-manual",
      );
      const select = document.getElementById("nig-enhancement-model");
      const manual = document.getElementById("nig-enhancement-model-manual");
      // Preserve the current selection when switching to manual input
      if (select && manual && !manual.value.trim()) {
        const currentVal = select.value.trim();
        if (currentVal) {
          manual.value = currentVal;
        }
      }
      if (selectContainer) {
        selectContainer.style.display = "none";
      }
      if (manualContainer) {
        manualContainer.style.display = "block";
      }
    });
  }

  if (enhancementSwitchToSelect) {
    enhancementSwitchToSelect.addEventListener("click", (e) => {
      e.preventDefault();
      const selectContainer = document.getElementById(
        "nig-enhancement-model-container-select",
      );
      const manualContainer = document.getElementById(
        "nig-enhancement-model-container-manual",
      );
      if (selectContainer) {
        selectContainer.style.display = "block";
      }
      if (manualContainer) {
        manualContainer.style.display = "none";
      }
    });
  }

  // Track manual edits to enhancement template:
  // Always persist latest raw text for resilience.
  const templateTextareaForInput = panelElement.querySelector(
    "#nig-enhancement-template",
  );
  const templateSelectForInput = panelElement.querySelector(
    "#nig-enhancement-template-select",
  );
  if (templateTextareaForInput && templateSelectForInput) {
    templateTextareaForInput.addEventListener("input", async () => {
      const value = templateTextareaForInput.value;
      const currentSelect = templateSelectForInput.value;

      await storage.setConfigValue("enhancementTemplate", value);

      // Only mark as custom when explicitly in custom mode
      if (currentSelect === "custom") {
        await storage.setConfigValue("enhancementTemplateSelected", "custom");
      }
    });
  }
}
