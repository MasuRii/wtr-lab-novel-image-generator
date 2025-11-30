// --- IMPORTS ---
import * as storage from "../utils/storage.js";
// import { filterExpiredLinks } from "../utils/linkValidator.js"; // Not currently used

// --- PUBLIC FUNCTIONS ---

/**
 * Populates the history tab with the user's generation history
 */
export async function populateHistoryTab() {
  const historyList = document.getElementById("nig-history-list");
  // Use the new getFilteredHistory function to respect the configured days setting
  const history = await storage.getFilteredHistory();

  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No history yet.</li>";
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "nig-history-item";

    const safePrompt =
      typeof item.prompt === "string"
        ? item.prompt
        : item && typeof item === "object" && typeof item.prompt === "string"
          ? item.prompt
          : "";

    const providerInfo =
      item && item.provider ? `<strong>${item.provider}</strong>` : "";
    const modelInfo = item && item.model ? `(${item.model})` : "";

    const metaText = new Date(item.date).toLocaleString();
    const metaHtml = `<div class="nig-history-meta"><small>${metaText} - ${providerInfo} ${modelInfo}</small></div>`;

    // Prompt display: up to 2 lines, full available width, ellipsis beyond 2 lines.
    const promptHtml = safePrompt
      ? `<div class="nig-history-prompt" title="${safePrompt.replace(/"/g, '"')}">${safePrompt}</div>`
      : '<div class="nig-history-prompt nig-history-prompt-empty">No prompt available</div>';

    li.innerHTML = `
            ${metaHtml}
            ${promptHtml}
        `;

    // Create the link element separately to add the event listener
    const viewLink = document.createElement("a");
    viewLink.href = "#"; // Use a non-navigating href
    viewLink.textContent = "View Generated Image";

    viewLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Use unified modal for all image types (both base64 and URL)
      import("./imageViewer.js").then((module) => {
        if (typeof module.show === "function") {
          module.show(
            [item.url],
            safePrompt || "No prompt available",
            item.provider,
            item.model,
          );
        }
      });
    });

    li.appendChild(viewLink);
    historyList.appendChild(li);
  });
}

/**
 * Cleans up old history entries based on the specified number of days
 */
export async function cleanHistory() {
  const daysInput = document.getElementById("nig-history-clean-days").value;
  const days = parseInt(daysInput);

  // Validate the input
  if (isNaN(days) || days < 1 || days > 365) {
    alert("Please enter a valid number of days (1-365).");
    return;
  }

  // Show loading state
  const cleanButton = document.getElementById("nig-history-clean-btn");

  if (cleanButton) {
    // Store the original innerHTML to preserve the icon structure
    const originalContent = cleanButton.innerHTML;
    cleanButton.disabled = true;
    cleanButton.innerHTML = "Cleaning...";

    try {
      // Save the days setting
      await storage.setHistoryDays(days);

      // Create progress callback for link validation
      const progressCallback = (progress) => {
        cleanButton.innerHTML = `<span class="material-symbols-outlined">cleaning_services</span> Cleaning... (${progress.completed}/${progress.total} links checked)`;
      };

      // Use the enhanced cleanHistoryEnhanced function
      const result = await storage.cleanHistoryEnhanced(progressCallback);

      // Show detailed feedback
      let message = "History cleaned successfully!\n\n";

      if (result.expiredLinksRemoved > 0) {
        message += `• Removed ${result.expiredLinksRemoved} expired/broken image links\n`;
      }

      if (result.oldEntriesRemoved > 0) {
        message += `• Removed ${result.oldEntriesRemoved} old entries\n`;
      }

      if (result.expiredLinksRemoved === 0 && result.oldEntriesRemoved === 0) {
        message += "• No items needed to be removed";
      }

      if (result.totalLinksChecked > 0) {
        message += `\n\nChecked ${result.totalLinksChecked} image links for validity.`;
      }

      message += `\n\nTotal removed: ${result.totalRemoved} items`;
      message += `\nRemaining entries: ${result.finalHistoryCount}`;

      alert(message);

      await populateHistoryTab();
    } catch (error) {
      console.error("Failed to clean history:", error);
      alert("Failed to clean history. Please try again.");
    } finally {
      // Restore button state - restore the complete original structure
      cleanButton.disabled = false;
      cleanButton.innerHTML = originalContent;
    }
  }
}

/**
 * Auto-saves history days setting when the input changes
 */
export async function handleHistoryDaysChange(event) {
  const days = parseInt(event.target.value);
  if (!isNaN(days) && days >= 1 && days <= 365) {
    try {
      await storage.setHistoryDays(days);
      // History days saved; no console output to respect logging toggle
      // Refresh the history tab to reflect the new setting
      const panelElement = document.getElementById("nig-config-panel");
      if (
        panelElement &&
        panelElement
          .querySelector('.nig-tab[data-tab="history"]')
          .classList.contains("active")
      ) {
        await populateHistoryTab();
      }
    } catch (error) {
      console.error("Failed to auto-save history days setting:", error);
    }
  }
}
