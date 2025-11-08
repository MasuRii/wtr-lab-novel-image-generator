// --- IMPORTS ---
import { 
    updateVisibleSettings, 
    updateSubStyles, 
    populateConfigForm, 
    saveConfig as saveConfigToStorage, 
    exportConfig, 
    handleImportFile 
} from '../config/configManager.js';
import { populateHistoryTab } from './historyManager.js';
import { 
    toggleEnhancementSettings, 
    updateEnhancementUI, 
    populateEnhancementSettings, 
    saveEnhancementConfig,
    setupEnhancementEventListeners
} from './enhancementPanel.js';
import {
    setupTabEventListeners,
    setupProviderEventListeners,
    setupOpenAIEventListeners,
    setupUtilityEventListeners,
    setupLoggingEventListeners,
    setupStyleEventListeners,
    setupCustomStyleEventListeners,
    setupProviderEnhancementListener
} from './configPanelEvents.js';
import { 
    createPanelElement,
    getConfigPanelHTML 
} from './configPanelTemplate.js';
import {
    saveProviderConfigs,
    populateProviderForms
} from '../api/models.js';
import * as storage from '../utils/storage.js';

// --- MODULE STATE ---
let panelElement = null;
let initializeCallbacks = {};

// --- EXPORTED FUNCTIONS ---

/**
 * Creates the config panel DOM element and attaches all its internal event listeners.
 */
export function create() {
    if (panelElement) return;

    // Create the panel using the template module
    panelElement = createPanelElement();
    document.body.appendChild(panelElement);

    // --- ATTACH ALL EVENT LISTENERS ---
    
    // Basic panel functionality
    panelElement.querySelector('.nig-close-btn').addEventListener('click', () => (panelElement.style.display = 'none'));
    panelElement.querySelector('#nig-save-btn').addEventListener('click', saveConfig);
    
    // Set up all event listener groups
    setupTabEventListeners(panelElement);
    setupProviderEventListeners(panelElement);
    setupOpenAIEventListeners(panelElement);
    setupUtilityEventListeners(panelElement);
    setupLoggingEventListeners(panelElement);
    setupStyleEventListeners(panelElement);
    setupCustomStyleEventListeners(panelElement);
    setupProviderEnhancementListener(panelElement);
    
    // Set up enhancement event listeners
    setupEnhancementEventListeners(panelElement);
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

    // Populate all form sections
    const config = await storage.getConfig();
    
    // Populate basic configuration
    await populateConfigForm();
    
    // Populate provider-specific forms
    await populateProviderForms(config);
    
    // Populate enhancement settings
    await populateEnhancementSettings(config);
    
    panelElement.style.display = 'flex';
}

/**
 * Initializes the config panel with callbacks from the main application.
 */
export function initialize(callbacks = {}) {
    initializeCallbacks = callbacks;
}

/**
 * Enhanced save configuration that coordinates saving across all modules
 */
export async function saveConfig() {
    // Save basic configuration
    await saveConfigToStorage();
    
    // Save enhancement configuration
    await saveEnhancementConfig();
    
    // Save provider-specific configurations
    await saveProviderConfigs();
    
    // Trigger any initialization callbacks
    if (initializeCallbacks.onConfigSaved) {
        initializeCallbacks.onConfigSaved();
    }
    
    alert('Configuration saved!');
}