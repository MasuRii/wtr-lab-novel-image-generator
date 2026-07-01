/**
 * Prompt Utilities for cleaning and formatting prompts
 * Provides functionality to clean prompts for API transmission
 */

/**
 * Cleans excessive newline characters from prompts for API transmission
 * Removes 3+ consecutive newlines and reduces to 2 newlines maximum
 * Removes leading/trailing newlines and trims whitespace
 * @param {string} prompt - The prompt to clean
 * @returns {string} - The cleaned prompt suitable for API transmission
 */
export function cleanPromptForApi(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return prompt;
  }

  return prompt
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2 newlines
    .replace(/^\n+|\n+$/g, "") // Remove leading and trailing newlines
    .trim();
}

/**
 * Validates and sanitizes a prompt
 * @param {string} prompt - The prompt to validate
 * @returns {boolean} - True if prompt is valid
 */
export function isValidPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return false;
  }

  // Check for minimum length
  if (prompt.trim().length === 0) {
    return false;
  }

  // Check for maximum length (reasonable limit for API calls)
  if (prompt.length > 32000) {
    // 32K character limit
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
export function logPromptCleaning(_originalPrompt, _cleanedPrompt, _context) {
  // Intentionally a no-op placeholder:
  // - Callers may treat this as a debug hook.
  // - Using underscored params keeps ESLint satisfied and documents intent.
}

/**
 * Main function to get a prompt ready for API transmission
 * Combines validation, cleaning, and logging
 * @param {string} prompt - The prompt to process
 * @param {string} context - Context for logging (e.g., 'generate', 'enhance')
 * @returns {string} - The cleaned prompt
 */
export function getApiReadyPrompt(prompt, context = "api") {
  if (!isValidPrompt(prompt)) {
    return prompt || "";
  }

  const originalPrompt = prompt;
  const cleanedPrompt = cleanPromptForApi(prompt);

  // Log if prompt was actually cleaned
  if (originalPrompt !== cleanedPrompt) {
    logPromptCleaning(originalPrompt, cleanedPrompt, context);
  }

  return cleanedPrompt;
}
