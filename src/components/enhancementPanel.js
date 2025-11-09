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
/**
 * Load and normalize user presets from config.
 * Ensures backward compatibility with potential legacy shapes.
 */
function getNormalizedUserPresets(config) {
    const raw = config.enhancementUserPresets;
    const normalized = {};

    try {
        if (!raw) {
            return normalized;
        }

        // If already an object map of id -> preset
        if (typeof raw === 'object' && !Array.isArray(raw)) {
            Object.entries(raw).forEach(([id, value]) => {
                if (value && typeof value.template === 'string') {
                    const presetId = value.id || id;
                    normalized[presetId] = {
                        id: presetId,
                        name: value.name || presetId,
                        description: typeof value.description === 'string' ? value.description : '',
                        template: value.template,
                        createdAt: value.createdAt || null,
                        updatedAt: value.updatedAt || null,
                        version: value.version || 1
                    };
                }
            });
            return normalized;
        }

        // If legacy array: [{ name, template, ... }]
        if (Array.isArray(raw)) {
            raw.forEach((p, index) => {
                if (p && typeof p.template === 'string') {
                    const safeName = (p.name && typeof p.name === 'string')
                        ? p.name.trim()
                        : `Preset ${index + 1}`;
                    const id = p.id || safeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '') || `preset-${index + 1}`;
                    if (!normalized[id]) {
                        normalized[id] = {
                            id,
                            name: safeName,
                            description: typeof p.description === 'string' ? p.description : '',
                            template: p.template,
                            createdAt: p.createdAt || null,
                            updatedAt: p.updatedAt || null,
                            version: 1
                        };
                    }
                }
            });
            return normalized;
        }
    } catch (e) {
        console.error('[NIG] Failed to normalize enhancementUserPresets, clearing corrupted data', e);
    }

    return normalized;
}

/**
 * Persist normalized user presets back to storage.
 */
async function saveUserPresetsToStorage(userPresetsMap) {
    try {
        await storage.setConfigValue('enhancementUserPresets', userPresetsMap || {});
    } catch (e) {
        console.error('[NIG] Failed to save enhancementUserPresets', e);
        alert('Failed to save enhancement preset. See console for details.');
    }
}

/**
 * Populate the Enhancement Template select with grouped user + default presets,
 * ensuring "User Presets" group appears above "Default Presets".
 */
