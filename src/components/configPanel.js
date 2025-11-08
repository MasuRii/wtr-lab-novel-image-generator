// --- IMPORTS ---
import { DEFAULTS } from '../config/defaults.js';
import { PROMPT_CATEGORIES } from '../config/styles.js';
import { TOP_MODELS } from '../config/models.js';
import * as storage from '../utils/storage.js';
import * as cache from '../utils/cache.js';
import * as file from '../utils/file.js';
import * as logger from '../utils/logger.js';
import * as apiGemini from '../api/gemini.js';

// --- MODULE STATE ---
let panelElement = null;
let initializeCallbacks = {};

// --- PRIVATE HELPER FUNCTIONS ---

function updateVisibleSettings() {
    const provider = document.getElementById('nig-provider').value;
    document.querySelectorAll('.nig-provider-settings').forEach(el => (el.style.display = 'none'));
    const settingsEl = document.getElementById(`nig-provider-${provider}`);
    if (settingsEl) {
        settingsEl.style.display = 'block';
    }
}

function updateSubStyles(mainStyleName) {
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

function toggleEnhancementSettings(enabled) {
    const enhancementSettings = document.getElementById('nig-enhancement-settings');
    if (enhancementSettings) {
        if (enabled) {
            enhancementSettings.classList.remove('disabled');
        } else {
            enhancementSettings.classList.add('disabled');
        }
    }
}

function updateEnhancementUI(provider, config) {
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

async function populateConfigForm() {
    const config = await storage.getConfig();
    document.getElementById('nig-provider').value = config.selectedProvider;

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

    const customStyleEnable = document.getElementById('nig-custom-style-enable');
    const customStyleText = document.getElementById('nig-custom-style-text');
    customStyleEnable.checked = config.customStyleEnabled;
    customStyleText.value = config.customStyleText;
    customStyleText.disabled = !config.customStyleEnabled;

    document.getElementById('nig-enhancement-enabled').checked = config.enhancementEnabled;
    document.getElementById('nig-gemini-api-key').value = config.enhancementApiKey;
    document.getElementById('nig-enhancement-model').value = config.enhancementModel;
    document.getElementById('nig-enhancement-template').value = config.enhancementTemplate;
    toggleEnhancementSettings(config.enhancementEnabled);
    updateEnhancementUI(config.selectedProvider, config);
    if (config.enhancementApiKey.trim().length > 0) {
        document.getElementById('nig-enhancement-preview').style.display = 'block';
    }

    document.getElementById('nig-enable-neg-prompt').checked = config.enableNegPrompt;
    document.getElementById('nig-global-neg-prompt').value = config.globalNegPrompt;

    document.getElementById('nig-pollinations-width').value = config.pollinationsWidth;
    document.getElementById('nig-pollinations-height').value = config.pollinationsHeight;
    document.getElementById('nig-pollinations-seed').value = config.pollinationsSeed;
    document.getElementById('nig-pollinations-enhance').checked = config.pollinationsEnhance;
    document.getElementById('nig-pollinations-safe').checked = config.pollinationsSafe;
    document.getElementById('nig-pollinations-nologo').checked = config.pollinationsNologo;
    document.getElementById('nig-pollinations-private').checked = config.pollinationsPrivate;
    document.getElementById('nig-pollinations-token').value = config.pollinationsToken;
    fetchPollinationsModels(config.pollinationsModel);

    document.getElementById('nig-horde-api-key').value = config.aiHordeApiKey;
    document.getElementById('nig-horde-sampler').value = config.aiHordeSampler;
    document.getElementById('nig-horde-steps').value = config.aiHordeSteps;
    document.getElementById('nig-horde-cfg').value = config.aiHordeCfgScale;
    document.getElementById('nig-horde-width').value = config.aiHordeWidth;
    document.getElementById('nig-horde-height').value = config.aiHordeHeight;
    document.getElementById('nig-horde-seed').value = config.aiHordeSeed;
    document.querySelectorAll('input[name="nig-horde-post"]').forEach(cb => {
        cb.checked = config.aiHordePostProcessing.includes(cb.value);
    });
    fetchAIHordeModels(config.aiHordeModel);

    document.getElementById('nig-google-api-key').value = config.googleApiKey;
    document.getElementById('nig-model').value = config.model;
    document.getElementById('nig-num-images').value = config.numberOfImages;
    document.getElementById('nig-image-size').value = config.imageSize;
    document.getElementById('nig-aspect-ratio').value = config.aspectRatio;
    document.getElementById('nig-person-gen').value = config.personGeneration;

    await loadOpenAIProfiles();
    if (config.openAICompatModelManualInput) {
        document.getElementById('nig-openai-model-container-select').style.display = 'none';
        document.getElementById('nig-openai-model-container-manual').style.display = 'block';
    } else {
        document.getElementById('nig-openai-model-container-select').style.display = 'block';
        document.getElementById('nig-openai-model-container-manual').style.display = 'none';
    }

    updateVisibleSettings();
}

async function saveConfig() {
    await storage.setConfigValue('mainPromptStyle', document.getElementById('nig-main-style').value);
    await storage.setConfigValue('subPromptStyle', document.getElementById('nig-sub-style').value);
    await storage.setConfigValue('customStyleEnabled', document.getElementById('nig-custom-style-enable').checked);
    await storage.setConfigValue('customStyleText', document.getElementById('nig-custom-style-text').value.trim());
    await storage.setConfigValue('enhancementEnabled', document.getElementById('nig-enhancement-enabled').checked);
    await storage.setConfigValue('enhancementApiKey', document.getElementById('nig-gemini-api-key').value.trim());
    await storage.setConfigValue('enhancementModel', document.getElementById('nig-enhancement-model').value);
    await storage.setConfigValue('enhancementTemplate', document.getElementById('nig-enhancement-template').value.trim());
    await storage.setConfigValue('enableNegPrompt', document.getElementById('nig-enable-neg-prompt').checked);
    await storage.setConfigValue('globalNegPrompt', document.getElementById('nig-global-neg-prompt').value.trim());
    await storage.setConfigValue('selectedProvider', document.getElementById('nig-provider').value);
    await storage.setConfigValue('pollinationsModel', document.getElementById('nig-pollinations-model').value);
    await storage.setConfigValue('pollinationsWidth', document.getElementById('nig-pollinations-width').value);
    await storage.setConfigValue('pollinationsHeight', document.getElementById('nig-pollinations-height').value);
    await storage.setConfigValue('pollinationsSeed', document.getElementById('nig-pollinations-seed').value.trim());
    await storage.setConfigValue('pollinationsEnhance', document.getElementById('nig-pollinations-enhance').checked);
    await storage.setConfigValue('pollinationsSafe', document.getElementById('nig-pollinations-safe').checked);
    await storage.setConfigValue('pollinationsNologo', document.getElementById('nig-pollinations-nologo').checked);
    await storage.setConfigValue('pollinationsPrivate', document.getElementById('nig-pollinations-private').checked);
    await storage.setConfigValue('pollinationsToken', document.getElementById('nig-pollinations-token').value.trim());
    await storage.setConfigValue('aiHordeApiKey', document.getElementById('nig-horde-api-key').value.trim() || '0000000000');
    await storage.setConfigValue('aiHordeModel', document.getElementById('nig-horde-model').value);
    await storage.setConfigValue('aiHordeSampler', document.getElementById('nig-horde-sampler').value);
    await storage.setConfigValue('aiHordeSteps', document.getElementById('nig-horde-steps').value);
    await storage.setConfigValue('aiHordeCfgScale', document.getElementById('nig-horde-cfg').value);
    await storage.setConfigValue('aiHordeWidth', document.getElementById('nig-horde-width').value);
    await storage.setConfigValue('aiHordeHeight', document.getElementById('nig-horde-height').value);
    await storage.setConfigValue('aiHordeSeed', document.getElementById('nig-horde-seed').value.trim());
    const postProcessing = Array.from(document.querySelectorAll('input[name="nig-horde-post"]:checked')).map(cb => cb.value);
    await storage.setConfigValue('aiHordePostProcessing', postProcessing);
    await storage.setConfigValue('googleApiKey', document.getElementById('nig-google-api-key').value.trim());
    await storage.setConfigValue('model', document.getElementById('nig-model').value);
    await storage.setConfigValue('numberOfImages', document.getElementById('nig-num-images').value);
    await storage.setConfigValue('imageSize', document.getElementById('nig-image-size').value);
    await storage.setConfigValue('aspectRatio', document.getElementById('nig-aspect-ratio').value);
    await storage.setConfigValue('personGeneration', document.getElementById('nig-person-gen').value);

    const baseUrl = document.getElementById('nig-openai-compat-base-url').value.trim();
    if (baseUrl) {
        const profiles = await storage.getConfigValue('openAICompatProfiles');
        const isManualMode = document.getElementById('nig-openai-model-container-manual').style.display !== 'none';
        const model = isManualMode
            ? document.getElementById('nig-openai-compat-model-manual').value.trim()
            : document.getElementById('nig-openai-compat-model').value;
        
        profiles[baseUrl] = {
            apiKey: document.getElementById('nig-openai-compat-api-key').value.trim(),
            model: model,
        };
        await storage.setConfigValue('openAICompatProfiles', profiles);
        await storage.setConfigValue('openAICompatActiveProfileUrl', baseUrl);
        await storage.setConfigValue('openAICompatModelManualInput', isManualMode);
    }

    alert('Configuration saved!');
}

async function fetchPollinationsModels(selectedModel) {
    const select = document.getElementById('nig-pollinations-model');
    select.innerHTML = '<option>Loading models...</option>';
    
    try {
        const cachedModels = await cache.getCachedModelsForProvider('pollinations');
        if (cachedModels && cachedModels.length > 0) {
            logger.logInfo('CACHE', 'Loading Pollinations models from cache');
            populatePollinationsSelect(select, cachedModels, selectedModel);
            return;
        }
    } catch (error) {
        logger.logError('CACHE', 'Failed to get cached Pollinations models', { error: error.message });
    }

    logger.logInfo('NETWORK', 'Fetching Pollinations models from API');
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://image.pollinations.ai/models',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        onload: async (response) => {
            try {
                const models = JSON.parse(response.responseText);
                await cache.setCachedModels('pollinations', models);
                logger.logInfo('NETWORK', 'Fetched and cached Pollinations models', { count: models.length });
                populatePollinationsSelect(select, models, selectedModel);
            } catch (e) {
                logger.logError('NETWORK', 'Failed to parse Pollinations models', { error: e.message });
                select.innerHTML = '<option>flux</option>';
                select.value = 'flux';
            }
        },
        onerror: (error) => {
            logger.logError('NETWORK', 'Failed to fetch Pollinations models', { error: error });
            select.innerHTML = '<option>flux</option>';
            select.value = 'flux';
        }
    });
}

