// --- IMPORTS ---
import * as storage from '../utils/storage.js';

// --- PUBLIC FUNCTIONS ---

/**
 * Populates the history tab with the user's generation history
 */
export async function populateHistoryTab() {
    const historyList = document.getElementById('nig-history-list');
    // Use the new getFilteredHistory function to respect the configured days setting
    const history = await storage.getFilteredHistory();
    
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li>No history yet.</li>';
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nig-history-item';

        const providerInfo = item.provider ? `<strong>${item.provider}</strong>` : '';
        const modelInfo = item.model ? `(${item.model})` : '';

        // Set the static part of the HTML
        li.innerHTML = `<small>${new Date(item.date).toLocaleString()} - ${providerInfo} ${modelInfo}</small>
                      <small><em>${item.prompt.substring(0, 70)}...</em></small>`;

        // Create the link element separately to add the event listener
        const viewLink = document.createElement('a');
        viewLink.href = '#'; // Use a non-navigating href
        viewLink.textContent = 'View Generated Image';

        viewLink.addEventListener('click', e => {
            e.preventDefault();
            // Use unified modal for all image types (both base64 and URL)
            import('./imageViewer.js').then(module => {
                if (typeof module.show === 'function') {
                    module.show([item.url], item.prompt, item.provider);
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
    const daysInput = document.getElementById('nig-history-clean-days').value;
    const days = parseInt(daysInput);
    
    // Validate the input
    if (isNaN(days) || days < 1 || days > 365) {
        alert('Please enter a valid number of days (1-365).');
        return;
    }
    
    try {
        // Save the days setting
        await storage.setHistoryDays(days);
        
        // Use the new cleanOldHistory function
        const removedCount = await storage.cleanOldHistory();
        
        if (removedCount > 0) {
            alert(`History cleaned successfully! Removed ${removedCount} old entries.`);
        } else {
            alert('History cleaned successfully! No old entries to remove.');
        }
        
        await populateHistoryTab();
    } catch (error) {
        console.error('Failed to clean history:', error);
        alert('Failed to clean history. Please try again.');
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
            console.log(`History days setting saved: ${days}`);
            // Refresh the history tab to reflect the new setting
            const panelElement = document.getElementById('nig-config-panel');
            if (panelElement && panelElement.querySelector('.nig-tab[data-tab="history"]').classList.contains('active')) {
                await populateHistoryTab();
            }
        } catch (error) {
            console.error('Failed to auto-save history days setting:', error);
        }
    }
}