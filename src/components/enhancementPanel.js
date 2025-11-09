// --- IMPORTS ---
import { DEFAULTS } from '../config/defaults.js';
import * as storage from '../utils/storage.js';
import * as apiGemini from '../api/gemini.js';

// --- PUBLIC FUNCTIONS ---

/**
 * Toggles the enhancement settings UI based on whether enhancement is enabled
 */
export function toggleEnhancementSettings(enabled) {
    const enhancementSettings = document.getElementById('nig-enhancement-settings');
    if (enhancementSettings) {
        if (enabled) {
            enhancementSettings.classList.remove('disabled');
        } else {
            enhancementSettings.classList.add('disabled');
        }
    }
}

/**
 * Updates the enhancement UI based on provider and configuration
 */
export function updateEnhancementUI(provider, config) {
    const enhancementEnabled = config.enhancementEnabled;
    const hasApiKey = config.enhancementApiKey && config.enhancementApiKey.trim().length > 0;
    const shouldUseProviderEnh = apiGemini.shouldUseProviderEnhancement(provider, config);
    const providerPriorityInfo = document.getElementById('nig-provider-priority-info');
    const statusIndicator = document.getElementById('nig-status-indicator');
    const statusText = document.getElementById('nig-status-text');
    const overrideProviderBtn = document.getElementById('nig-override-provider');

    if (enhancementEnabled && shouldUseProviderEnh && !config.enhancementOverrideProvider) {
        providerPriorityInfo.style.display = 'block';
        statusIndicator.className = 'nig-status-indicator provider-active';
        statusText.textContent = 'Provider Enhancement Active';
        if (overrideProviderBtn) {
            overrideProviderBtn.style.display = 'inline-block';
        }
    } else {
        providerPriorityInfo.style.display = 'none';
        if (enhancementEnabled && hasApiKey) {
            statusIndicator.className = 'nig-status-indicator external-active';
            statusText.textContent = 'External AI Enhancement Active';
        } else if (enhancementEnabled) {
            statusIndicator.className = 'nig-status-indicator disabled';
            statusText.textContent = 'Enhancement Enabled (No API Key)';
        } else {
            statusIndicator.className = 'nig-status-indicator disabled';
            statusText.textContent = 'Enhancement Disabled';
        }
        if (overrideProviderBtn) {
            overrideProviderBtn.style.display = 'none';
        }
    }
}

/**
 * Handles enhancement template selection and updates UI accordingly
 */
export async function handleEnhancementTemplateSelection(config) {
    const templateSelect = document.getElementById('nig-enhancement-template-select');
    const templateTextarea = document.getElementById('nig-enhancement-template');

    // Resolve selected preset:
    // 1) If enhancementTemplateSelected is a known preset key (or 'custom'), trust it.
    // 2) Otherwise, infer from enhancementTemplate content; fall back to 'standard'.
    const presets = DEFAULTS.enhancementPresets || {};
    const storedSelected = config.enhancementTemplateSelected;
    const storedTemplate = typeof config.enhancementTemplate === 'string'
        ? config.enhancementTemplate
        : '';

    let selectedPreset = 'standard';

    if (storedSelected === 'custom' || presets[storedSelected]) {
        selectedPreset = storedSelected;
    } else if (storedTemplate) {
        let matchedKey = null;
        for (const [key, preset] of Object.entries(presets)) {
            if (preset && typeof preset === 'object' && preset.template === storedTemplate) {
                matchedKey = key;
                break;
            }
        }
        selectedPreset = matchedKey || 'custom';
    }

    // Apply resolved selection to dropdown
    templateSelect.value = selectedPreset;

    // Populate textarea according to selection without overwriting valid custom content
    if (selectedPreset === 'custom') {
        // For custom, always show the stored template text as-is and keep editable
        templateTextarea.value = storedTemplate || '';
        templateTextarea.disabled = false;
    } else {
        const preset = presets[selectedPreset];
        if (preset) {
            // For preset, ensure textarea reflects the preset content and is read-only
            templateTextarea.value = preset.template;
            templateTextarea.disabled = true;
        } else {
            // Fallback safety: treat as custom if preset missing
            templateTextarea.value = storedTemplate || '';
            templateTextarea.disabled = false;
            templateSelect.value = 'custom';
        }
    }
}

/**
 * Tests the enhancement functionality with a sample prompt
 */
