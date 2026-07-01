/**
 * Abort Registry — tracks active GM_xmlhttpRequest handles and setTimeout timers
 * so that in-flight generation/enhancement/polling can be cancelled by the user.
 *
 * Each generate() call captures the cancel token at start; onload/onerror handlers
 * compare the live token to detect cancellation and skip callbacks silently.
 */

const activeRequests = new Set<object>();
const activeTimers = new Set<ReturnType<typeof setTimeout>>();

let cancelToken = 0;

/**
 * Returns the current cancel token. Callers capture this at the start of a
 * generate/enhance cycle and compare it later to detect cancellation.
 */
export function getCancelToken(): number {
  return cancelToken;
}

/**
 * Tracks a GM_xmlhttpRequest handle so it can be aborted on cancel.
 * Returns the handle for convenience.
 */
export function trackRequest<T>(handle: T): T {
  if (handle) {
    activeRequests.add(handle as object);
  }
  return handle;
}

/**
 * Removes a handle from tracking (called after onload/onerror completes).
 */
export function untrackRequest(handle: unknown): void {
  activeRequests.delete(handle as object);
}

/**
 * Tracks a setTimeout timer ID so it can be cleared on cancel.
 * Returns the timer ID for convenience.
 */
export function trackTimer<T>(timerId: T): T {
  if (timerId) {
    activeTimers.add(timerId as ReturnType<typeof setTimeout>);
  }
  return timerId;
}

/**
 * Removes a timer from tracking.
 */
export function untrackTimer(timerId: unknown): void {
  activeTimers.delete(timerId as ReturnType<typeof setTimeout>);
}

/**
 * Aborts all tracked requests and clears all tracked timers.
 * Increments the cancel token so in-flight callbacks detect cancellation.
 * Returns the total number of requests and timers that were cancelled.
 */
export function abortAll(): number {
  cancelToken++;
  let count = 0;

  for (const handle of activeRequests) {
    try {
      const h = handle as { abort?: () => void };
      if (typeof h.abort === "function") {
        h.abort();
      }
    } catch {
      // Ignore abort errors
    }
    count++;
  }
  activeRequests.clear();

  for (const timer of activeTimers) {
    try {
      clearTimeout(timer);
    } catch {
      // Ignore clear errors
    }
    count++;
  }
  activeTimers.clear();

  return count;
}

/**
 * Returns true when there are active requests or timers being tracked.
 */
export function hasActive(): boolean {
  return activeRequests.size > 0 || activeTimers.size > 0;
}
