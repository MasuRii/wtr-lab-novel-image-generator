/**
 * UI Utilities for the Novel Image Generator userscript.
 *
 * Provides accessible replacements for native alert/confirm/prompt dialogs,
 * HTML escaping for dynamic content, and modal accessibility helpers
 * (focus trap, Escape-to-close, scroll lock, ARIA attributes).
 *
 * These utilities ensure the userscript never leaks native browser dialogs
 * into the host page and that all dynamic content is safely escaped.
 */

import * as logger from "./logger";

// --- SCROLL LOCK COUNTER ---
// Tracks how many modals are open so body scroll lock is only released
// when the last modal closes. Prevents interference with host page when
// no userscript modal is visible.
let modalOpenCount = 0;
let savedBodyOverflow = null;

function lockScroll() {
  if (modalOpenCount === 0) {
    savedBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  }
  modalOpenCount++;
}

function unlockScroll() {
  modalOpenCount = Math.max(0, modalOpenCount - 1);
  if (modalOpenCount === 0 && savedBodyOverflow !== null) {
    document.body.style.overflow = savedBodyOverflow;
    savedBodyOverflow = null;
  }
}

// --- HTML ESCAPE ---

/**
 * Escapes HTML special characters in a string to prevent XSS when
 * inserting dynamic content via innerHTML.
 *
 * Escapes: & < > " '
 *
 * @param str - The string to escape (any type; coerced to string)
 * @returns The HTML-safe string
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) {
    return "";
  }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- FOCUS MANAGEMENT ---

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Returns all focusable elements within a container, in DOM order.
 */
function getFocusable(container) {
  const els = container.querySelectorAll(FOCUSABLE_SELECTOR);
  const result = [];
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement) {
      result.push(el);
    }
  }
  return result;
}

/**
 * Sets up full modal accessibility: ARIA roles, focus trap, Escape-to-close,
 * scroll lock, focus management on open, and focus restoration on close.
 *
 * @param modalElement - The modal overlay element (the fixed-position container)
 * @param options - Configuration options
 * @param options.onClose - Callback when the modal is closed via Escape
 * @param options.labelledBy - ID of the element that labels the dialog
 * @param options.closeOnEscape - Whether Escape closes the modal (default: true)
 * @returns A cleanup function that removes all listeners and restores state
 */
export function setupModalA11y(modalElement, options) {
  const opts = options || {};
  const onClose = opts.onClose;
  const labelledBy = opts.labelledBy;
  const closeOnEscape = opts.closeOnEscape !== false;

  // Set ARIA attributes
  modalElement.setAttribute("role", "dialog");
  modalElement.setAttribute("aria-modal", "true");
  if (labelledBy) {
    modalElement.setAttribute("aria-labelledby", labelledBy);
  }

  // Lock scroll
  lockScroll();

  // Save the currently focused element to restore later
  const previouslyFocused = document.activeElement;

  // Move focus into the modal
  const focusable = getFocusable(modalElement);
  if (focusable.length > 0) {
    focusable[0].focus();
  } else {
    modalElement.setAttribute("tabindex", "-1");
    modalElement.focus();
  }

  // Focus trap: cycle focus within the modal
  function handleKeydown(e) {
    if (e.key === "Escape" && closeOnEscape) {
      e.preventDefault();
      e.stopPropagation();
      cleanup();
      if (onClose) {onClose();}
      return;
    }

    if (e.key === "Tab") {
      const currentFocusable = getFocusable(modalElement);
      if (currentFocusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !modalElement.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !modalElement.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  modalElement.addEventListener("keydown", handleKeydown);

  function cleanup() {
    modalElement.removeEventListener("keydown", handleKeydown);
    modalElement.removeAttribute("aria-modal");
    unlockScroll();
    // Restore focus to the element that had it before the modal opened
    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      try {
        previouslyFocused.focus();
      } catch (_e) {
        document.body.focus();
      }
    }
  }

  return cleanup;
}

// --- TOAST NOTIFICATION (replaces alert) ---

let toastContainer = null;

function ensureToastContainer() {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }
  toastContainer = document.createElement("div");
  toastContainer.id = "nig-toast-container";
  toastContainer.className = "nig-toast-container";
  toastContainer.setAttribute("role", "status");
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("aria-atomic", "true");
  document.body.appendChild(toastContainer);
  return toastContainer;
}

/**
 * Shows a non-blocking toast notification (replacement for native alert()).
 *
 * @param message - The message to display (will be escaped)
 * @param type - The visual style: 'info', 'success', or 'error'
 * @param duration - How long to display in ms (default: 4000)
 */
export function showToast(message, type = "info", duration = 4000) {
  try {
    const container = ensureToastContainer();
    const toast = document.createElement("div");
    toast.className = `nig-toast nig-toast-${type}`;
    toast.setAttribute("role", "alert");

    const icon = document.createElement("span");
    icon.className = "nig-toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

    const text = document.createElement("span");
    text.className = "nig-toast-text";
    // Use textContent for XSS safety
    text.textContent = String(message);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "nig-toast-close";
    closeBtn.setAttribute("aria-label", "Dismiss notification");
    closeBtn.textContent = "×";

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(closeBtn);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add("nig-toast-visible"));

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) {return;}
      dismissed = true;
      toast.classList.remove("nig-toast-visible");
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener("click", dismiss);
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  } catch (e) {
    // Fallback to console if toast system fails
    console.log(`[NIG ${type}]`, message);
  }
}

