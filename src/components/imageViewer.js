// Image Viewer Component
import { getScriptName } from '../utils/file.js';

export function create() {
	if (document.getElementById('nig-image-viewer')) return;

	const imageViewer = document.createElement('div');
	imageViewer.id = 'nig-image-viewer';
	imageViewer.className = 'nig-modal-overlay';
	imageViewer.style.display = 'none';
	imageViewer.innerHTML = `
		<div class="nig-modal-content">
			<span class="nig-close-btn">&times;</span>
			<div id="nig-prompt-container" class="nig-prompt-container">
				<div class="nig-prompt-header"><span>Generated Image Prompt</span></div>
				<p id="nig-prompt-text" class="nig-prompt-text"></p>
			</div>
			<div id="nig-image-gallery" class="nig-image-gallery"></div>
		</div>`;
	document.body.appendChild(imageViewer);
	imageViewer.querySelector('.nig-close-btn').addEventListener('click', () => {
		imageViewer.style.display = 'none';
		// Import updateSystemStatus dynamically to avoid circular dependency
		import('./statusWidget.js').then(module => {
			if (typeof module.updateSystemStatus === 'function') {
				// This will be handled by the main application
			}
		});
	});
	const promptContainer = imageViewer.querySelector('#nig-prompt-container');
	promptContainer.addEventListener('click', () => {
		promptContainer.classList.toggle('expanded');
	});
}

export function show(imageUrls, prompt, provider) {
	if (!document.getElementById('nig-image-viewer')) {
		create();
	}
	const imageViewer = document.getElementById('nig-image-viewer');
	const gallery = imageViewer.querySelector('#nig-image-gallery');
	gallery.innerHTML = '';
	const promptContainer = imageViewer.querySelector('#nig-prompt-container');
	const promptText = imageViewer.querySelector('#nig-prompt-text');
	promptText.textContent = prompt;
	promptContainer.classList.remove('expanded');
	const extension = provider === 'Pollinations' || provider === 'OpenAICompat' ? 'jpg' : 'png';
	imageUrls.forEach((url, index) => {
		const container = document.createElement('div');
		container.className = 'nig-image-container';
		const img = document.createElement('img');
		img.src = url;
		const actions = document.createElement('div');
		actions.className = 'nig-image-actions';
		const downloadBtn = document.createElement('button');
		downloadBtn.innerHTML = '<span class="material-symbols-outlined">download</span>';
		downloadBtn.title = 'Download';
		downloadBtn.onclick = () => {
			const a = document.createElement('a');
			a.href = url;
			const scriptName = getScriptName();
			const promptSnippet = prompt.substring(0, 20).replace(/\s/g, '_');
			a.download = `${scriptName}_${promptSnippet}_${index}.${extension}`;
			a.click();
		};
		const fullscreenBtn = document.createElement('button');
		fullscreenBtn.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';
		fullscreenBtn.title = 'Fullscreen';
		fullscreenBtn.onclick = () => {
			if (img.requestFullscreen) img.requestFullscreen();
		};
		actions.appendChild(downloadBtn);
		actions.appendChild(fullscreenBtn);
		container.appendChild(img);
		container.appendChild(actions);
		gallery.appendChild(container);
	});
	imageViewer.style.display = 'flex';
}

export function initialize() {
	create();
}