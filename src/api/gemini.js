import { log, logInfo, logDebug, logError } from '../utils/logger.js';

/**
 * Determines if the selected provider's built-in enhancement should be used.
 * @param {string} provider - The name of the image generation provider.
 * @param {object} config - The current script configuration.
 * @returns {boolean} - True if provider enhancement should be used.
 */
export function shouldUseProviderEnhancement(provider, config) {
    logDebug('ENHANCEMENT', 'Checking provider priority for enhancement', { provider, config });

    const shouldUse = (() => {
        if (provider === 'Pollinations') {
            const result = config.pollinationsEnhance;
            logInfo('ENHANCEMENT', `Provider ${provider} has built-in enhancement: ${result}`);
            return result;
        }
        logInfo('ENHANCEMENT', `Provider ${provider} does not have built-in enhancement`);
        return false;
    })();

    logDebug('ENHANCEMENT', 'Provider priority decision completed', {
        shouldUseProviderEnhancement: shouldUse,
        willUseExternalAI: config.enhancementEnabled && config.enhancementApiKey && (!shouldUse || config.enhancementOverrideProvider),
    });

    return shouldUse;
}

/**
 * Enhances a given prompt using the Google Gemini API.
 * @param {string} originalPrompt - The user's original prompt.
 * @param {object} config - The current script configuration.
 * @returns {Promise<string>} The enhanced prompt.
 */
export async function enhancePromptWithGemini(originalPrompt, config) {
    const startTime = Date.now();
    const { enhancementApiKey: apiKey, enhancementModel: rawModel, enhancementTemplate: template } = config;
    const model = rawModel.startsWith('models/') ? rawModel.substring(7) : rawModel;

    if (!model) {
        throw new Error('Model name processing resulted in an empty or invalid model name.');
    }

    logInfo('ENHANCEMENT', 'Starting prompt enhancement with Gemini AI', {
        originalLength: originalPrompt.length,
        model,
        apiKeyPresent: !!apiKey,
    });

    if (!apiKey) {
        throw new Error('Gemini API key is required for prompt enhancement.');
    }

    const enhancementPrompt = template
        ? `${template}\n\nOriginal prompt: "${originalPrompt}"\n\nEnhanced prompt:`
        : `Convert this text into a focused visual description for image generation... \n\n"${originalPrompt}"\n\nEnhanced version:`;

    const requestData = {
        contents: [{ parts: [{ text: enhancementPrompt }] }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 65536,
        },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(requestData),
            timeout: 45000,
            onload: (response) => {
                try {
                    if (!response.responseText) {
                        throw new Error('Empty response received from Gemini API');
                    }
                    const data = JSON.parse(response.responseText);

                    if (data.error) {
                        throw new Error(data.error.message || 'Gemini API error');
                    }

                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                        const enhancedText = data.candidates[0].content.parts[0].text.trim();
                        const cleanedText = enhancedText.replace(/^["']|["']$/g, '');
                        logInfo('ENHANCEMENT', 'Prompt enhancement successful', { duration: Date.now() - startTime });
                        resolve(cleanedText);
                    } else {
                        throw new Error('No enhancement result received from Gemini API');
                    }
                } catch (e) {
                    logError('ENHANCEMENT', 'Enhancement processing error', { error: e.message, responseText: response.responseText });
                    reject(e);
                }
            },
            onerror: (error) => {
                logError('ENHANCEMENT', 'Network error during enhancement', { error });
                reject(new Error('Network error during enhancement request.'));
            },
            ontimeout: () => {
                logError('ENHANCEMENT', 'Enhancement request timed out.');
                reject(new Error('Enhancement request timed out after 45 seconds.'));
            },
        });
    });
}