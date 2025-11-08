// --- IMPORTS ---
import { DEFAULTS } from '../config/defaults.js';
import { PROMPT_CATEGORIES } from '../config/styles.js';
import * as storage from '../utils/storage.js';
import * as logger from '../utils/logger.js';
import * as file from '../utils/file.js';

// --- PUBLIC FUNCTIONS ---

/**
 * Updates which provider settings are visible based on selected provider
 */
export function updateVisibleSettings() {
    const provider = document.getElementById('nig-provider').value;
    document.querySelectorAll('.nig-provider-settings').forEach(el => (el.style.display = 'none'));
    const settingsEl = document.getElementById(`nig-provider-${provider}`);
    if (settingsEl) {
        settingsEl.style.display = 'block';
    }
}

/**
 * Updates sub-styles dropdown based on main style selection
 */
export function updateSubStyles(mainStyleName) {
    const subStyleSelect = document.getElementById('nig-sub-style');
    const mainStyleDesc = document.getElementById('nig-main-style-desc');
    const subStyleDesc = document.getElementById('nig-sub-style-desc');

    const selectedCategory = PROMPT_CATEGORIES.find(cat => cat.name === mainStyleName);
    mainStyleDesc.textContent = selectedCategory ? selectedCategory.description : '';
    subStyleSelect.innerHTML = '';

    if (selectedCategory && selectedCategory.subStyles.length > 0) {
        subStyleSelect.disabled = false;
        selectedCategory.subStyles.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.value;
            option.textContent = sub.name;
            subStyleSelect.appendChild(option);
        });
        subStyleSelect.dispatchEvent(new Event('change'));
    } else {
        subStyleSelect.disabled = true;
        subStyleDesc.textContent = '';
    }
}

/**
 * Populates the configuration form with current settings
 */
export async function populateConfigForm() {
    const config = await storage.getConfig();
    
    // Provider selection
    document.getElementById('nig-provider').value = config.selectedProvider;

    // Style settings
    const mainStyleSelect = document.getElementById('nig-main-style');
    mainStyleSelect.innerHTML = '';
    PROMPT_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        mainStyleSelect.appendChild(option);
    });
    mainStyleSelect.value = config.mainPromptStyle;
    updateSubStyles(config.mainPromptStyle);
    document.getElementById('nig-sub-style').value = config.subPromptStyle;
    document.getElementById('nig-sub-style').dispatchEvent(new Event('change'));

    // Custom style settings
    const customStyleEnable = document.getElementById('nig-custom-style-enable');
    const customStyleText = document.getElementById('nig-custom-style-text');
    customStyleEnable.checked = config.customStyleEnabled;
    customStyleText.value = config.customStyleText;
    customStyleText.disabled = !config.customStyleEnabled;

    // Enhancement settings
    document.getElementById('nig-enhancement-enabled').checked = config.enhancementEnabled;
    document.getElementById('nig-gemini-api-key').value = config.enhancementApiKey;
    document.getElementById('nig-enhancement-model').value = config.enhancementModel;
    
    // Enhancement template selection will be handled by enhancementPanel.js

    // Negative prompt settings
    document.getElementById('nig-enable-neg-prompt').checked = config.enableNegPrompt;
    document.getElementById('nig-global-neg-prompt').value = config.globalNegPrompt;

    // Provider-specific settings will be handled by models.js
    // This will be called after the provider forms are populated

    // History days setting
    const historyDays = await storage.getHistoryDays();
    document.getElementById('nig-history-clean-days').value = historyDays;

    updateVisibleSettings();
}

/**
 * Populates provider-specific form sections
 */
export async function populateProviderForms(config) {
    // Import and call the populateProviderForms from models.js
    const { populateProviderForms: populateProviderFormsModels } = await import('../api/models.js');
    await populateProviderFormsModels(config);
}

/**
 * Saves configuration from form to storage
 */
export async function saveConfig() {
    // Style configuration
    await storage.setConfigValue('mainPromptStyle', document.getElementById('nig-main-style').value);
    await storage.setConfigValue('subPromptStyle', document.getElementById('nig-sub-style').value);
    await storage.setConfigValue('customStyleEnabled', document.getElementById('nig-custom-style-enable').checked);
    await storage.setConfigValue('customStyleText', document.getElementById('nig-custom-style-text').value.trim());
    
    // Enhancement configuration (will be handled by enhancementPanel.js)
    await storage.setConfigValue('enhancementEnabled', document.getElementById('nig-enhancement-enabled').checked);
    await storage.setConfigValue('enhancementApiKey', document.getElementById('nig-gemini-api-key').value.trim());
    await storage.setConfigValue('enhancementModel', document.getElementById('nig-enhancement-model').value);
    await storage.setConfigValue('enhancementTemplate', document.getElementById('nig-enhancement-template').value.trim());
    await storage.setConfigValue('enhancementTemplateSelected', document.getElementById('nig-enhancement-template-select').value);
    
    // Negative prompt configuration
    await storage.setConfigValue('enableNegPrompt', document.getElementById('nig-enable-neg-prompt').checked);
    await storage.setConfigValue('globalNegPrompt', document.getElementById('nig-global-neg-prompt').value.trim());
    
    // Provider selection
    await storage.setConfigValue('selectedProvider', document.getElementById('nig-provider').value);
    
    // Provider-specific configurations will be saved by their respective modules
    // (models.js for Pollinations, AI Horde, Google, and OpenAI compatible)
    
    alert('Configuration saved!');
}

/**
 * Exports configuration to a JSON file
 */
export async function exportConfig() {
    const config = await storage.getConfig();
    const configData = JSON.stringify(config, null, 2);
    const filename = `wtr-lab-image-generator-config-${new Date().toISOString().split('T')[0]}.json`;
    file.downloadFile(filename, configData, 'application/json');
}

/**
 * Imports configuration from a JSON file
 */
export async function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const config = JSON.parse(text);
        
        if (confirm('This will overwrite all current settings. Continue?')) {
            // Set all config values
            Object.keys(config).forEach(key => {
                storage.setConfigValue(key, config[key]);
            });
            
            alert('Configuration imported successfully!');
            await populateConfigForm();
        }
    } catch (error) {
        alert(`Failed to import configuration: ${error.message}`);
    }
    
    // Clear file input
    event.target.value = '';
}