function populatePollinationsSelect(select, models, selectedModel) {
    select.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        let textContent = model;
        if (model === 'gptimage') {
            textContent += ' (Recommended: Quality)';
        } else if (model === 'flux') {
            textContent += ' (Default: Speed)';
        }
        option.textContent = textContent;
        select.appendChild(option);
    });
    if (models.includes(selectedModel)) {
        select.value = selectedModel;
    } else {
        select.value = 'flux';
    }
}

async function fetchAIHordeModels(selectedModel) {
    const select = document.getElementById('nig-horde-model');
    select.innerHTML = '<option>Loading models...</option>';
    
    try {
        const cachedModels = await cache.getCachedModelsForProvider('aiHorde');
        if (cachedModels && cachedModels.length > 0) {
            logger.logInfo('CACHE', 'Loading AI Horde models from cache');
            populateAIHordeSelect(select, cachedModels, selectedModel);
            return;
        }
    } catch (error) {
        logger.logError('CACHE', 'Failed to get cached AI Horde models', { error: error.message });
    }

    logger.logInfo('NETWORK', 'Fetching AI Horde models from API');
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://aihorde.net/api/v2/status/models?type=image',
        onload: async (response) => {
            try {
                const apiModels = JSON.parse(response.responseText);
                await cache.setCachedModels('aiHorde', apiModels);
                logger.logInfo('NETWORK', 'Fetched and cached AI Horde models', { count: apiModels.length });
                populateAIHordeSelect(select, apiModels, selectedModel);
            } catch (e) {
                logger.logError('NETWORK', 'Failed to parse AI Horde models', { error: e.message });
                select.innerHTML = '<option>Stable Diffusion</option>';
                select.value = 'Stable Diffusion';
            }
        },
        onerror: (error) => {
            logger.logError('NETWORK', 'Failed to fetch AI Horde models', { error: error });
            select.innerHTML = '<option>Stable Diffusion</option>';
            select.value = 'Stable Diffusion';
        }
    });
}

