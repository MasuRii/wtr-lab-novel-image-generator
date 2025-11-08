import { getConfig } from '../utils/storage.js';
import { clearCachedModels } from '../utils/cache.js';
import { getApiReadyPrompt } from '../utils/promptUtils.js';

/**
 * Generates an image using the Pollinations.ai API.
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess, onFailure, and onAuthFailure callbacks.
 */
export async function generate(prompt, { onSuccess, onFailure, onAuthFailure }) {
    const config = await getConfig();
    const {
        pollinationsModel: model,
        pollinationsToken,
        pollinationsWidth,
        pollinationsHeight,
        pollinationsSeed,
        pollinationsEnhance,
        pollinationsSafe,
        pollinationsNologo,
        pollinationsPrivate,
    } = config;

    // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
    const cleanPrompt = getApiReadyPrompt(prompt, 'pollinations_api');

    // Use the configured model (includes kontext which can do text-to-image)
    const finalModel = model || 'flux';
    
    // Debug logging to track model configuration
    console.log('[NIG-DEBUG] [POLLINATIONS] Model configuration:', {
        originalModel: model,
        finalModel: finalModel
    });

    const params = new URLSearchParams();
    if (pollinationsToken) params.append('token', pollinationsToken);
    if (finalModel && finalModel !== 'flux') params.append('model', finalModel);
    if (pollinationsWidth && pollinationsWidth > 0) params.append('width', pollinationsWidth);
    if (pollinationsHeight && pollinationsHeight > 0) params.append('height', pollinationsHeight);
    if (pollinationsSeed) params.append('seed', pollinationsSeed);
    if (pollinationsEnhance) params.append('enhance', 'true');
    if (pollinationsSafe) params.append('safe', 'true');
    if (pollinationsNologo) params.append('nologo', 'true');
    if (pollinationsPrivate) params.append('private', 'true');

    const paramString = params.toString();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}${paramString ? '?' + paramString : ''}`;

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        },
        onload: async (response) => {
            if (response.status >= 200 && response.status < 300) {
                const blobUrl = URL.createObjectURL(response.response);
                onSuccess([blobUrl], prompt, 'Pollinations', finalModel, [url]);
            } else {
                const text = await response.response.text();
                if (text.toLowerCase().includes('model not found')) {
                    onFailure(`Model error: ${text}. Refreshing model list.`, prompt, 'Pollinations', finalModel);
                    clearCachedModels('pollinations');
                    return;
                }
                
                // Check for authentication requirements in any status code
                // kontext model returns 500 status codes when auth is required
                // gptimage model returns 403 status codes when auth is required
                if ((response.status === 403 && text.includes('auth.pollinations.ai')) ||
                    (text.toLowerCase().includes('authentication') && text.toLowerCase().includes('auth.pollinations.ai'))) {
                    try {
                        const errorData = JSON.parse(text);
                        onAuthFailure(errorData.message || errorData.error || text, prompt);
                        return;
                    } catch (e) {
                        // If JSON parsing fails, still trigger auth modal
                        onAuthFailure(text, prompt);
                        return;
                    }
                }
                
                onFailure(`Error ${response.status}: ${text}`, prompt, 'Pollinations', finalModel);
            }
        },
        onerror: (error) => onFailure(JSON.stringify(error), prompt, 'Pollinations', finalModel),
    });
}