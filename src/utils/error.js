/**
 * Parses a raw error string into a user-friendly message and a retryable status.
 * @param {string} errorString - The raw error message from the API.
 * @param {string|null} provider - The name of the provider that failed.
 * @param {string|null} providerProfileUrl - The URL of the OpenAI compatible profile, if applicable.
 * @returns {{message: string, retryable: boolean}}
 */
export function parseErrorMessage(errorString, provider = null, providerProfileUrl = null) {
    let messageContent = String(errorString);
    const lowerCaseContent = messageContent.toLowerCase();

    if (lowerCaseContent.includes('error code: 524') || lowerCaseContent.includes('timed out') || lowerCaseContent.includes('502 bad gateway') || lowerCaseContent.includes('unable to reach the origin service')) {
        return {
            message: 'The generation service is temporarily unavailable or busy (e.g., 502 Bad Gateway). This is usually a temporary issue. Please try again in a few minutes.',
            retryable: true,
        };
    }

    // Check for specific OpenAI Compatible provider false positive error
    if (provider === 'OpenAICompat' && providerProfileUrl?.includes('api.mnnai.ru')) {
        try {
            const errorJson = JSON.parse(messageContent.substring(messageContent.indexOf('{')));
            if (errorJson.error === "Sorry, there's been some kind of mistake, please use a different model") {
                return {
                    message: 'Temporary service error detected. The same prompt typically works on retry. This error will be automatically retried.',
                    retryable: true,
                };
            }
        } catch (e) { /* Fall through */ }
    }

    if (lowerCaseContent.includes('unsafe content') || lowerCaseContent.includes('safety system') || lowerCaseContent.includes('moderation_blocked')) {
        return {
            message: 'The prompt was rejected by the safety system for containing potentially unsafe content.',
            retryable: false,
        };
    }

    // Check for OpenAI-compatible provider model access / tier restriction errors
    if (provider === 'OpenAICompat' &&
        (lowerCaseContent.includes('access denied for model') ||
         lowerCaseContent.includes('not available for free users') ||
         lowerCaseContent.includes('premium model requires a subscription') ||
         lowerCaseContent.includes('"code":402') ||
         lowerCaseContent.includes('requires a subscription') ||
         lowerCaseContent.includes('your plan does not have access to model'))) {
        return {
            message: 'The selected model is not available for your current plan. You may switch to a free model, choose a supported provider, or upgrade your account according to your provider’s tiers.',
            // Keep this retryable so the UI allows switching provider/model and retrying.
            retryable: true,
            errorType: 'model_access',
            isNonRetryable: false
        };
    }

    // Check for AIHorde specific API key validation errors
    if (provider === 'AIHorde' && lowerCaseContent.includes('no user matching sent api key')) {
        return {
            message: 'AIHorde API key validation failed. Please check your API key configuration and ensure you have registered at https://stablehorde.net/register. You can try a different provider or update your API key in settings.',
            retryable: true,
            errorType: 'api_key_validation',
            isNonRetryable: false
        };
    }

    // Check for OpenAI Compatible provider specific errors
    if (provider === 'OpenAICompat') {
        // Check for authentication errors (non-retryable)
        if (lowerCaseContent.includes('invalid api key') || lowerCaseContent.includes('authentication failed') || lowerCaseContent.includes('unauthorized')) {
            return {
                message: 'Authentication failed. Please check your API key configuration and ensure it is valid for this OpenAI-compatible provider.',
                retryable: false,
                errorType: 'authentication',
                isNonRetryable: true
            };
        }
        
        // Check for IP address mismatch errors (retryable)
        if (lowerCaseContent.includes('ip address mismatch')) {
            return {
                message: 'IP Address Mismatch: Your current IP doesn\'t match your account. Try the /user resetip command in the Discord server or upgrade to premium for multi-IP support.',
                retryable: true,
                errorType: 'ip_mismatch',
                isNonRetryable: false,
                discordLink: 'https://discord.gg/zukijourney',
                resetipCommand: '/user resetip'
            };
        }
        
        // Check for image conversion errors
        if (lowerCaseContent.includes('failed to convert image to base64') || lowerCaseContent.includes('base64') || lowerCaseContent.includes('image conversion')) {
            return {
                message: 'Image conversion failed. The provider returned image data that could not be properly converted. This may be a temporary issue with the provider.',
                retryable: true,
                errorType: 'image_conversion',
                isNonRetryable: false
            };
        }
        
        // Check for JSON parsing errors
        if (lowerCaseContent.includes('html response instead of json') || lowerCaseContent.includes('unexpected token \'<\'') || lowerCaseContent.includes('received html')) {
            return {
                message: 'The API endpoint returned an HTML page instead of JSON data. This usually indicates endpoint configuration issues, authentication problems, or an invalid API endpoint URL. Please check your OpenAI-compatible provider configuration.',
                retryable: false,
                errorType: 'html_response',
                isNonRetryable: true,
                endpointIssue: true
            };
        }
        
        // Check for malformed JSON errors
        if (lowerCaseContent.includes('json parsing failed') || lowerCaseContent.includes('malformed json') || lowerCaseContent.includes('unexpected character at line 1 column 1')) {
            return {
                message: 'The API returned malformed or invalid JSON data. This may indicate server issues with the OpenAI-compatible provider. Please try again later or contact the provider support.',
                retryable: true,
                errorType: 'malformed_json',
                isNonRetryable: false,
                serverIssue: true
            };
        }
        
        // Check for generic JSON parse errors
        if (lowerCaseContent.includes('json parse error') || lowerCaseContent.includes('json parsing error') || lowerCaseContent.includes('invalid json')) {
            return {
                message: 'JSON parsing failed for the API response. This may indicate server issues or malformed response from the OpenAI-compatible provider.',
                retryable: true,
                errorType: 'json_parse_error',
                isNonRetryable: false
            };
        }
    }

    try {
        const errorJson = JSON.parse(messageContent.substring(messageContent.indexOf('{')));
        const message = errorJson.message || (errorJson.error ? errorJson.error.message : null) || JSON.stringify(errorJson);
        return { message: typeof message === 'object' ? JSON.stringify(message) : message, retryable: false };
    } catch (e) {
        return { message: messageContent || 'An unknown error occurred.', retryable: false };
    }
}