// Status Widget Component
export function create() {
	if (document.getElementById('nig-status-widget')) return;

	const statusWidget = document.createElement('div');
	statusWidget.id = 'nig-status-widget';
	statusWidget.className = 'nig-status-widget';
	statusWidget.innerHTML = `<div class="nig-status-icon"></div><span class="nig-status-text"></span>`;
	document.body.appendChild(statusWidget);
}

export function updateStatusWidget(state, text, onClickHandler = null) {
	const statusWidget = document.getElementById('nig-status-widget');
	if (!statusWidget) return;
	statusWidget.classList.remove('loading', 'success', 'error');
	statusWidget.onclick = onClickHandler;

	if (state === 'hidden') {
		statusWidget.style.display = 'none';
		return;
	}
	statusWidget.style.display = 'flex';
	statusWidget.querySelector('.nig-status-text').textContent = text;
	statusWidget.classList.add(state);
	const icon = statusWidget.querySelector('.nig-status-icon');
	icon.innerHTML = '';
	if (state === 'success') {
		icon.innerHTML = '✅';
	} else if (state === 'error') {
		icon.innerHTML = '❌';
	}
}

export function updateSystemStatus(completedQueue, generationQueue, isGenerating, currentGenerationStatusText, onShowImage = null) {
	if (completedQueue.length > 0) {
		const text = completedQueue.length === 1 ? '1 Image Ready! Click to view.' : `${completedQueue.length} Images Ready! Click to view.`;
		updateStatusWidget('success', text, () => {
			const result = completedQueue.shift();
			if (result && onShowImage) {
				onShowImage(result.imageUrls, result.prompt, result.provider);
			}
			updateSystemStatus(completedQueue, generationQueue, isGenerating, currentGenerationStatusText, onShowImage);
		});
	} else if (isGenerating || generationQueue.length > 0) {
		const queueText = generationQueue.length > 0 ? ` (Queue: ${generationQueue.length})` : '';
		updateStatusWidget('loading', `${currentGenerationStatusText}${queueText}`);
	} else {
		updateStatusWidget('hidden', '');
	}
}

export function initialize() {
	create();
}