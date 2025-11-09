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

    const reasonContainer = document.getElementById('nig-error-reason');
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

    // Defensive normalization for backward compatibility and robustness
    const reason = (errorDetails && errorDetails.reason) ? errorDetails.reason : {};
    const baseMessage = (typeof reason.message === 'string' && reason.message.trim().length > 0)
        ? reason.message.trim()
        : 'An unknown error occurred during image generation. Please review your configuration and try again.';

    const errorType = reason.errorType || null;

    // Build a single coherent Reason block with structured guidance
    const reasonParts = [];

    // Always start with the base parsed message
    reasonParts.push(baseMessage);

    // Append structured guidance based on errorType while avoiding duplication
    if (errorType === 'authentication') {
        reasonParts.push(
            'Authentication Issue: Please check your API key configuration for this OpenAI-compatible provider. Ensure the key is valid, correctly scoped, and not expired before retrying.'
        );
    } else if (errorType === 'api_key_validation') {
        reasonParts.push(
            'API Key Validation Issue: For AIHorde or the relevant provider, verify that your API key is correctly configured and that you have completed any required registration. You may try a different provider or update your API key in settings.'
        );
    } else if (errorType === 'model_access') {
        // Avoid repeating essentially the same provider/tier guidance text; keep this concise and generic.
        if (!baseMessage.toLowerCase().includes('model') &&
            !baseMessage.toLowerCase().includes('plan') &&
            !baseMessage.toLowerCase().includes('tier') &&
            !baseMessage.toLowerCase().includes('subscription')) {
            reasonParts.push(
                'Model Access Restriction: The selected model is not available for your current plan. Switch to a supported model or upgrade your account according to your provider’s tier documentation.'
            );
        }
    } else if (errorType === 'image_conversion') {
        reasonParts.push(
            'Image Conversion Issue: The provider returned image data that could not be converted. This is often a temporary provider issue. You can try again or switch to a different provider.'
        );
    } else if (errorType === 'ip_mismatch') {
        const discordLink = reason.discordLink || 'https://discord.gg/zukijourney';
        const resetipCommand = reason.resetipCommand || '/user resetip';
        reasonParts.push(
            'IP Address Mismatch: Your current IP does not match the one registered to your account. ' +
            'To resolve this, join the provider’s Discord server at ' + discordLink +
            ', run the command "' + resetipCommand + '", or upgrade to a plan that supports multiple IPs. ' +
            'You can retry generation after the IP lock is reset.'
        );
    } else if (errorType === 'html_response') {
        reasonParts.push(
            'Endpoint Configuration Issue: The API endpoint returned HTML instead of JSON. This usually indicates an incorrect endpoint URL, an authentication problem, or an endpoint that does not support the requested operation. ' +
            'Check your OpenAI-compatible provider Base URL, path, and API key configuration.'
        );
    } else if (errorType === 'malformed_json') {
        reasonParts.push(
            'Server Response Issue: The API returned malformed or invalid JSON data. This is typically a temporary server-side issue. ' +
            'You can try again later or switch to another provider if the problem persists.'
        );
    } else if (errorType === 'json_parse_error') {
        reasonParts.push(
            'JSON Parsing Error: The response from the provider could not be parsed. This may indicate an intermittent server issue or unexpected response format. ' +
            'You can retry the request or use a different provider.'
        );
    }

    // In case multiple signals exist, ensure uniqueness and readability
    const uniqueReasonParts = Array.from(new Set(reasonParts.filter(Boolean)));
    reasonContainer.innerHTML = uniqueReasonParts
        .map(part => `<p>${part}</p>`)
        .join('');

    // Reset prompt text
    promptTextarea.value = errorDetails && typeof errorDetails.prompt === 'string'
        ? errorDetails.prompt
        : (errorDetails && errorDetails.prompt !== undefined
            ? String(errorDetails.prompt)
            : '');

    const actionsContainer = document.getElementById('nig-error-actions');
    actionsContainer.innerHTML = '';

    // Check if this is a non-retryable error (authentication errors or explicitly marked as non-retryable)
    const isNonRetryableError =
        !!reason.isNonRetryable ||
        errorType === 'authentication' ||
        (!reason.retryable && !errorType);

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
        let provider;
        let providerProfileUrl;
        if (selectedProviderValue && selectedProviderValue.startsWith('OpenAICompat::')) {
            provider = 'OpenAICompat';
            providerProfileUrl = selectedProviderValue.split('::')[1] || null;
        } else {
            provider = selectedProviderValue || errorDetails.provider || null;
            providerProfileUrl = null;
        }

        try {
            retryCallback(editedPrompt, provider, providerProfileUrl);
        } catch (e) {
            // Fail gracefully without breaking the modal
            logger.logError('ERROR_MODAL', 'Retry callback threw an error', { error: e && e.message });
        }
        hide();
    };

    // Handle retry button visibility based on error type
    if (!isNonRetryableError) {
        if (reason.retryable) {
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

    modalElement.style.display = 'flex';
}