export async function testEnhancement(prompt, config) {
    try {
        const result = await apiGemini.enhancePromptWithGemini(prompt, config);
        return {
            original: prompt,
            enhanced: result
        };
    } catch (error) {
        throw new Error(`Enhancement failed: ${error.message}`);
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
    
    if (config.enhancementApiKey.trim().length > 0) {
        document.getElementById('nig-enhancement-preview').style.display = 'block';
    }
}

/**
 * Saves enhancement configuration to storage
 */
export async function saveEnhancementConfig() {
    await storage.setConfigValue('enhancementEnabled', document.getElementById('nig-enhancement-enabled').checked);
    await storage.setConfigValue('enhancementApiKey', document.getElementById('nig-gemini-api-key').value.trim());
    await storage.setConfigValue('enhancementModel', document.getElementById('nig-enhancement-model').value);
    await storage.setConfigValue('enhancementTemplate', document.getElementById('nig-enhancement-template').value.trim());
    await storage.setConfigValue('enhancementTemplateSelected', document.getElementById('nig-enhancement-template-select').value);
    await storage.setConfigValue('enhancementOverrideProvider', false); // Reset override on save
}

/**
 * Sets up enhancement event listeners
 */
export function setupEnhancementEventListeners(panelElement) {
    const enhancementEnabled = panelElement.querySelector('#nig-enhancement-enabled');
    const overrideProviderBtn = panelElement.querySelector('#nig-override-provider');
    const templateSelect = panelElement.querySelector('#nig-enhancement-template-select');
    const templateResetBtn = panelElement.querySelector('#nig-template-reset');
    const templateExampleBtn = panelElement.querySelector('#nig-template-example');
    const testEnhancementBtn = panelElement.querySelector('#nig-test-enhancement');
    const geminiApiKeyInput = panelElement.querySelector('#nig-gemini-api-key');

    // Enhancement Template Selection Handler
    templateSelect.addEventListener('change', async (e) => {
        const selectedValue = e.target.value;
        const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
        const presets = DEFAULTS.enhancementPresets || {};

        if (selectedValue === 'custom') {
            // Switching to custom: make textarea editable and keep whatever text is currently shown.
            templateTextarea.disabled = false;
            // Do not overwrite enhancementTemplate here; it will be updated on input/save.
            await storage.setConfigValue('enhancementTemplateSelected', 'custom');
        } else {
            // Switching to a non-custom preset: apply preset content and lock textarea.
            const preset = presets[selectedValue];
            if (preset) {
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage.setConfigValue('enhancementTemplate', preset.template);
                await storage.setConfigValue('enhancementTemplateSelected', selectedValue);
            } else {
                // Unknown preset key: treat as custom to avoid wiping user content.
                templateTextarea.disabled = false;
                await storage.setConfigValue('enhancementTemplateSelected', 'custom');
            }
        }
    });

    // Reset to Preset Button
    templateResetBtn.addEventListener('click', async () => {
        const selectedValue = templateSelect.value;
        const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
        const presets = DEFAULTS.enhancementPresets || {};

        if (selectedValue !== 'custom') {
            const preset = presets[selectedValue];
            if (preset) {
                // Explicit "reset" restores the currently selected preset template.
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage.setConfigValue('enhancementTemplate', preset.template);
                await storage.setConfigValue('enhancementTemplateSelected', selectedValue);
            }
        } else {
            // If "custom" is selected, reset should preserve custom mode and just restore stored custom text if any.
            const config = await storage.getConfig();
            const customTemplate = typeof config.enhancementTemplate === 'string'
                ? config.enhancementTemplate
                : '';
            templateTextarea.value = customTemplate;
            templateTextarea.disabled = false;
            await storage.setConfigValue('enhancementTemplateSelected', 'custom');
        }
    });

    // Load Example Button
    templateExampleBtn.addEventListener('click', async () => {
        const exampleTemplate = 'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
        const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
        const templateSelect = panelElement.querySelector('#nig-enhancement-template-select');

        // Treat example as an explicit template choice: store it and mark as custom.
        templateTextarea.value = exampleTemplate;
        templateTextarea.disabled = false;
        if (templateSelect) {
            templateSelect.value = 'custom';
        }
        await storage.setConfigValue('enhancementTemplate', exampleTemplate);
        await storage.setConfigValue('enhancementTemplateSelected', 'custom');
    });

    // Enhancement enabled toggle
    enhancementEnabled.addEventListener('change', async (e) => {
        const newState = e.target.checked;
        const config = await storage.getConfig();
        config.enhancementEnabled = newState;
        await storage.setConfigValue('enhancementEnabled', newState);
        toggleEnhancementSettings(newState);
        const provider = document.getElementById('nig-provider').value;
        updateEnhancementUI(provider, config);
    });

    // Override provider enhancement
    overrideProviderBtn.addEventListener('click', async () => {
        const provider = document.getElementById('nig-provider').value;
        await storage.setConfigValue('enhancementOverrideProvider', true);
        const config = await storage.getConfig();
        updateEnhancementUI(provider, config);
    });

    // API key input handling
    geminiApiKeyInput.addEventListener('input', async (e) => {
        const hasApiKey = e.target.value.trim().length > 0;
        if (hasApiKey) {
            panelElement.querySelector('#nig-enhancement-preview').style.display = 'block';
        } else {
            panelElement.querySelector('#nig-enhancement-preview').style.display = 'none';
        }
    });

    // Track manual edits to enhancement template:
    // Any change by the user should:
    // - Update enhancementTemplate in storage
    // - Flip enhancementTemplateSelected to 'custom' explicitly
    const templateTextareaForInput = panelElement.querySelector('#nig-enhancement-template');
    const templateSelectForInput = panelElement.querySelector('#nig-enhancement-template-select');
    if (templateTextareaForInput) {
        templateTextareaForInput.addEventListener('input', async () => {
            const value = templateTextareaForInput.value;
            await storage.setConfigValue('enhancementTemplate', value);
            await storage.setConfigValue('enhancementTemplateSelected', 'custom');

            if (templateSelectForInput && templateSelectForInput.value !== 'custom') {
                templateSelectForInput.value = 'custom';
            }
        });
    }

    // Test enhancement button
    testEnhancementBtn.addEventListener('click', async () => {
        const config = await storage.getConfig();
        const testPrompt = 'A mystical warrior standing on a cliff overlooking a magical forest with glowing mushrooms and ethereal mist';
        
        testEnhancementBtn.disabled = true;
        const originalContent = testEnhancementBtn.innerHTML;
        testEnhancementBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>Testing...';

        try {
            const result = await testEnhancement(testPrompt, config);
            document.getElementById('nig-original-prompt').textContent = result.original;
            document.getElementById('nig-enhanced-prompt').textContent = result.enhanced;
        } catch (error) {
            alert(`Enhancement test failed: ${error.message}`);
        } finally {
            testEnhancementBtn.disabled = false;
            testEnhancementBtn.innerHTML = originalContent;
        }
    });
}