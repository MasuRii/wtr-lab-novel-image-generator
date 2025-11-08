import { setConfigValue } from '../utils/storage.js';

let promptElement = null;

/**
 * Shows a modal for Pollinations.ai authentication.
 * @param {string} errorMessage - The error message from the API.
 * @param {string} failedPrompt - The prompt that failed.
 * @param {function} onRetry - The callback function to execute on retry.
 */
export function show(errorMessage, failedPrompt, onRetry) {
    if (document.getElementById('nig-pollinations-auth-prompt')) return;

    promptElement = document.createElement('div');
    promptElement.id = 'nig-pollinations-auth-prompt';
    promptElement.className = 'nig-modal-overlay';
    promptElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Authentication Required</h2>
            <p>The Pollinations.ai model you selected requires authentication. You can get free access by registering.</p>
            <p><strong>Error Message:</strong> <em>${errorMessage}</em></p>
            <p>Please visit <a href="https://auth.pollinations.ai" target="_blank" class="nig-api-prompt-link">auth.pollinations.ai</a> to continue. You can either:</p>
            <ul>
                <li><strong>Register the Referrer:</strong> The easiest method. Just register the domain <code>wtr-lab.com</code>. This links your usage to your account without needing a token.</li>
                <li><strong>Use a Token:</strong> Get an API token and enter it below.</li>
            </ul>
            <div class="nig-form-group">
                <label for="nig-prompt-pollinations-token">Pollinations API Token</label>
                <input type="password" id="nig-prompt-pollinations-token">
            </div>
            <button id="nig-prompt-save-token-btn" class="nig-save-btn">Save Token & Retry</button>
        </div>`;
    document.body.appendChild(promptElement);

    const close = () => promptElement.remove();

    promptElement.querySelector('.nig-close-btn').addEventListener('click', close);
    promptElement.querySelector('#nig-prompt-save-token-btn').addEventListener('click', async () => {
        const token = promptElement.querySelector('#nig-prompt-pollinations-token').value.trim();
        if (token) {
            await setConfigValue('pollinationsToken', token);
            promptElement.remove();
            alert('Token saved. Retrying generation...');
            onRetry(failedPrompt, 'Pollinations');
        } else {
            alert('Token cannot be empty.');
        }
    });
}