function populateAIHordeSelect(select, models, selectedModel) {
    select.innerHTML = '';
    
    const apiModelMap = new Map(models.map(m => [m.name, m]));
    const topModelNames = new Set(TOP_MODELS.map(m => m.name));
    
    const topGroup = document.createElement('optgroup');
    topGroup.label = 'Top 10 Popular Models';
    
    const otherGroup = document.createElement('optgroup');
    otherGroup.label = 'Other Models';
    
    // Add top models first
    TOP_MODELS.forEach(topModel => {
        if (apiModelMap.has(topModel.name)) {
            const apiData = apiModelMap.get(topModel.name);
            const option = document.createElement('option');
            option.value = topModel.name;
            option.textContent = `${topModel.name} - ${topModel.desc} (${apiData.count} workers)`;
            topGroup.appendChild(option);
        }
    });
    
    // Add other models
    const otherModels = models.filter(m => !topModelNames.has(m.name)).sort((a, b) => b.count - a.count);
    otherModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.name;
        option.textContent = `${model.name} (${model.count} workers)`;
        otherGroup.appendChild(option);
    });
    
    select.appendChild(topGroup);
    select.appendChild(otherGroup);
    
    if (Array.from(select.options).some(opt => opt.value === selectedModel)) {
        select.value = selectedModel;
    } else {
        select.value = models[0]?.name || 'Stable Diffusion';
    }
}

function isModelFree(model) {
    if (typeof model.is_free === 'boolean') return model.is_free;
    if (typeof model.premium_model === 'boolean') return !model.premium_model;
    if (Array.isArray(model.tiers) && model.tiers.includes('Free')) return true;
    return false;
}

function populateOpenAICompatSelect(select, models, selectedModel) {
    select.innerHTML = '';
    const freeGroup = document.createElement('optgroup');
    freeGroup.label = 'Free Models';
    const paidGroup = document.createElement('optgroup');
    paidGroup.label = 'Paid Models';

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.id;
        if (isModelFree(model)) {
            freeGroup.appendChild(option);
        } else {
            paidGroup.appendChild(option);
        }
    });

    if (freeGroup.childElementCount > 0) select.appendChild(freeGroup);
    if (paidGroup.childElementCount > 0) select.appendChild(paidGroup);

    if (models.some(m => m.id === selectedModel)) {
        select.value = selectedModel;
    }
}

async function fetchOpenAICompatModels(selectedModel) {
    const baseUrl = document.getElementById('nig-openai-compat-base-url').value.trim();
    const apiKey = document.getElementById('nig-openai-compat-api-key').value.trim();
    
    if (!baseUrl) {
        alert('Please enter a Base URL first.');
        return;
    }

    const select = document.getElementById('nig-openai-compat-model');
    select.innerHTML = '<option>Fetching models...</option>';

    logger.logInfo('NETWORK', `Fetching OpenAI compatible models from ${baseUrl}`);

    GM_xmlhttpRequest({
        method: 'GET',
        url: `${baseUrl}/models`,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        onload: async (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error('Invalid model list format received.');
                }

                let imageModels = [];
                if (data.data.some(m => m.endpoint || m.endpoints)) {
                    imageModels = data.data.filter(model =>
                        model.endpoint === '/v1/images/generations' ||
                        model.endpoints?.includes('/v1/images/generations')
                    );
                } else if (data.data.some(m => m.type === 'images.generations')) {
                    imageModels = data.data.filter(model => model.type === 'images.generations');
                } else {
                    // If no explicit image models found, try to identify them by name patterns
                    imageModels = data.data.filter(model => {
                        const modelId = model.id.toLowerCase();
                        return modelId.includes('dall-e') ||
                               modelId.includes('dalle') ||
                               modelId.includes('image') ||
                               modelId.includes('midjourney') ||
                               modelId.includes('stable diffusion') ||
                               modelId.includes('flux') ||
                               modelId.includes('imagen');
                    });
                }

                imageModels.sort((a, b) => {
                    const aIsFree = isModelFree(a);
                    const bIsFree = isModelFree(b);
                    if (aIsFree && !bIsFree) return -1;
                    if (!aIsFree && bIsFree) return 1;
                    return a.id.localeCompare(b.id);
                });

                if (imageModels.length === 0) {
                    throw new Error('No image generation models found. This provider may not support image generation.');
                }
                
                populateOpenAICompatSelect(select, imageModels, selectedModel);
                
                // Cache the models for this profile
                await cache.setCachedOpenAICompatModels(baseUrl, imageModels);
                logger.logInfo('NETWORK', `Successfully fetched and cached ${imageModels.length} models for ${baseUrl}`);
            } catch (error) {
                logger.logError('NETWORK', 'Failed to parse OpenAI compatible models', { error: error.message });
                select.innerHTML = '<option>Failed to fetch models</option>';
                alert(`Failed to fetch models. Check the Base URL and API Key. You can enter the model name manually. Error: ${error.message}`);
                
                // Switch to manual input mode
                document.getElementById('nig-openai-model-container-select').style.display = 'none';
                document.getElementById('nig-openai-model-container-manual').style.display = 'block';
            }
        },
        onerror: (error) => {
            logger.logError('NETWORK', 'Failed to fetch OpenAI compatible models', { error });
            select.innerHTML = '<option>Failed to fetch models</option>';
            alert('Failed to fetch models. Check your network connection and the Base URL. Switching to manual input.');
            
            // Switch to manual input mode
            document.getElementById('nig-openai-model-container-select').style.display = 'none';
            document.getElementById('nig-openai-model-container-manual').style.display = 'block';
        }
    });
}

async function loadCachedOpenAICompatModels(profileUrl, selectedModel) {
    const select = document.getElementById('nig-openai-compat-model');
    const cachedModels = await cache.getCachedOpenAICompatModels(profileUrl);
    
    if (cachedModels && cachedModels.length > 0) {
        populateOpenAICompatSelect(select, cachedModels, selectedModel);
    } else {
        // No cached models, show fetch prompt
        select.innerHTML = '<option>No cached models. Click Fetch to get models.</option>';
    }
}