// --- CONFIRMATION DIALOG (replaces confirm) ---

/**
 * Shows an accessible confirmation dialog (replacement for native confirm()).
 *
 * @param message - The confirmation message to display
 * @param title - Optional title for the dialog (default: "Please Confirm")
 * @returns Promise that resolves to true if confirmed, false if cancelled
 */
export function showConfirm(message, title = "Please Confirm"): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const overlay = document.createElement("div");
      overlay.className = "nig-modal-overlay nig-confirm-overlay";
      overlay.style.display = "flex";

      const titleId = "nig-confirm-title-" + Date.now();

      overlay.innerHTML = `
        <div class="nig-modal-content nig-confirm-dialog" style="max-width: 450px;">
          <button type="button" class="nig-close-btn" aria-label="Close dialog">&times;</button>
          <h2 id="${titleId}">${escapeHtml(title)}</h2>
          <p class="nig-confirm-message"></p>
          <div class="nig-confirm-actions">
            <button type="button" class="nig-btn-secondary nig-confirm-cancel">Cancel</button>
            <button type="button" class="nig-save-btn nig-confirm-ok">Confirm</button>
          </div>
        </div>`;

      document.body.appendChild(overlay);

      // Set message via textContent for XSS safety
      const msgEl = overlay.querySelector(".nig-confirm-message");
      if (msgEl) {msgEl.textContent = String(message);}

      let resolved = false;
      const cleanup = setupModalA11y(overlay, {
        labelledBy: titleId,
        closeOnEscape: true,
      });

      const close = (result) => {
        if (resolved) {return;}
        resolved = true;
        cleanup();
        overlay.remove();
        resolve(result);
      };

      overlay.querySelector(".nig-close-btn")?.addEventListener("click", () => close(false));
      overlay.querySelector(".nig-confirm-cancel")?.addEventListener("click", () => close(false));
      overlay.querySelector(".nig-confirm-ok")?.addEventListener("click", () => close(true));

      // Click on overlay backdrop (not content) cancels
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {close(false);}
      });
    } catch (e) {
      logger.logError("UI", "Failed to show confirm dialog", {
        error: (e)?.message,
      });
      resolve(false);
    }
  });
}

// --- PROMPT DIALOG (replaces prompt) ---

/**
 * Shows an accessible input prompt dialog (replacement for native prompt()).
 *
 * @param message - The prompt message to display
 * @param defaultValue - Optional default value for the input
 * @param title - Optional title for the dialog (default: "Input Required")
 * @returns Promise that resolves to the entered string, or null if cancelled
 */
export function showPrompt(message, defaultValue = "", title = "Input Required"): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const overlay = document.createElement("div");
      overlay.className = "nig-modal-overlay nig-prompt-overlay";
      overlay.style.display = "flex";

      const titleId = "nig-prompt-title-" + Date.now();
      const inputId = "nig-prompt-input-" + Date.now();

      overlay.innerHTML = `
        <div class="nig-modal-content nig-prompt-dialog" style="max-width: 450px;">
          <button type="button" class="nig-close-btn" aria-label="Close dialog">&times;</button>
          <h2 id="${titleId}">${escapeHtml(title)}</h2>
          <label class="nig-prompt-label" for="${inputId}"></label>
          <input type="text" id="${inputId}" class="nig-prompt-input" />
          <div class="nig-confirm-actions" style="margin-top: var(--nig-space-xl);">
            <button type="button" class="nig-btn-secondary nig-prompt-cancel">Cancel</button>
            <button type="button" class="nig-save-btn nig-prompt-ok">OK</button>
          </div>
        </div>`;

      document.body.appendChild(overlay);

      // Set message via textContent for XSS safety
      const labelEl = overlay.querySelector(".nig-prompt-label");
      if (labelEl) {labelEl.textContent = String(message);}

      const inputEl = overlay.querySelector("#" + inputId);
      if (inputEl) {
        inputEl.value = defaultValue;
      }

      let resolved = false;
      const cleanup = setupModalA11y(overlay, {
        labelledBy: titleId,
        closeOnEscape: true,
      });

      // Focus the input after modal a11y setup
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }

      const close = (result) => {
        if (resolved) {return;}
        resolved = true;
        cleanup();
        overlay.remove();
        resolve(result);
      };

      const submit = () => {
        if (inputEl) {
          const val = inputEl.value.trim();
          close(val);
        }
      };

      overlay.querySelector(".nig-close-btn")?.addEventListener("click", () => close(null));
      overlay.querySelector(".nig-prompt-cancel")?.addEventListener("click", () => close(null));
      overlay.querySelector(".nig-prompt-ok")?.addEventListener("click", submit);

      if (inputEl) {
        inputEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        });
      }

      // Click on overlay backdrop cancels
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {close(null);}
      });
    } catch (e) {
      logger.logError("UI", "Failed to show prompt dialog", {
        error: (e)?.message,
      });
      resolve(null);
    }
  });
}
