import { setConfigValue } from '../utils/storage.js';

let promptElement = null;

/**
 * Shows a modal prompting the user for their Google API key.
 */
export function show() {
    if (document.getElementById('nig-google-api-prompt')) return;

    promptElement = document.createElement('div');
    promptElement.id = 'nig-google-api-prompt';
    promptElement.className = 'nig-modal-overlay';
    promptElement.innerHTML = `
        <div class="nig-modal-content">
            <span class="nig-close-btn">&times;</span>
            <h2>Google API Key Required</h2>
            <p>Please provide your Google AI Gemini API key. You can get one from <a href="https://aistudio.google.com/api-keys" target="_blank" class="nig-api-prompt-link">Google AI Studio</a>.</p>
            <div class="nig-form-group">
                <label for="nig-prompt-api-key">Gemini API Key</label>
                <input type="password" id="nig-prompt-api-key">
            </div>
            <button id="nig-prompt-save-btn" class="nig-save-btn">Save Key</button>
        </div>`;
    document.body.appendChild(promptElement);

    const close = () => promptElement.remove();

    promptElement.querySelector('.nig-close-btn').addEventListener('click', close);
    promptElement.querySelector('#nig-prompt-save-btn').addEventListener('click', async () => {
        const key = promptElement.querySelector('#nig-prompt-api-key').value.trim();
        if (key) {
            await setConfigValue('googleApiKey', key);
            alert('API Key saved. You can now generate an image.');
            close();
        } else {
            alert('API Key cannot be empty.');
        }
    });
}