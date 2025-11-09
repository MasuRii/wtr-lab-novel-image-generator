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
        enableNegPrompt,
        globalNegPrompt
    } = config;

    // Base positive prompt from queue (StyledPrompt or EnhancedPrompt)
    const basePositive = typeof prompt === 'string' ? prompt : '';

    const negEnabled = !!enableNegPrompt;
    const negText = (globalNegPrompt || '').trim();
    const hasValidNegative = negEnabled && negText.length > 0;

    // For Pollinations and other non-AI Horde providers:
    // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
    // when enabled and non-empty.
    const finalPrompt = hasValidNegative
        ? `${basePositive}, negative prompt: ${negText}`
        : basePositive;

    // Apply prompt cleaning as a safety measure (on the fully formed FinalPrompt)
    const cleanPrompt = getApiReadyPrompt(finalPrompt, 'pollinations_api_final');

    // Use the configured model (includes kontext which can do text-to-image)
    const finalModel = model || 'flux';
    
    // Debug logging to track model configuration and prompt construction
    console.log('[NIG-DEBUG] [POLLINATIONS] Model configuration:', {
        originalModel: model,
        finalModel: finalModel
    });
    console.log('[NIG-DEBUG] [POLLINATIONS] Prompt construction:', {
        path: 'non-horde inline negative',
        basePositivePromptLength: basePositive.length,
        hasNegativePrompt: hasValidNegative,
        enableNegPrompt: negEnabled,
        negativePromptLength: hasValidNegative ? negText.length : 0,
        finalPromptLength: cleanPrompt.length,
        finalPromptPreview: cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? '...' : '')
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
                // Pass the exact FinalPrompt string used for the API to the viewer/history
                onSuccess([blobUrl], cleanPrompt, 'Pollinations', finalModel, [url]);
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