function populateEnhancementTemplateSelect(templateSelect, userPresetsMap, selectedKey) {
    const defaultPresets = DEFAULTS.enhancementPresets || {};

    // Clear existing options while preserving optgroup structure from template
    templateSelect.innerHTML = '';

    // User Presets group
    const userOptgroup = document.createElement('optgroup');
    userOptgroup.label = 'User Presets';
    userOptgroup.dataset.group = 'user-presets';

    const userPresetEntries = Object.values(userPresetsMap || {});
    if (userPresetEntries.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.disabled = true;
        emptyOption.textContent = 'No user presets saved yet';
        userOptgroup.appendChild(emptyOption);
    } else {
        userPresetEntries.forEach(preset => {
            const option = document.createElement('option');
            option.value = `user:${preset.id}`;
            option.textContent = preset.name || preset.id;
            option.title = preset.description || preset.template || '';
            userOptgroup.appendChild(option);
        });
    }

    // Default Presets group (top 5 only per DEFAULTS)
    const defaultOptgroup = document.createElement('optgroup');
    defaultOptgroup.label = 'Default Presets';
    defaultOptgroup.dataset.group = 'default-presets';

    Object.entries(defaultPresets).forEach(([key, preset]) => {
        if (!preset || typeof preset.template !== 'string') return;
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${preset.name} - ${preset.description}`;
        option.title = preset.template;
        defaultOptgroup.appendChild(option);
    });

    // Append groups in required order
    templateSelect.appendChild(userOptgroup);
    templateSelect.appendChild(defaultOptgroup);

    // Custom one-off entry at bottom (not part of any optgroup)
    const customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Custom (one-off)';
    templateSelect.appendChild(customOption);

    // Resolve selection
    if (selectedKey && templateSelect.querySelector(`option[value="${selectedKey}"]`)) {
        templateSelect.value = selectedKey;
    } else if (selectedKey && selectedKey.startsWith('user:') && templateSelect.querySelector(`option[value="${selectedKey}"]`)) {
        templateSelect.value = selectedKey;
    } else if (selectedKey && defaultPresets[selectedKey]) {
        templateSelect.value = selectedKey;
    } else if (selectedKey === 'custom') {
        templateSelect.value = 'custom';
    } else {
        // Fallback to standard if available
        if (defaultPresets.standard) {
            templateSelect.value = 'standard';
        } else {
            templateSelect.value = 'custom';
        }
    }
}

/**
 * Handle initial enhancement template selection, including user presets.
 */
export async function handleEnhancementTemplateSelection(config) {
    const templateSelect = document.getElementById('nig-enhancement-template-select');
    const templateTextarea = document.getElementById('nig-enhancement-template');

    if (!templateSelect || !templateTextarea) {
        return;
    }

    const defaultPresets = DEFAULTS.enhancementPresets || {};
    const userPresets = getNormalizedUserPresets(config);

    const storedSelected = config.enhancementTemplateSelected;
    const storedTemplate = typeof config.enhancementTemplate === 'string'
        ? config.enhancementTemplate
        : '';

    // Try to resolve selection:
    // - user:<id> for user presets
    // - default preset keys
    // - 'custom'
    let resolvedKey = null;

    if (storedSelected && typeof storedSelected === 'string') {
        if (storedSelected === 'custom') {
            resolvedKey = 'custom';
        } else if (storedSelected.startsWith('user:')) {
            const id = storedSelected.replace(/^user:/, '');
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
        for (const preset of Object.values(userPresets)) {
            if (preset.template === storedTemplate) {
                resolvedKey = `user:${preset.id}`;
                break;
            }
        }

        // Check default presets if still not resolved
        if (!resolvedKey) {
            for (const [key, preset] of Object.entries(defaultPresets)) {
                if (preset && typeof preset === 'object' && preset.template === storedTemplate) {
                    resolvedKey = key;
                    break;
                }
            }
        }

        // Fallback: treat as custom if we have content
        if (!resolvedKey) {
            resolvedKey = 'custom';
        }
    }

    // Final fallback to standard if nothing else
    if (!resolvedKey) {
        resolvedKey = defaultPresets.standard ? 'standard' : 'custom';
    }

    // Populate select with grouped options
    populateEnhancementTemplateSelect(templateSelect, userPresets, resolvedKey);

    // Populate textarea and readonly/editable state
    if (resolvedKey === 'custom') {
        templateTextarea.value = storedTemplate || '';
        templateTextarea.disabled = false;
    } else if (resolvedKey.startsWith('user:')) {
        const id = resolvedKey.replace(/^user:/, '');
        const preset = userPresets[id];
        if (preset) {
            templateTextarea.value = preset.template;
            templateTextarea.disabled = true;
        } else {
            // Missing user preset -> fallback to custom with storedTemplate
            templateTextarea.value = storedTemplate || '';
            templateTextarea.disabled = false;
            templateSelect.value = 'custom';
        }
    } else {
        const preset = defaultPresets[resolvedKey];
        if (preset) {
            templateTextarea.value = preset.template;
            templateTextarea.disabled = true;
        } else {
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
    const templateSavePresetBtn = panelElement.querySelector('#nig-template-save-preset');
    const templateDeletePresetBtn = panelElement.querySelector('#nig-template-delete-preset');
    const templateExampleBtn = panelElement.querySelector('#nig-template-example');
    const testEnhancementBtn = panelElement.querySelector('#nig-test-enhancement');
    const geminiApiKeyInput = panelElement.querySelector('#nig-gemini-api-key');

    // Enhancement Template Selection Handler
    templateSelect.addEventListener('change', async (e) => {
        const selectedValue = e.target.value;
        const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
        const defaultPresets = DEFAULTS.enhancementPresets || {};
        const config = await storage.getConfig();
        const userPresets = getNormalizedUserPresets(config);

        if (selectedValue === 'custom') {
            // Custom one-off: textarea editable, not bound to a named preset.
            templateTextarea.disabled = false;
            await storage.setConfigValue('enhancementTemplateSelected', 'custom');
        } else if (selectedValue.startsWith('user:')) {
            const id = selectedValue.replace(/^user:/, '');
            const preset = userPresets[id];
            if (preset) {
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage.setConfigValue('enhancementTemplate', preset.template);
                await storage.setConfigValue('enhancementTemplateSelected', `user:${id}`);
            } else {
                // Missing user preset -> treat as custom to avoid data loss.
                templateTextarea.disabled = false;
                await storage.setConfigValue('enhancementTemplateSelected', 'custom');
            }
        } else {
            // Default preset
            const preset = defaultPresets[selectedValue];
            if (preset) {
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage.setConfigValue('enhancementTemplate', preset.template);
                await storage.setConfigValue('enhancementTemplateSelected', selectedValue);
            } else {
                // Unknown key: fallback to custom
                templateTextarea.disabled = false;
                await storage.setConfigValue('enhancementTemplateSelected', 'custom');
            }
        }
    });

    // Save as Preset Button
    if (templateSavePresetBtn) {
        templateSavePresetBtn.addEventListener('click', async () => {
            try {
                const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
                const templateSelectEl = panelElement.querySelector('#nig-enhancement-template-select');
                const rawText = (templateTextarea.value || '').trim();

                if (!rawText) {
                    alert('Cannot save an empty enhancement preset.');
                    return;
                }

                const name = prompt('Enter a name for this enhancement preset:', '');
                if (!name) {
                    return;
                }

                const trimmedName = name.trim();
                if (!trimmedName) {
                    alert('Preset name cannot be empty.');
                    return;
                }

                const config = await storage.getConfig();
                const existing = getNormalizedUserPresets(config);

                // Generate stable id from name
                let baseId = trimmedName.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-_]/g, '')
                    .substring(0, 64) || 'preset';

                let id = baseId;
                let suffix = 1;
                while (existing[id] && existing[id].name !== trimmedName) {
                    id = `${baseId}-${suffix++}`;
                }

                const nowIso = new Date().toISOString();
                existing[id] = {
                    id,
                    name: trimmedName,
                    description: '',
                    template: rawText,
                    createdAt: existing[id]?.createdAt || nowIso,
                    updatedAt: nowIso,
                    version: 1
                };

                await saveUserPresetsToStorage(existing);

                // Refresh select with new user preset list
                populateEnhancementTemplateSelect(templateSelectEl, existing, `user:${id}`);

                // Lock textarea for the saved preset
                templateTextarea.value = rawText;
                templateTextarea.disabled = true;

                await storage.setConfigValue('enhancementTemplate', rawText);
                await storage.setConfigValue('enhancementTemplateSelected', `user:${id}`);

                alert(`Enhancement preset "${trimmedName}" saved under User Presets.`);
            } catch (e) {
                console.error('[NIG] Failed to save enhancement preset', e);
                alert('Failed to save enhancement preset. Please check the console for details.');
            }
        });
    }

    // Delete selected user preset
    if (templateDeletePresetBtn) {
        templateDeletePresetBtn.addEventListener('click', async () => {
            try {
                const templateSelectEl = panelElement.querySelector('#nig-enhancement-template-select');
                const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
                const selected = templateSelectEl ? templateSelectEl.value : '';

                if (!selected || !selected.startsWith('user:')) {
                    alert('Please select a User Preset from the "User Presets" group to delete.');
                    return;
                }

                const id = selected.replace(/^user:/, '');
                const config = await storage.getConfig();
                const existing = getNormalizedUserPresets(config);

                if (!existing[id]) {
                    alert('The selected user preset no longer exists or is invalid.');
                    return;
                }

                const confirmMessage = `Delete user preset "${existing[id].name || id}"? This action cannot be undone.`;
                if (!confirm(confirmMessage)) {
                    return;
                }

                // Remove preset and persist
                delete existing[id];
                await saveUserPresetsToStorage(existing);

                // Rebuild the select; default to "standard" if available or "custom"
                const fallbackKey = DEFAULTS.enhancementPresets?.standard ? 'standard' : 'custom';
                populateEnhancementTemplateSelect(templateSelectEl, existing, fallbackKey);

                // If we deleted the active preset, update textarea and selection accordingly
                if (selected === config.enhancementTemplateSelected) {
                    if (fallbackKey === 'custom') {
                        templateTextarea.value = (config.enhancementTemplate || '').trim();
                        templateTextarea.disabled = false;
                        await storage.setConfigValue('enhancementTemplateSelected', 'custom');
                    } else {
                        const fallbackPreset = DEFAULTS.enhancementPresets[fallbackKey];
                        templateTextarea.value = fallbackPreset?.template || '';
                        templateTextarea.disabled = !!fallbackPreset;
                        if (fallbackPreset) {
                            await storage.setConfigValue('enhancementTemplate', fallbackPreset.template);
                        }
                        await storage.setConfigValue('enhancementTemplateSelected', fallbackKey);
                    }
                }

                alert('User preset deleted.');
            } catch (e) {
                console.error('[NIG] Failed to delete enhancement user preset', e);
                alert('Failed to delete user preset. Please check the console for details.');
            }
        });
    }

    // Reset to Preset Button
    templateResetBtn.addEventListener('click', async () => {
        const selectedValue = templateSelect.value;
        const templateTextarea = panelElement.querySelector('#nig-enhancement-template');
        const defaultPresets = DEFAULTS.enhancementPresets || {};
        const config = await storage.getConfig();
        const userPresets = getNormalizedUserPresets(config);

        if (selectedValue !== 'custom') {
            if (selectedValue.startsWith('user:')) {
                const id = selectedValue.replace(/^user:/, '');
                const preset = userPresets[id];
                if (preset) {
                    templateTextarea.value = preset.template;
                    templateTextarea.disabled = true;
                    await storage.setConfigValue('enhancementTemplate', preset.template);
                    await storage.setConfigValue('enhancementTemplateSelected', `user:${id}`);
                }
            } else {
                const preset = defaultPresets[selectedValue];
                if (preset) {
                    templateTextarea.value = preset.template;
                    templateTextarea.disabled = true;
                    await storage.setConfigValue('enhancementTemplate', preset.template);
                    await storage.setConfigValue('enhancementTemplateSelected', selectedValue);
                }
            }
        } else {
            // If "custom" is selected, reset should restore stored custom text if any.
            const cfg = await storage.getConfig();
            const customTemplate = typeof cfg.enhancementTemplate === 'string'
                ? cfg.enhancementTemplate
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
    // Always persist latest raw text for resilience.
    const templateTextareaForInput = panelElement.querySelector('#nig-enhancement-template');
    const templateSelectForInput = panelElement.querySelector('#nig-enhancement-template-select');
    if (templateTextareaForInput && templateSelectForInput) {
        templateTextareaForInput.addEventListener('input', async () => {
            const value = templateTextareaForInput.value;
            const currentSelect = templateSelectForInput.value;

            await storage.setConfigValue('enhancementTemplate', value);

            // Only mark as custom when explicitly in custom mode
            if (currentSelect === 'custom') {
                await storage.setConfigValue('enhancementTemplateSelected', 'custom');
            }
        });
    }

    // Test enhancement button
    testEnhancementBtn.addEventListener('click', async () => {
        const config = await storage.getConfig();
        const maxTestLength = 4000;
        const defaultPrompt = (
            'As dusk settles over the glass-domed city of Aurelia, bioluminescent vines unfurl along the skybridges, ' +
            'casting soft teal and amethyst reflections across the rain-slick streets below. A lone archivist in a ' +
            'weathered indigo cloak pauses at the edge of the highest promenade, holographic pages circling her like ' +
            'gentle fireflies, each fragment revealing glimpses of forgotten constellations and outlawed legends. ' +
            'Far beneath, maglev trams weave through layers of suspended gardens, mirrored water channels, and rising ' +
            'plumes of golden steam as hidden market stalls ignite with warm lantern light. In the distance, an ancient ' +
            'stone observatory fused with gleaming chrome spires pierces the cloudline, its rotating rings aligning ' +
            'slowly with an eclipse of twin moons. The air shimmers with drifting petals, neon signage in lost languages, ' +
            'and faint auroras bending around colossal statues half-consumed by ivy and circuitry.'
        );

        const originalPromptEl = document.getElementById('nig-original-prompt');
        let testPrompt = originalPromptEl ? (originalPromptEl.value || originalPromptEl.textContent || '').trim() : '';

        // If no user-provided prompt in the editable field, fallback to default narrative prompt
        if (!testPrompt) {
            testPrompt = defaultPrompt;
            if (originalPromptEl) {
                // Populate the editable area so the user can see/modify what was used
                if ('value' in originalPromptEl) {
                    originalPromptEl.value = defaultPrompt;
                } else {
                    originalPromptEl.textContent = defaultPrompt;
                }
            }
        }

        // Enforce a reasonable length limit for preview requests
        if (testPrompt.length > maxTestLength) {
            alert('Test prompt is too long. Please use 4000 characters or fewer for preview.');
            return;
        }

        testEnhancementBtn.disabled = true;
        const originalContent = testEnhancementBtn.innerHTML;
        testEnhancementBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span>Testing...';

        try {
            const result = await testEnhancement(testPrompt, config);
            const originalEl = document.getElementById('nig-original-prompt');
            const enhancedEl = document.getElementById('nig-enhanced-prompt');

            // Reflect the exact original prompt used for enhancement in the editable field
            if (originalEl) {
                if ('value' in originalEl) {
                    originalEl.value = result.original || '';
                } else {
                    originalEl.textContent = result.original || '';
                }
            }

            if (enhancedEl) {
                enhancedEl.textContent = result.enhanced || '';
            }
        } catch (error) {
            console.error('[NIG] Enhancement test failed', error);
            const message = error && error.message ? error.message : 'Unknown error occurred while requesting enhancement.';
            alert(`Enhancement test failed: ${message}`);
        } finally {
            testEnhancementBtn.disabled = false;
            testEnhancementBtn.innerHTML = originalContent;
        }
    });
}