/**
 * Link validation utility for checking image URL accessibility
 */

/**
 * Checks if an image URL is accessible and valid
 * @param {string} url - The image URL to validate
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Result object with status and accessibility info
 */
export async function validateImageLink(url, timeout = 5000) {
    // Skip validation for data URLs (base64 images)
    if (url.startsWith('data:')) {
        return {
            isAccessible: true,
            status: 'valid',
            error: null,
            method: 'data-url'
        };
    }

    // Skip validation for blob URLs
    if (url.startsWith('blob:')) {
        return {
            isAccessible: true,
            status: 'valid',
            error: null,
            method: 'blob-url'
        };
    }

    try {
        // Try HEAD request first (more efficient)
        const headController = new AbortController();
        const headTimeoutId = setTimeout(() => headController.abort(), timeout);

        const headResponse = await fetch(url, {
            method: 'HEAD',
            mode: 'cors',
            signal: headController.signal,
            cache: 'no-cache'
        });

        clearTimeout(headTimeoutId);

        if (headResponse.ok) {
            return {
                isAccessible: true,
                status: headResponse.status,
                statusText: headResponse.statusText,
                error: null,
                method: 'head'
            };
        }

        // If HEAD fails with certain status codes, try GET
        if (headResponse.status === 405 || headResponse.status === 501) {
            // Method Not Allowed or Not Implemented - try GET
            const getController = new AbortController();
            const getTimeoutId = setTimeout(() => getController.abort(), timeout);

            const getResponse = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                signal: getController.signal,
                cache: 'no-cache'
            });

            clearTimeout(getTimeoutId);

            return {
                isAccessible: getResponse.ok,
                status: getResponse.status,
                statusText: getResponse.statusText,
                error: getResponse.ok ? null : new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`),
                method: 'get'
            };
        }

        // For other error status codes (403, 404, 500, etc.)
        return {
            isAccessible: false,
            status: headResponse.status,
            statusText: headResponse.statusText,
            error: new Error(`HTTP ${headResponse.status}: ${headResponse.statusText}`),
            method: 'head'
        };

    } catch (error) {
        // Handle network errors, CORS issues, timeouts, etc.
        if (error.name === 'AbortError') {
            return {
                isAccessible: false,
                status: 'timeout',
                statusText: 'Request timeout',
                error: new Error('Request timeout'),
                method: 'timeout'
            };
        }

        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return {
                isAccessible: false,
                status: 'network-error',
                statusText: 'Network error or CORS blocked',
                error: new Error('Network error or CORS blocked'),
                method: 'network-error'
            };
        }

        return {
            isAccessible: false,
            status: 'unknown-error',
            statusText: 'Unknown error',
            error: error,
            method: 'error'
        };
    }
}

/**
 * Validates multiple image links concurrently with progress callback
 * @param {Array<string>} urls - Array of image URLs to validate
 * @param {Function} progressCallback - Callback function for progress updates
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Array<Object>>} Array of validation results
 */
export async function validateImageLinks(urls, progressCallback = null, timeout = 5000) {
    const results = [];
    const total = urls.length;

    // Process URLs in batches to avoid overwhelming the network
    const batchSize = 3;
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (url, index) => {
            const result = await validateImageLink(url, timeout);
            result.url = url;
            return result;
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Update progress
        if (progressCallback) {
            progressCallback({
                current: Math.min(i + batchSize, total),
                total: total,
                completed: results.length,
                failed: results.filter(r => !r.isAccessible).length
            });
        }

        // Small delay between batches to be respectful to servers
        if (i + batchSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
}

/**
 * Filters history entries to remove expired/broken links
 * @param {Array<Object>} history - History entries to filter
 * @param {Function} progressCallback - Optional progress callback
 * @returns {Promise<Object>} Object with filtered history and statistics
 */
export async function filterExpiredLinks(history, progressCallback = null) {
    const urlsToCheck = history
        .filter(entry => entry.url && !entry.url.startsWith('data:') && !entry.url.startsWith('blob:'))
        .map(entry => entry.url);

    if (urlsToCheck.length === 0) {
        return {
            filteredHistory: history,
            expiredLinksCount: 0,
            totalLinksChecked: 0,
            results: []
        };
    }

    const validationResults = await validateImageLinks(urlsToCheck, progressCallback);
    const expiredUrls = validationResults
        .filter(result => !result.isAccessible)
        .map(result => result.url);

    const validEntries = history.filter(entry => {
        if (!entry.url || entry.url.startsWith('data:') || entry.url.startsWith('blob:')) {
            return true; // Always keep data URLs and blob URLs
        }
        return !expiredUrls.includes(entry.url);
    });

    return {
        filteredHistory: validEntries,
        expiredLinksCount: expiredUrls.length,
        totalLinksChecked: urlsToCheck.length,
        results: validationResults
    };
}