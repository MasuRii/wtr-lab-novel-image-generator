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

    if (errorDetails.reason.retryable) {
        actionsContainer.appendChild(retryBtn);
    } else {
        const showRetryButton = () => {
            if (!actionsContainer.contains(retryBtn)) {
                actionsContainer.appendChild(retryBtn);
            }
        };
        promptTextarea.oninput = showRetryButton;
        providerSelect.onchange = showRetryButton;
    }

    modalElement.style.display = 'flex';
}