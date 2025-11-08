import { getConfig } from '../utils/storage.js';
import * as logger from '../utils/logger.js';

let modalElement = null;
let retryCallback = () => {};
let dismissCallback = () => {};

/**
 * Initializes the error modal with callbacks for retry and dismiss actions.
 * @param {object} callbacks - An object containing the retry and dismiss functions.
 * @param {function} callbacks.onRetry - Function to call when the user clicks retry.
 * @param {function} callbacks.onDismiss - Function to call when the user dismisses the modal.
 */
export function init({ onRetry, onDismiss }) {
    retryCallback = onRetry;
    dismissCallback = onDismiss;
}

/**
 * Creates the error modal DOM element and appends it to the body.
 */
export function create() {
    if (modalElement) return;

    modalElement = document.createElement('div');
    modalElement.id = 'nig-error-modal';
    modalElement.className = 'nig-modal-overlay';
    modalElement.style.display = 'none';
    modalElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Generation Failed</h2>
            <p>The image could not be generated. Please review the reason below and adjust your prompt if necessary.</p>
            <p><strong>Reason:</strong></p>
            <div id="nig-error-reason"></div>
            <p><strong>Your Prompt:</strong></p>
            <textarea id="nig-error-prompt" class="nig-error-prompt"></textarea>
            <div class="nig-form-group" style="margin-top: 15px;">
                <label for="nig-retry-provider-select">Retry with Provider:</label>
                <select id="nig-retry-provider-select"></select>
            </div>
            <div id="nig-error-actions" class="nig-error-actions"></div>
        </div>`;
    document.body.appendChild(modalElement);

    modalElement.querySelector('.nig-close-btn').addEventListener('click', () => hide());
}

/**
 * Hides the error modal and calls the dismiss callback.
 */
export function hide() {
    if (modalElement) {
        modalElement.style.display = 'none';
    }
    
    // Call the dismiss callback if provided
    if (typeof dismissCallback === 'function') {
        dismissCallback();
    }
}

/**
 * Shows and populates the error modal with details from a failed generation.
 * @param {object} errorDetails - The details of the error.
 */
export async function show(errorDetails) {
    if (!modalElement) create();

    document.getElementById('nig-error-reason').textContent = errorDetails.reason.message;
    const promptTextarea = document.getElementById('nig-error-prompt');
    promptTextarea.value = errorDetails.prompt;

    const providerSelect = document.getElementById('nig-retry-provider-select');
    providerSelect.innerHTML = '';
    const config = await getConfig();
    const providers = ['Pollinations', 'AIHorde', 'Google'];
    providers.forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.textContent = p;
        providerSelect.appendChild(option);
    });
    Object.keys(config.openAICompatProfiles).forEach(url => {
        const option = document.createElement('option');
        option.value = `OpenAICompat::${url}`;
        option.textContent = `OpenAI: ${url.replace('https://', '').split('/')[0]}`;
        providerSelect.appendChild(option);
    });

    let failedProviderValue = errorDetails.provider;
    if (errorDetails.provider === 'OpenAICompat' && errorDetails.providerProfileUrl) {
        failedProviderValue = `OpenAICompat::${errorDetails.providerProfileUrl}`;
    }
    if (Array.from(providerSelect.options).some(opt => opt.value === failedProviderValue)) {
        providerSelect.value = failedProviderValue;
    }

    const actionsContainer = document.getElementById('nig-error-actions');
    actionsContainer.innerHTML = '';

    // Check if this is a non-retryable error (authentication errors or explicitly marked as non-retryable)
    const isNonRetryableError = errorDetails.reason.isNonRetryable ||
                               errorDetails.reason.errorType === 'authentication' ||
                               (!errorDetails.reason.retryable && !errorDetails.reason.errorType);

    // Create retry button
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry Generation';
    retryBtn.className = 'nig-retry-btn';
    retryBtn.onclick = () => {
        const editedPrompt = promptTextarea.value.trim();
        if (!editedPrompt) {
            alert('Prompt cannot be empty.');
            return;
        }
        
        const selectedProviderValue = providerSelect.value;
        let provider, providerProfileUrl;
        if (selectedProviderValue.startsWith('OpenAICompat::')) {
            provider = 'OpenAICompat';
            providerProfileUrl = selectedProviderValue.split('::')[1];
        } else {
            provider = selectedProviderValue;
            providerProfileUrl = null;
        }
        
        retryCallback(editedPrompt, provider, providerProfileUrl);
        hide();
    };

    // Handle retry button visibility based on error type
    if (!isNonRetryableError) {
        if (errorDetails.reason.retryable) {
            // Show retry button immediately for retryable errors
            actionsContainer.appendChild(retryBtn);
        } else {
            // For non-retryable errors, only show retry if user modifies prompt or changes provider
            const showRetryButton = () => {
                if (!actionsContainer.contains(retryBtn)) {
                    actionsContainer.appendChild(retryBtn);
                }
            };
            promptTextarea.oninput = showRetryButton;
            providerSelect.onchange = showRetryButton;
        }
    }

    // Add specific messaging for authentication errors
    if (errorDetails.reason.errorType === 'authentication') {
        const authWarning = document.createElement('div');
        authWarning.className = 'nig-auth-warning';
        authWarning.style.cssText = 'color: #d63384; background-color: #f8d7da; border: 1px solid #f5c2c7; padding: 10px; border-radius: 4px; margin-top: 10px;';
        authWarning.innerHTML = '<strong>Authentication Issue:</strong> Please check your API key configuration in the settings before retrying.';
        actionsContainer.appendChild(authWarning);
    }

    // Add specific messaging for API key validation errors
    if (errorDetails.reason.errorType === 'api_key_validation') {
        const apiKeyWarning = document.createElement('div');
        apiKeyWarning.className = 'nig-api-key-warning';
        apiKeyWarning.style.cssText = 'color: #856404; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-top: 10px;';
        apiKeyWarning.innerHTML = '<strong>API Key Issue:</strong> Please check your API key configuration and ensure you have registered with the provider. You can try a different provider or update your API key in settings.';
        actionsContainer.appendChild(apiKeyWarning);
    }

    // Add specific messaging for image conversion errors
    if (errorDetails.reason.errorType === 'image_conversion') {
        const conversionInfo = document.createElement('div');
        conversionInfo.className = 'nig-conversion-info';
        conversionInfo.style.cssText = 'color: #0c5460; background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 4px; margin-top: 10px;';
        conversionInfo.innerHTML = '<strong>Image Conversion Issue:</strong> This may be a temporary problem with the provider. You can try again or use a different provider.';
        actionsContainer.appendChild(conversionInfo);
    }
    // Add specific messaging for IP mismatch errors
    if (errorDetails.reason.errorType === 'ip_mismatch') {
        const ipWarning = document.createElement('div');
        ipWarning.className = 'nig-ip-warning';
        ipWarning.style.cssText = 'color: #856404; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-top: 10px;';
        const discordLink = errorDetails.reason.discordLink || 'https://discord.gg/zukijourney';
        const resetipCommand = errorDetails.reason.resetipCommand || '/user resetip';
        ipWarning.innerHTML = '<strong>IP Address Mismatch:</strong> Your current IP address doesn\'t match the one registered to your account.<br><br><strong>To resolve this:</strong><br>• Join the Discord server: <a href="' + discordLink + '" target="_blank" rel="noopener noreferrer" style="color: #856404; text-decoration: underline;">' + discordLink + '</a><br>• Use the command: <code style="background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: monospace;">' + resetipCommand + '</code><br>• Or upgrade to premium for multi-IP support<br><br><em>You can retry this generation after resetting your IP lock.</em>';
        actionsContainer.appendChild(ipWarning);
    }

    // Add specific messaging for HTML response errors
    if (errorDetails.reason.errorType === 'html_response') {
        const htmlWarning = document.createElement('div');
        htmlWarning.className = 'nig-html-warning';
        htmlWarning.style.cssText = 'color: #dc3545; background-color: #f8d7da; border: 1px solid #f5c2c7; padding: 10px; border-radius: 4px; margin-top: 10px;';
        htmlWarning.innerHTML = '<strong>Endpoint Configuration Issue:</strong> The API endpoint returned HTML instead of JSON, which usually indicates:<br>• Invalid or incorrect endpoint URL<br>• Authentication problems<br>• Endpoint not supporting image generation<br><br>Please check your OpenAI-compatible provider configuration in settings.';
        actionsContainer.appendChild(htmlWarning);
    }

    // Add specific messaging for malformed JSON errors
    if (errorDetails.reason.errorType === 'malformed_json') {
        const jsonWarning = document.createElement('div');
        jsonWarning.className = 'nig-json-warning';
        jsonWarning.style.cssText = 'color: #856404; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-top: 10px;';
        jsonWarning.innerHTML = '<strong>Server Response Issue:</strong> The API returned malformed JSON data. This is typically a temporary server issue with the provider. You can try again or use a different provider.';
        actionsContainer.appendChild(jsonWarning);
    }

    // Add specific messaging for generic JSON parse errors
    if (errorDetails.reason.errorType === 'json_parse_error') {
        const parseWarning = document.createElement('div');
        parseWarning.className = 'nig-parse-warning';
        parseWarning.style.cssText = 'color: #0c5460; background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 10px; border-radius: 4px; margin-top: 10px;';
        parseWarning.innerHTML = '<strong>JSON Parsing Error:</strong> Unable to parse the API response. This may be a temporary issue with the provider. You can try again or switch to a different provider.';
        actionsContainer.appendChild(parseWarning);
    }

    modalElement.style.display = 'flex';
}