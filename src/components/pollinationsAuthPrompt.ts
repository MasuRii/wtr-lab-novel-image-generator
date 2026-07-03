import { setConfigValue } from "../utils/storage";
import { showToast, setupModalA11y, escapeHtml } from "../utils/uiUtils";

let promptElement = null;

/**
 * Shows a modal for Pollinations.ai authentication.
 * @param {string} errorMessage - The error message from the API.
 * @param {string} failedPrompt - The prompt that failed.
 * @param {function} onRetry - The callback function to execute on retry.
 */
export function show(errorMessage, failedPrompt, onRetry) {
  if (document.getElementById("nig-pollinations-auth-prompt")) {
    return;
  }

  promptElement = document.createElement("div");
  promptElement.id = "nig-pollinations-auth-prompt";
  promptElement.className = "nig-modal-overlay";
  promptElement.innerHTML = `
        <div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-auth-title">
            <button type="button" class="nig-close-btn" aria-label="Close authentication dialog">&times;</button>
            <h2 id="nig-auth-title">Authentication Required</h2>
            <p>The Pollinations.ai model you selected requires authentication. You can get free access by registering.</p>
            <p><strong>Error Message:</strong> <em>${escapeHtml(errorMessage)}</em></p>
            <p>Please visit <a href="https://enter.pollinations.ai" target="_blank" class="nig-api-prompt-link">enter.pollinations.ai</a> to continue. You can either:</p>
            <ul>
                <li><strong>Register the Referrer:</strong> The easiest method. Just register the domain <code>wtr-lab.com</code>. This links your usage to your account without needing a token.</li>
                <li><strong>Use a Token:</strong> Get an API token and enter it below.</li>
            </ul>
            <div class="nig-form-group">
                <label for="nig-prompt-pollinations-token">Pollinations API Token</label>
                <input type="password" id="nig-prompt-pollinations-token">
            </div>
            <button id="nig-prompt-save-token-btn" class="nig-save-btn">Save Token & Retry</button>
        </div>`;
  document.body.appendChild(promptElement);

  const close = () => {
    if (a11yCleanup) {
      a11yCleanup();
      a11yCleanup = null;
    }
    promptElement.remove();
  };

  let a11yCleanup = setupModalA11y(promptElement, {
    labelledBy: "nig-auth-title",
    closeOnEscape: true,
    onClose: close,
  });

  promptElement
    .querySelector(".nig-close-btn")
    .addEventListener("click", close);
  promptElement
    .querySelector("#nig-prompt-save-token-btn")
    .addEventListener("click", async () => {
      const token = promptElement
        .querySelector("#nig-prompt-pollinations-token")
        .value.trim();
      if (token) {
        await setConfigValue("pollinationsToken", token);
        close();
        showToast("Token saved. Retrying generation...", "success");
        onRetry(failedPrompt, "Pollinations");
      } else {
        showToast("Token cannot be empty.", "error");
      }
    });
}
