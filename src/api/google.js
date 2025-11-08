import { getConfig } from '../utils/storage.js';
import { getApiReadyPrompt } from '../utils/promptUtils.js';

/**
 * Generates an image using the Google Imagen API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess and onFailure callbacks.
 */
export async function generate(prompt, { onSuccess, onFailure }) {
    const config = await getConfig();
    const { model, googleApiKey, numberOfImages, aspectRatio, personGeneration, imageSize } = config;

    // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
    const cleanPrompt = getApiReadyPrompt(prompt, 'google_api');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;
    const parameters = {
        sampleCount: parseInt(numberOfImages, 10),
        aspectRatio,
        personGeneration,
    };
    if (!model.includes('fast')) {
        parameters.imageSize = parseInt(imageSize, 10);
    }

    GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: { 'x-goog-api-key': googleApiKey, 'Content-Type': 'application/json' },
        data: JSON.stringify({ instances: [{ prompt: cleanPrompt }], parameters }),
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (data.error) throw new Error(JSON.stringify(data.error));
                const imageUrls = data.predictions.map(p => `data:image/png;base64,${p.bytesB64Encoded}`);
                onSuccess(imageUrls, prompt, 'Google', model);
            } catch (e) {
                onFailure(e.message, prompt, 'Google');
            }
        },
        onerror: (error) => onFailure(JSON.stringify(error), prompt, 'Google'),
    });
}