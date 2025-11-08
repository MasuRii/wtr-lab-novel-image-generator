/**
 * Prompt Utilities for cleaning and formatting prompts
 * Provides functionality to clean prompts for API transmission while preserving display formatting
 */

/**
 * Cleans excessive newline characters from prompts for API transmission
 * Removes 3+ consecutive newlines and reduces to 2 newlines maximum
 * Removes leading/trailing newlines and trims whitespace
 * @param {string} prompt - The prompt to clean
 * @returns {string} - The cleaned prompt suitable for API transmission
 */
export function cleanPromptForApi(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return prompt;
    }
    
    return prompt
        .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2 newlines
        .replace(/^\n+|\n+$/g, '') // Remove leading and trailing newlines
        .trim();
}

/**
 * Preserves display formatting by normalizing newlines to consistent format
 * Ensures consistent newline representation for display purposes
 * @param {string} prompt - The prompt to normalize for display
 * @returns {string} - The prompt with normalized newlines for display
 */
export function preserveDisplayFormatting(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return prompt;
    }
    
    return prompt
        .replace(/\r\n/g, '\n') // Convert Windows newlines to Unix newlines
        .replace(/\r/g, '\n') // Convert Mac newlines to Unix newlines
        .replace(/[ \t]+\n/g, '\n') // Remove trailing spaces/tabs before newlines
        .replace(/\n{3,}/g, '\n\n\n') // Ensure at most 3 newlines for display
        .trim();
}

/**
 * Validates and sanitizes a prompt
 * @param {string} prompt - The prompt to validate
 * @returns {boolean} - True if prompt is valid
 */
export function isValidPrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return false;
    }
    
    // Check for minimum length
    if (prompt.trim().length === 0) {
        return false;
    }
    
    // Check for maximum length (reasonable limit for API calls)
    if (prompt.length > 32000) { // 32K character limit
        return false;
    }
    
    return true;
}

/**
 * Logs prompt cleaning information for debugging
 * @param {string} originalPrompt - The original prompt
 * @param {string} cleanedPrompt - The cleaned prompt
 * @param {string} context - Context where cleaning occurred
 */
export function logPromptCleaning(originalPrompt, cleanedPrompt, context) {
    if (typeof window !== 'undefined' && window.console) {
        console.log(`[PROMPT-CLEANING] [${context}]`, {
            originalLength: originalPrompt?.length || 0,
            cleanedLength: cleanedPrompt?.length || 0,
            wasCleaned: originalPrompt !== cleanedPrompt,
            originalPreview: originalPrompt?.substring(0, 100) + (originalPrompt?.length > 100 ? '...' : ''),
            cleanedPreview: cleanedPrompt?.substring(0, 100) + (cleanedPrompt?.length > 100 ? '...' : '')
        });
    }
}

/**
 * Main function to get a prompt ready for API transmission
 * Combines validation, cleaning, and logging
 * @param {string} prompt - The prompt to process
 * @param {string} context - Context for logging (e.g., 'generate', 'enhance')
 * @returns {string} - The cleaned prompt
 */
export function getApiReadyPrompt(prompt, context = 'api') {
    if (!isValidPrompt(prompt)) {
        return prompt || '';
    }
    
    const originalPrompt = prompt;
    const cleanedPrompt = cleanPromptForApi(prompt);
    
    // Log if prompt was actually cleaned
    if (originalPrompt !== cleanedPrompt) {
        logPromptCleaning(originalPrompt, cleanedPrompt, context);
    }
    
    return cleanedPrompt;
}

/**
 * Main function to get a prompt ready for display
 * Preserves user formatting while normalizing newlines
 * @param {string} prompt - The prompt to process for display
 * @returns {string} - The display-ready prompt
 */
export function getDisplayReadyPrompt(prompt) {
    if (!isValidPrompt(prompt)) {
        return prompt || '';
    }
    
    return preserveDisplayFormatting(prompt);
}

/**
 * Processes prompt for specific use case
 * @param {string} prompt - The prompt to process
 * @param {string} useCase - 'api', 'display', or 'both'
 * @param {string} context - Context for logging
 * @returns {object} - Object containing original, cleaned, and display versions
 */
export function processPrompt(prompt, useCase = 'both', context = 'general') {
    const originalPrompt = prompt || '';
    
    if (!isValidPrompt(originalPrompt)) {
        return {
            original: originalPrompt,
            cleaned: originalPrompt,
            display: originalPrompt
        };
    }
    
    const cleaned = getApiReadyPrompt(originalPrompt, context);
    const display = getDisplayReadyPrompt(originalPrompt);
    
    return {
        original: originalPrompt,
        cleaned: useCase === 'display' ? originalPrompt : cleaned,
        display: useCase === 'api' ? cleaned : display
    };
}