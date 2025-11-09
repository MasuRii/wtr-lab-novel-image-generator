import { getConfig } from '../utils/storage.js';
import { getApiReadyPrompt } from '../utils/promptUtils.js';

/**
 * Detects if response content is HTML instead of JSON
 * @param {string} responseText - The response text to check
 * @returns {boolean} - True if content appears to be HTML
 */
function isHtmlResponse(responseText) {
    const trimmed = responseText.trim().toLowerCase();
    return trimmed.startsWith('<!doctype') ||
           trimmed.startsWith('<html') ||
           trimmed.includes('<!doctype') ||
           trimmed.includes('<html>') ||
           trimmed.startsWith('<!') ||
           trimmed.startsWith('<head>') ||
           trimmed.includes('<title>');
}

/**
 * Safely parses JSON with enhanced error handling
 * @param {string} responseText - The response text to parse
 * @param {string} endpointUrl - The endpoint URL for context in error messages
 * @returns {object|null} - Parsed JSON object or throws enhanced error
 */
function safeJsonParse(responseText, endpointUrl) {
    try {
        return JSON.parse(responseText);
    } catch (e) {
        // Check if this is an HTML response
        if (isHtmlResponse(responseText)) {
            throw {
                isHtmlResponse: true,
                originalError: e,
                message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`
            };
        }
        // Check for specific JSON parsing error patterns
        const errorMessage = e.message.toLowerCase();
        if (errorMessage.includes('unexpected token \'<\'') && responseText.trim().startsWith('<!')) {
            throw {
                isHtmlResponse: true,
                originalError: e,
                message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`
            };
        }
        if (errorMessage.includes('unexpected character at line 1 column 1')) {
            throw {
                isMalformedJson: true,
                originalError: e,
                message: `JSON parsing failed at the first character. This may indicate server issues or malformed response from ${endpointUrl}`
            };
        }
        // Re-throw as generic parsing error
        throw {
            isJsonParseError: true,
            originalError: e,
            message: `JSON parsing error: ${e.message}. This may indicate server issues or malformed response.`
        };
    }
}

export async function generate(prompt, providerProfileUrl, { onSuccess, onFailure }) {
    const config = await getConfig();
    const activeUrl = providerProfileUrl || config.openAICompatActiveProfileUrl;
    const activeProfile = config.openAICompatProfiles[activeUrl];

    if (!activeProfile) {
        onFailure(`No active or valid Openai Compatible profile found for URL: ${activeUrl}`, prompt, 'OpenAICompat');
        return;
    }

    const { enableNegPrompt, globalNegPrompt } = config;

    const basePositive = typeof prompt === 'string' ? prompt : '';

    const negEnabled = !!enableNegPrompt;
    const negText = (globalNegPrompt || '').trim();
    const hasValidNegative = negEnabled && negText.length > 0;

    // For non-AI Horde providers:
    // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
    // when enabled and non-empty.
    const finalPrompt = hasValidNegative
        ? `${basePositive}, negative prompt: ${negText}`
        : basePositive;

    // Apply prompt cleaning as a safety measure on the fully-formed FinalPrompt
    const cleanPrompt = getApiReadyPrompt(finalPrompt, 'openai_api_final');

    console.log('[NIG-DEBUG] [OPENAI-COMPAT] Prompt construction:', {
        path: 'non-horde inline negative',
        basePositivePromptLength: basePositive.length,
        hasNegativePrompt: hasValidNegative,
        enableNegPrompt: negEnabled,
        negativePromptLength: hasValidNegative ? negText.length : 0,
        finalPromptLength: cleanPrompt.length,
        finalPromptPreview: cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? '...' : '')
    });

    const url = `${activeUrl}/images/generations`;
    const payload = {
        model: activeProfile.model,
        prompt: cleanPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
    };

    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeProfile.apiKey}`,
        },
        data: JSON.stringify(payload),
        onload: (response) => {
            try {
                const data = safeJsonParse(response.responseText, activeUrl);
                
                // Check for authentication errors first
                if (data?.Error && data.Error.toLowerCase().includes('invalid api key')) {
                    onFailure(data.Error, prompt, 'OpenAICompat', activeUrl, {
                        errorType: 'authentication',
                        isNonRetryable: true
                    });
                    return;
                }
                
                // Check for IP address mismatch errors
                if (data?.Error && data.Error.toLowerCase().includes('ip address mismatch')) {
                    onFailure(data.Error, prompt, 'OpenAICompat', activeUrl, {
                        errorType: 'ip_mismatch',
                        isNonRetryable: false,
                        retryable: true
                    });
                    return;
                }
                
                if (data?.data?.[0]) {
                    try {
                        const imageUrls = data.data.map(item => {
                            if (item.b64_json) {
                                try {
                                    // Validate base64 data
                                    if (typeof item.b64_json === 'string' && item.b64_json.length > 0) {
                                        return `data:image/png;base64,${item.b64_json}`;
                                    } else {
                                        throw new Error('Invalid base64 data');
                                    }
                                } catch (conversionError) {
                                    throw new Error(`Failed to convert image to base64: ${conversionError.message}`);
                                }
                            } else if (item.url) {
                                return item.url;
                            }
                            return null;
                        }).filter(Boolean);
                        
                        if (imageUrls.length > 0) {
                            // Pass the exact FinalPrompt string used for the API to the viewer/history
                            onSuccess(imageUrls, cleanPrompt, 'OpenAICompat', activeProfile.model);
                        } else {
                            throw new Error('API response did not contain usable image data.');
                        }
                    } catch (conversionError) {
                        onFailure(conversionError.message, prompt, 'OpenAICompat', activeUrl, {
                            errorType: 'image_conversion',
                            isNonRetryable: false
                        });
                    }
                } else {
                    throw new Error(JSON.stringify(data));
                }
            } catch (e) {
                // Handle enhanced error types from safeJsonParse
                if (e.isHtmlResponse) {
                    onFailure(e.message, prompt, 'OpenAICompat', activeUrl, {
                        errorType: 'html_response',
                        isNonRetryable: false,
                        endpointIssue: true
                    });
                } else if (e.isMalformedJson) {
                    onFailure(e.message, prompt, 'OpenAICompat', activeUrl, {
                        errorType: 'malformed_json',
                        isNonRetryable: false,
                        serverIssue: true
                    });
                } else if (e.isJsonParseError) {
                    onFailure(e.message, prompt, 'OpenAICompat', activeUrl, {
                        errorType: 'json_parse_error',
                        isNonRetryable: false
                    });
                } else {
                    // Fallback for generic errors
                    onFailure(e.message, prompt, 'OpenAICompat', activeUrl);
                }
            }
        },
        onerror: (error) => onFailure(JSON.stringify(error), prompt, 'OpenAICompat', activeUrl),
    });
}