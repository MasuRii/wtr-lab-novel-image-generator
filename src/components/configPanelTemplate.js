// --- PUBLIC FUNCTIONS ---

/**
 * Gets the complete HTML template for the configuration panel
 */
export function getConfigPanelHTML() {
    return `
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
                                <option value="Pollinations">Pollinations.ai (Free, Simple)</option>
                                <option value="AIHorde">AI Horde (Free, Advanced)</option>
                                <option value="OpenAICompat">OpenAI Compatible (Custom)</option>
                                <option value="Google">Google Imagen (Requires Billed Account)</option>
                            </select>
                        </div>
                    </div>

                    <div class="nig-provider-container">
                        <div id="nig-provider-Pollinations" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3>Pollinations.ai Settings</h3>
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
                                <h3>AI Horde Settings</h3>
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
                                <h3>Google Imagen Settings</h3>
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
                                <h3>OpenAI Compatible Settings</h3>
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
                                        <label for="nig-enhancement-template">Custom Enhancement Prompt</label>
                                        <div class="nig-enhancement-template-section">
                                            <div class="nig-form-group">
                                                <label for="nig-enhancement-template-select">Enhancement Template</label>
                                                <select id="nig-enhancement-template-select">
                                                    <option value="standard">Standard Enhancement - Default enhancement that improves prompt quality</option>
                                                    <option value="safety">Safety Enhancement - Enhances prompts while removing harmful content</option>
                                                    <option value="artistic">Artistic Enhancement - Focuses on artistic and creative elements</option>
                                                    <option value="technical">Technical Enhancement - Emphasizes technical accuracy and detail</option>
                                                    <option value="character">Character Enhancement - Focuses on character development</option>
                                                    <option value="environment">Environment Enhancement - Enhances environmental descriptions</option>
                                                    <option value="composition">Composition Enhancement - Focuses on composition and visual structure</option>
                                                    <option value="clean">Clean Enhancement - Removes potentially harmful elements</option>
                                                    <option value="custom">Custom Enhancement Prompt</option>
                                                </select>
                                                <small class="nig-hint">Choose a preset enhancement prompt or select 'Custom' to create your own. Preset prompts include safety features to remove harmful content.</small>
                                            </div>
                                            <textarea id="nig-enhancement-template" rows="3" placeholder="Enter custom enhancement instructions..."></textarea>
                                            <div class="nig-form-group-inline">
                                                <button class="nig-template-btn" id="nig-template-reset">Reset to Preset</button>
                                                <button class="nig-template-btn" id="nig-template-example">Load Example</button>
                                            </div>
                                            <small class="nig-hint">Customize how the AI enhances prompts. Leave empty for intelligent enhancement.</small>
                                        </div>
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
}

/**
 * Creates the panel element with the template
 */
export function createPanelElement() {
    const panelElement = document.createElement('div');
    panelElement.id = 'nig-config-panel';
    panelElement.className = 'nig-modal-overlay';
    panelElement.style.display = 'none';
    panelElement.innerHTML = getConfigPanelHTML();
    
    return panelElement;
}