async function loadOpenAIProfiles() {
    const select = document.getElementById('nig-openai-compat-profile-select');
    const config = await storage.getConfig();
    const profiles = config.openAICompatProfiles || {};
    const activeUrl = config.openAICompatActiveProfileUrl;
    
    select.innerHTML = '';

    Object.keys(profiles).forEach(url => {
        const option = document.createElement('option');
        option.value = url;
        option.textContent = url;
        select.appendChild(option);
    });

    const newOption = document.createElement('option');
    newOption.value = '__new__';
    newOption.textContent = '— Add or Edit Profile —';
    select.appendChild(newOption);

    if (activeUrl && profiles[activeUrl]) {
        select.value = activeUrl;
    } else {
        select.value = '__new__';
    }
    loadSelectedOpenAIProfile();
}

async function loadSelectedOpenAIProfile() {
    const select = document.getElementById('nig-openai-compat-profile-select');
    const config = await storage.getConfig();
    const profiles = config.openAICompatProfiles || {};
    const selectedUrl = select.value;
    
    if (selectedUrl && profiles[selectedUrl]) {
        const profile = profiles[selectedUrl];
        document.getElementById('nig-openai-compat-base-url').value = selectedUrl;
        document.getElementById('nig-openai-compat-api-key').value = profile.apiKey;
        
        if (config.openAICompatModelManualInput) {
            document.getElementById('nig-openai-compat-model-manual').value = profile.model;
        } else {
            document.getElementById('nig-openai-compat-model').value = profile.model;
            // Load cached models for this profile, if available
            loadCachedOpenAICompatModels(selectedUrl, profile.model);
        }
    } else {
        // New profile mode - clear the model selection
        document.getElementById('nig-openai-compat-base-url').value = '';
        document.getElementById('nig-openai-compat-api-key').value = '';
        document.getElementById('nig-openai-compat-model').innerHTML = '<option>Enter URL/Key and fetch...</option>';
    }
}

async function deleteSelectedOpenAIProfile() {
    const select = document.getElementById('nig-openai-compat-profile-select');
    const selectedUrl = select.value;
    
    if (selectedUrl === '__new__') {
        alert("You can't delete the 'Add New' option.");
        return;
    }

    if (confirm(`Delete profile for "${selectedUrl}"?`)) {
        const config = await storage.getConfig();
        const profiles = config.openAICompatProfiles || {};
        delete profiles[selectedUrl];
        await storage.setConfigValue('openAICompatProfiles', profiles);
        
        // Clear form fields
        document.getElementById('nig-openai-compat-base-url').value = '';
        document.getElementById('nig-openai-compat-api-key').value = '';
        document.getElementById('nig-openai-compat-model').innerHTML = '<option>Enter URL/Key and fetch...</option>';
        document.getElementById('nig-openai-compat-model-manual').value = '';
        
        await loadOpenAIProfiles();
    }
}

async function exportConfig() {
    const config = await storage.getConfig();
    const configData = JSON.stringify(config, null, 2);
    const filename = `wtr-lab-image-generator-config-${new Date().toISOString().split('T')[0]}.json`;
    file.downloadFile(filename, configData, 'application/json');
}

async function handleImportFile(event) {
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

async function populateHistoryTab() {
    const historyList = document.getElementById('nig-history-list');
    const history = await storage.getHistory();
    
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li class="nig-history-empty">No history entries found</li>';
        return;
    }

    history.slice(0, 50).forEach(entry => {
        const li = document.createElement('li');
        li.className = 'nig-history-item';
        const date = new Date(entry.date).toLocaleString();
        li.innerHTML = `
            <div class="nig-history-content">
                <div class="nig-history-image">
                    <img src="${entry.url}" alt="Generated image" loading="lazy">
                </div>
                <div class="nig-history-details">
                    <div class="nig-history-prompt">${entry.prompt}</div>
                    <div class="nig-history-meta">
                        <span class="nig-history-provider">${entry.provider}</span>
                        <span class="nig-history-date">${date}</span>
                    </div>
                </div>
                <div class="nig-history-actions">
                    <button class="nig-history-download" data-url="${entry.url}" data-prompt="${entry.prompt}">
                        <span class="material-symbols-outlined">download</span>
                    </button>
                    <button class="nig-history-delete" data-url="${entry.url}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        `;
        historyList.appendChild(li);
    });

    // Add event listeners for history actions
    historyList.querySelectorAll('.nig-history-download').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.target.closest('button').dataset.url;
            const prompt = e.target.closest('button').dataset.prompt;
            const a = document.createElement('a');
            a.href = url;
            a.download = `wtr-lab-${prompt.substring(0, 20).replace(/\s/g, '_')}.png`;
            a.click();
        });
    });

    historyList.querySelectorAll('.nig-history-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const url = e.target.closest('button').dataset.url;
            if (confirm('Delete this history entry?')) {
                const history = await storage.getHistory();
                const updatedHistory = history.filter(item => item.url !== url);
                await storage.setConfigValue('generationHistory', updatedHistory);
                await populateHistoryTab();
            }
        });
    });
}

