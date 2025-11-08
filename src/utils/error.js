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

    try {
        const errorJson = JSON.parse(messageContent.substring(messageContent.indexOf('{')));
        const message = errorJson.message || (errorJson.error ? errorJson.error.message : null) || JSON.stringify(errorJson);
        return { message: typeof message === 'object' ? JSON.stringify(message) : message, retryable: false };
    } catch (e) {
        return { message: messageContent || 'An unknown error occurred.', retryable: false };
    }
}