async function cleanHistory() {
    const days = parseInt(document.getElementById('nig-history-clean-days').value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const history = await storage.getHistory();
    const updatedHistory = history.filter(entry => new Date(entry.date) > cutoffDate);
    
    if (confirm(`Delete ${history.length - updatedHistory.length} entries older than ${days} days?`)) {
        await storage.setConfigValue('generationHistory', updatedHistory);
        await populateHistoryTab();
        alert('History cleaned successfully!');
    }
}

async function testEnhancement(prompt, config) {
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

// --- EXPORTED FUNCTIONS ---

/**
 * Creates the config panel DOM element and attaches all its internal event listeners.
 */
export function create() {
    if (panelElement) return;

    panelElement = document.createElement('div');
    panelElement.id = 'nig-config-panel';
    panelElement.className = 'nig-modal-overlay';
    panelElement.style.display = 'none';
    panelElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Image Generator Configuration</h2>
            <div class="nig-tabs">
                <div class="nig-tab active" data-tab="config">Configuration</div>
                <div class="nig-tab" data-tab="styling">Prompt Styling</div>
                <div class="nig-tab" data-tab="history">History</div>
                <div class="nig-tab" data-tab="utilities">Utilities</div>
            </div>
            <div id="nig-config-tab" class="nig-tab-content active">
                <div class="nig-config-grid">
                    <div class="nig-config-section">
                        <div class="nig-form-group">
                            <label for="nig-provider">Image Provider</label>
                            <select id="nig-provider">
                                <option value="Pollinations">🌱 Pollinations.ai (Free, Simple)</option>
                                <option value="AIHorde">🤖 AI Horde (Free, Advanced)</option>
                                <option value="OpenAICompat">🔌 OpenAI Compatible (Custom)</option>
                                <option value="Google">🖼️ Google Imagen (Requires Billed Account)</option>
                            </select>
                        </div>
                    </div>

                    <div class="nig-provider-container">
                        <div id="nig-provider-Pollinations" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3>🌱 Pollinations.ai Settings</h3>
                                <p>Fast, simple image generation with advanced model options</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-model">Model</label>
                                <select id="nig-pollinations-model">
                                    <option>Loading models...</option>
                                </select>
                            </div>
                            <div class="nig-form-group-inline">
                                <div>
                                    <label for="nig-pollinations-width">Width</label>
                                    <input type="number" id="nig-pollinations-width" min="64" max="2048" step="64">
                                </div>
                                <div>
                                    <label for="nig-pollinations-height">Height</label>
                                    <input type="number" id="nig-pollinations-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-seed">Seed (optional)</label>
                                <input type="text" id="nig-pollinations-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Options</label>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-pollinations-enhance">Enhance Prompt</label>
                                    <label><input type="checkbox" id="nig-pollinations-safe">Safe Mode (NSFW Filter)</label>
                                    <label><input type="checkbox" id="nig-pollinations-nologo">No Logo (Registered Users)</label>
                                    <label><input type="checkbox" id="nig-pollinations-private">Private (Won't appear in feed)</label>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-token">API Token (Optional)</label>
                                <input type="password" id="nig-pollinations-token" placeholder="Enter token for premium models">
                                <small class="nig-hint">Get a token from <a href="https://auth.pollinations.ai" target="_blank" class="nig-api-prompt-link">auth.pollinations.ai</a> for higher rate limits and access to restricted models.</small>
                            </div>
                        </div>

                        <div id="nig-provider-AIHorde" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3>🤖 AI Horde Settings</h3>
                                <p>Community-powered generation with extensive customization</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-api-key">AI Horde API Key</label>
                                <input type="password" id="nig-horde-api-key" placeholder="Defaults to '0000000000'">
                                <small>Use anonymous key or get your own from <a href="https://aihorde.net/" target="_blank" class="nig-api-prompt-link">AI Horde</a> for higher priority.</small>
                            </div>
                            <div class="nig-provider-controls">
                                <div class="nig-form-group">
                                    <label for="nig-horde-model">Model</label>
                                    <select id="nig-horde-model">
                                        <option>Loading models...</option>
                                    </select>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-sampler">Sampler</label>
                                    <select id="nig-horde-sampler">
                                        <option value="k_dpmpp_2m">DPM++ 2M</option>
                                        <option value="k_euler_a">Euler A</option>
                                        <option value="k_euler">Euler</option>
                                        <option value="k_lms">LMS</option>
                                        <option value="k_heun">Heun</option>
                                        <option value="k_dpm_2">DPM 2</option>
                                        <option value="k_dpm_2_a">DPM 2 A</option>
                                        <option value="k_dpmpp_2s_a">DPM++ 2S A</option>
                                        <option value="k_dpmpp_sde">DPM++ SDE</option>
                                    </select>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-steps">Steps</label>
                                    <input type="number" id="nig-horde-steps" min="10" max="50" step="1">
                                    <small class="nig-hint">More steps = more detail, but slower.</small>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-cfg">CFG Scale</label>
                                    <input type="number" id="nig-horde-cfg" min="1" max="20" step="0.5">
                                    <small class="nig-hint">How strictly to follow the prompt.</small>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-width">Width</label>
                                    <input type="number" id="nig-horde-width" min="64" max="2048" step="64">
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-height">Height</label>
                                    <input type="number" id="nig-horde-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-seed">Seed (optional)</label>
                                <input type="text" id="nig-horde-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Post-Processing</label>
                                <small class="nig-hint">Improves faces. Use only if generating people.</small>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" name="nig-horde-post" value="GFPGAN">GFPGAN</label>
                                    <label><input type="checkbox" name="nig-horde-post" value="CodeFormers">CodeFormers</label>
                                </div>
                            </div>
                        </div>

                        <div id="nig-provider-Google" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3>🖼️ Google Imagen Settings</h3>
                                <p>High-quality generation powered by Google's advanced AI</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-google-api-key">Gemini API Key</label>
                                <input type="password" id="nig-google-api-key">
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-model">Imagen Model</label>
                                <select id="nig-model">
                                    <option value="imagen-4.0-generate-001">Imagen 4.0 Standard</option>
                                    <option value="imagen-4.0-ultra-generate-001">Imagen 4.0 Ultra</option>
                                    <option value="imagen-4.0-fast-generate-001">Imagen 4.0 Fast</option>
                                    <option value="imagen-3.0-generate-002">Imagen 3.0 Standard</option>
                                </select>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-num-images">Number of Images (1-4)</label>
                                <input type="number" id="nig-num-images" min="1" max="4" step="1">
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-image-size">Image Size</label>
                                <select id="nig-image-size">
                                    <option value="1024">1K</option>
                                    <option value="2048">2K</option>
                                </select>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-aspect-ratio">Aspect Ratio</label>
                                <select id="nig-aspect-ratio">
                                    <option value="1:1">1:1</option>
                                    <option value="3:4">3:4</option>
                                    <option value="4:3">4:3</option>
                                    <option value="9:16">9:16</option>
                                    <option value="16:9">16:9</option>
                                </select>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-person-gen">Person Generation</label>
                                <select id="nig-person-gen">
                                    <option value="dont_allow">Don't Allow</option>
                                    <option value="allow_adult">Allow Adults</option>
                                    <option value="allow_all">Allow All</option>
                                </select>
                            </div>
                        </div>

                        <div id="nig-provider-OpenAICompat" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3>🔌 OpenAI Compatible Settings</h3>
                                <p>Connect to any OpenAI-compatible API endpoint</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-profile-select">Saved Profiles</label>
                                <div class="nig-form-group-inline">
                                    <select id="nig-openai-compat-profile-select"></select>
                                    <button id="nig-openai-compat-delete-profile" class="nig-delete-btn">Delete</button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-base-url">Base URL</label>
                                <input type="text" id="nig-openai-compat-base-url" placeholder="e.g., https://api.example.com/v1">
                                <small class="nig-hint">For a list of free public providers, check out the <a href="https://github.com/zukixa/cool-ai-stuff" target="_blank" class="nig-api-prompt-link">cool-ai-stuff</a> repository.</small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-api-key">API Key</label>
                                <input type="password" id="nig-openai-compat-api-key">
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-model">Model</label>
                                <div id="nig-openai-model-container-select">
                                    <div class="nig-form-group-inline">
                                        <select id="nig-openai-compat-model" style="width: 100%;">
                                            <option>Enter URL/Key and fetch...</option>
                                        </select>
                                        <button id="nig-openai-compat-fetch-models" class="nig-fetch-models-btn">Fetch</button>
                                    </div>
                                    <small class=" nig-hint">If fetching fails or your model isn't listed, <a href="#" id="nig-openai-compat-switch-to-manual" class="nig-api-prompt-link">switch to manual input</a>.</small>
                                </div>
                                <div id="nig-openai-model-container-manual" style="display: none;">
                                    <input type="text" id="nig-openai-compat-model-manual" placeholder="e.g., dall-e-3">
                                    <small class=" nig-hint">Manually enter the model name. <a href="#" id="nig-openai-compat-switch-to-select" class="nig-api-prompt-link">Switch back to fetched list</a>.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-styling-tab" class="nig-tab-content">
                <div class="nig-styling-container">
                    <div class="nig-styling-intro">
                        <p>Select a style to automatically add it to the beginning of every prompt. This helps maintain a consistent look across all providers.</p>
                    </div>

                    <div class="nig-style-grid">
                        <div class="nig-style-section">
                            <div class="nig-form-group">
                                <label for="nig-main-style">Main Style</label>
                                <select id="nig-main-style"></select>
                                <small id="nig-main-style-desc" class="nig-hint"></small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-sub-style">Sub-Style</label>
                                <select id="nig-sub-style"></select>
                                <small id="nig-sub-style-desc" class="nig-hint"></small>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>
                                    <span class="material-symbols-outlined">auto_awesome</span>
                                    AI Prompt Enhancement
                                    <span class="nig-enhancement-status" id="nig-enhancement-status">
                                        <span class="nig-status-indicator" id="nig-status-indicator"></span>
                                        <span id="nig-status-text">Enhancement Disabled</span>
                                    </span>
                                </h4>
                            </div>

                            <div class="nig-enhancement-content">
                                <div class="nig-form-group">
                                    <div class="nig-checkbox-group">
                                        <label><input type="checkbox" id="nig-enhancement-enabled">Enable AI Prompt Enhancement</label>
                                    </div>
                                    <small class="nig-hint">Uses AI to automatically enhance prompts for better results. Provider enhancement takes priority when available.</small>
                                </div>

                                <div class="nig-provider-priority-info" id="nig-provider-priority-info" style="display: none;">
                                    <div class="nig-priority-header">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        Provider Enhancement Active
                                    </div>
                                    <p id="nig-priority-message">Pollinations AI enhancement is enabled and will be used instead of external AI enhancement.</p>
                                    <button class="nig-override-btn" id="nig-override-provider">Force Use External AI</button>
                                </div>

                                <div class="nig-enhancement-settings disabled" id="nig-enhancement-settings">
                                    <div class="nig-form-group">
                                        <label for="nig-gemini-api-key">Gemini API Key</label>
                                        <input type="password" id="nig-gemini-api-key" placeholder="Enter your Google Gemini API key">
                                        <small class="nig-hint">Get a free API key from <a href="https://aistudio.google.com/api-keys" target="_blank" class="nig-api-prompt-link">Google AI Studio</a></small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-model">Enhancement Model</label>
                                        <select id="nig-enhancement-model">
                                            <option value="models/gemini-2.5-pro">Gemini 2.5 Pro (High Quality)</option>
                                            <option value="models/gemini-flash-latest">Gemini Flash Latest (Fast)</option>
                                            <option value="models/gemini-flash-lite-latest">Gemini Flash Lite (Ultra Fast)</option>
                                            <option value="models/gemini-2.5-flash">Gemini 2.5 Flash (Balanced)</option>
                                            <option value="models/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Efficient)</option>
                                        </select>
                                        <small class="nig-hint">Choose model based on your needs: quality vs speed</small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-template">Custom Enhancement Template</label>
                                        <textarea id="nig-enhancement-template" rows="3" placeholder="Enter custom enhancement instructions..."></textarea>
                                        <div class="nig-form-group-inline">
                                            <button class="nig-template-btn" id="nig-template-default">Reset to Default</button>
                                            <button class="nig-template-btn" id="nig-template-example">Load Example</button>
                                        </div>
                                        <small class="nig-hint">Customize how the AI enhances prompts. Leave empty for intelligent enhancement.</small>
                                    </div>

                                    <div class="nig-enhancement-preview" id="nig-enhancement-preview" style="display: none;">
                                        <div class="nig-preview-container">
                                            <div class="nig-preview-section">
                                                <h5>Original Prompt</h5>
                                                <div class="nig-prompt-display" id="nig-original-prompt"></div>
                                            </div>
                                            <div class="nig-preview-arrow">
                                                <span class="material-symbols-outlined">arrow_forward</span>
                                            </div>
                                            <div class="nig-preview-section">
                                                <h5>Enhanced Prompt</h5>
                                                <div class="nig-prompt-display" id="nig-enhanced-prompt"></div>
                                            </div>
                                        </div>
                                        <button class="nig-test-enhancement-btn" id="nig-test-enhancement">
                                            <span class="material-symbols-outlined">auto_awesome</span>
                                            Test Enhancement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Custom Style</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-custom-style-enable">Enable Custom Style</label>
                                </div>
                                <small class="nig-hint">Overrides the Main/Sub-style dropdowns with your own text.</small>
                                <textarea id="nig-custom-style-text" placeholder="e.g., In the style of Van Gogh, oil painting, ..."></textarea>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Negative Prompting (Global)</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-enable-neg-prompt">Enable Negative Prompting</label>
                                </div>
                                <small class="nig-hint">This negative prompt will be applied to all providers when enabled.</small>
                                <textarea id="nig-global-neg-prompt" placeholder="e.g., ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-history-tab" class="nig-tab-content">
                <div class="nig-history-container">
                    <div class="nig-history-cleanup">
                        <div class="nig-cleanup-info">
                            <h4>History Management</h4>
                            <p>Clean up old history entries to free up space and improve performance.</p>
                        </div>
                        <div class="nig-cleanup-controls">
                            <label>Delete history older than</label>
                            <input type="number" id="nig-history-clean-days" min="1" max="365" value="30">
                            <label>days</label>
                            <button id="nig-history-clean-btn" class="nig-history-cleanup-btn">
                                <span class="material-symbols-outlined">cleaning_services</span>
                                Clean
                            </button>
                        </div>
                    </div>
                    <ul id="nig-history-list" class="nig-history-list"></ul>
                </div>
            </div>

            <div id="nig-utilities-tab" class="nig-tab-content">
                <div class="nig-utilities-grid">
                    <div class="nig-utility-card">
                        <h4>Import/Export Settings</h4>
                        <p>Backup and restore your configuration settings for seamless setup across different sessions or devices.</p>
                        <div class="nig-form-group">
                            <button id="nig-export-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-primary);">
                                <span class="material-symbols-outlined">download</span>
                                Download Configuration
                            </button>
                            <small class="nig-hint">Downloads the current configuration as a JSON file.</small>
                        </div>
                        <div class="nig-form-group">
                            <label for="nig-import-file">Import Configuration</label>
                            <input type="file" id="nig-import-file" accept=".json" style="border: 2px dashed var(--nig-color-border); background: var(--nig-color-bg-primary);">
                            <small class=" nig-hint">Uploading a JSON file will overwrite all current settings.</small>
                        </div>
                    </div>

                    <div class="nig-utility-card">
                        <h4>Cache Management</h4>
                        <p>Clear cached model lists and force fresh data fetching for accurate, up-to-date information.</p>
                        <button id="nig-clear-cache-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-error);">
                            <span class="material-symbols-outlined">clear_all</span>
                            Clear Cached Models
                        </button>
                        <small class="nig-hint">Removes all cached model lists forcing a fresh fetch.</small>
                    </div>

                    <div class="nig-utility-card">
                        <div class="nig-card-header">
                            <div class="nig-card-title">
                                <h4>Debug Console & Logs</h4>
                                <p>Enable detailed console logging and view enhancement operation logs to troubleshoot issues and monitor system behavior during development.</p>
                            </div>
                        </div>

                        <div class="nig-card-actions">
                            <button id="nig-toggle-logging-btn" class="nig-btn-primary">
                                <span class="material-symbols-outlined">bug_report</span>
                                Toggle Console Logging & Enhancement Logs
                            </button>
                        </div>

                        <div class="nig-card-secondary-actions">
                            <button id="nig-view-enhancement-logs-btn" class="nig-btn-secondary">
                                <span class="material-symbols-outlined">list</span>
                                View Enhancement Logs
                            </button>
                            <button id="nig-clear-enhancement-logs-btn" class="nig-btn-secondary nig-btn-error">
                                <span class="material-symbols-outlined">clear_all</span>
                                Clear Logs
                            </button>
                        </div>

                        <div class="nig-card-footer">
                            <small class="nig-hint">Toggles detailed console logging and provides access to enhancement operation logs.</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="nig-button-footer">
                <button id="nig-save-btn" class="nig-save-btn">Save Configuration</button>
            </div>
        </div>
    `;
    document.body.appendChild(panelElement);

    // --- ATTACH ALL EVENT LISTENERS ---
    panelElement.querySelector('.nig-close-btn').addEventListener('click', () => (panelElement.style.display = 'none'));
    panelElement.querySelector('#nig-save-btn').addEventListener('click', saveConfig);
    
    // Tab functionality
    panelElement.querySelectorAll('.nig-tab').forEach(tab => {
        tab.addEventListener('click', async () => {
            panelElement.querySelectorAll('.nig-tab, .nig-tab-content').forEach(el => el.classList.remove('active'));
            tab.classList.add('active');
            panelElement.querySelector(`#nig-${tab.dataset.tab}-tab`).classList.add('active');
            if (tab.dataset.tab === 'history') {
                await populateHistoryTab();
                panelElement.querySelector('#nig-save-btn').style.display = 'none';
            } else {
                panelElement.querySelector('#nig-save-btn').style.display = 'block';
            }
        });
    });

    // Provider settings
    panelElement.querySelector('#nig-provider').addEventListener('change', updateVisibleSettings);

    // OpenAI Compatible functionality
    panelElement.querySelector('#nig-openai-compat-fetch-models').addEventListener('click', () => fetchOpenAICompatModels());
    panelElement.querySelector('#nig-openai-compat-profile-select').addEventListener('change', loadSelectedOpenAIProfile);
    panelElement.querySelector('#nig-openai-compat-delete-profile').addEventListener('click', deleteSelectedOpenAIProfile);
    panelElement.querySelector('#nig-openai-compat-switch-to-manual').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('nig-openai-model-container-select').style.display = 'none';
        document.getElementById('nig-openai-model-container-manual').style.display = 'block';
    });
    panelElement.querySelector('#nig-openai-compat-switch-to-select').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('nig-openai-model-container-select').style.display = 'block';
        document.getElementById('nig-openai-model-container-manual').style.display = 'none';
    });

    // Utility functions
    panelElement.querySelector('#nig-export-btn').addEventListener('click', exportConfig);
    panelElement.querySelector('#nig-import-file').addEventListener('change', handleImportFile);
    panelElement.querySelector('#nig-history-clean-btn').addEventListener('click', cleanHistory);
    panelElement.querySelector('#nig-clear-cache-btn').addEventListener('click', () => cache.clearCachedModels());

    // Logging functionality
    panelElement.querySelector('#nig-toggle-logging-btn').addEventListener('click', async () => {
        const currentState = await storage.getConfigValue('loggingEnabled');
        const newState = !currentState;
        await storage.setConfigValue('loggingEnabled', newState);
        await logger.updateLoggingStatus();
        await logger.loadEnhancementLogHistory();
        alert(`Debug Console & Enhancement Logs are now ${newState ? 'ENABLED' : 'DISABLED'}.`);
    });

    panelElement.querySelector('#nig-view-enhancement-logs-btn').addEventListener('click', async () => {
        const logs = await logger.getEnhancementLogHistory();
        if (logs.length === 0) {
            alert('No enhancement logs found. Enhancement logging is disabled or no enhancement operations have been performed yet.');
            return;
        }
        // Create logs modal
        const logModal = document.createElement('div');
        logModal.className = 'nig-modal-overlay';
        logModal.innerHTML = `
            <div class="nig-modal-content">
                <span class="nig-close-btn">&times;</span>
                <h2>Enhancement Operation Logs</h2>
                <p>Detailed logs of prompt enhancement operations with timestamps and performance data.</p>
                <div style="max-height: 400px; overflow-y: auto; background: var(--nig-color-bg-tertiary); border-radius: var(--nig-radius-md); padding: var(--nig-space-lg); margin: var(--nig-space-lg) 0;">
                    <div id="nig-enhancement-logs-display"></div>
                </div>
            </div>
        `;
        document.body.appendChild(logModal);

        const logsDisplay = logModal.querySelector('#nig-enhancement-logs-display');
        logs.slice(0, 50).forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = 'padding: var(--nig-space-sm) 0; border-bottom: 1px solid var(--nig-color-border); font-family: monospace; font-size: var(--nig-font-size-xs);';
            logEntry.innerHTML = `<div>[${log.level}] ${log.time} [${log.category}] ${log.message}</div>`;
            logsDisplay.appendChild(logEntry);
        });

        logModal.querySelector('.nig-close-btn').addEventListener('click', () => logModal.remove());
    });

    panelElement.querySelector('#nig-clear-enhancement-logs-btn').addEventListener('click', async () => {
        const logs = await logger.getEnhancementLogHistory();
        if (logs.length === 0) {
            alert('No enhancement logs to clear.');
            return;
        }
        if (confirm(`Are you sure you want to clear all ${logs.length} enhancement logs? This action cannot be undone.`)) {
            logger.clearEnhancementLogs();
            alert('All enhancement logs have been cleared.');
        }
    });

    // Style functionality
    panelElement.querySelector('#nig-main-style').addEventListener('change', (e) => updateSubStyles(e.target.value));
    panelElement.querySelector('#nig-sub-style').addEventListener('change', () => {
        const subStyle = panelElement.querySelector('#nig-sub-style').value;
        const subStyleDesc = document.getElementById('nig-sub-style-desc');
        const selectedCategory = PROMPT_CATEGORIES.find(cat => cat.name === panelElement.querySelector('#nig-main-style').value);
        const selectedSubStyle = selectedCategory ? selectedCategory.subStyles.find(sub => sub.value === subStyle) : null;
        subStyleDesc.textContent = selectedSubStyle ? selectedSubStyle.description : '';
    });

    // Custom style toggle
    const customStyleEnable = panelElement.querySelector('#nig-custom-style-enable');
    const customStyleText = panelElement.querySelector('#nig-custom-style-text');
    customStyleEnable.addEventListener('change', () => {
        customStyleText.disabled = !customStyleEnable.checked;
    });

    // Enhancement functionality
    const enhancementEnabled = panelElement.querySelector('#nig-enhancement-enabled');
    const enhancementSettings = panelElement.querySelector('#nig-enhancement-settings');
    const overrideProviderBtn = panelElement.querySelector('#nig-override-provider');
    const templateDefaultBtn = panelElement.querySelector('#nig-template-default');
    const templateExampleBtn = panelElement.querySelector('#nig-template-example');
    const testEnhancementBtn = panelElement.querySelector('#nig-test-enhancement');
    const geminiApiKeyInput = panelElement.querySelector('#nig-gemini-api-key');

    enhancementEnabled.addEventListener('change', async (e) => {
        const newState = e.target.checked;
        const config = await storage.getConfig();
        config.enhancementEnabled = newState;
        await storage.setConfigValue('enhancementEnabled', newState);
        toggleEnhancementSettings(newState);
        const provider = document.getElementById('nig-provider').value;
        updateEnhancementUI(provider, config);
    });

    overrideProviderBtn.addEventListener('click', async () => {
        const provider = document.getElementById('nig-provider').value;
        await storage.setConfigValue('enhancementOverrideProvider', true);
        const config = await storage.getConfig();
        updateEnhancementUI(provider, config);
    });

    templateDefaultBtn.addEventListener('click', async () => {
        const defaultTemplate = 'Convert this text into a focused visual description for image generation. Extract key visual elements (characters, setting, mood, style) and describe them as a direct prompt without narrative elements, dialogue, or markdown formatting. Keep it concise and focused on what can be visually rendered. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
        panelElement.querySelector('#nig-enhancement-template').value = defaultTemplate;
        await storage.setConfigValue('enhancementTemplate', defaultTemplate);
    });

    templateExampleBtn.addEventListener('click', async () => {
        const exampleTemplate = 'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
        panelElement.querySelector('#nig-enhancement-template').value = exampleTemplate;
        await storage.setConfigValue('enhancementTemplate', exampleTemplate);
    });

    geminiApiKeyInput.addEventListener('input', async (e) => {
        const hasApiKey = e.target.value.trim().length > 0;
        if (hasApiKey) {
            panelElement.querySelector('#nig-enhancement-preview').style.display = 'block';
        } else {
            panelElement.querySelector('#nig-enhancement-preview').style.display = 'none';
        }
    });

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

    // Provider change listener for enhancement UI
    panelElement.querySelector('#nig-provider').addEventListener('change', async (e) => {
        const newProvider = e.target.value;
        const config = await storage.getConfig();
        updateEnhancementUI(newProvider, config);
    });
}

/**
 * Shows the config panel, populating it with the latest data from storage.
 */
export async function show() {
    if (!panelElement) create();

    // Reset to the main config tab
    panelElement.querySelectorAll('.nig-tab, .nig-tab-content').forEach(el => el.classList.remove('active'));
    panelElement.querySelector('.nig-tab[data-tab="config"]').classList.add('active');
    panelElement.querySelector('#nig-config-tab').classList.add('active');
    panelElement.querySelector('#nig-save-btn').style.display = 'block';

    await populateConfigForm();
    panelElement.style.display = 'flex';
}

/**
 * Initializes the config panel with callbacks from the main application.
 */
export function initialize(callbacks = {}) {
    initializeCallbacks = callbacks;
}