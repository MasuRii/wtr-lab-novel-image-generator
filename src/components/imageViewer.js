// Image Viewer Component
import { getScriptName } from "../utils/file.js";

/**
 * Helper function to determine if an image URL is base64 encoded
 * @param {string} url - The image URL to check
 * @returns {boolean} - True if the image is base64 encoded
 */
function isBase64Image(url) {
  return url.startsWith("data:");
}

/**
 * Helper function to validate if a URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function create() {
  if (document.getElementById("nig-image-viewer")) {
    return;
  }

  const imageViewer = document.createElement("div");
  imageViewer.id = "nig-image-viewer";
  imageViewer.className = "nig-modal-overlay";
  imageViewer.style.display = "none";
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
  imageViewer.querySelector(".nig-close-btn").addEventListener("click", () => {
    imageViewer.style.display = "none";
    // Import updateSystemStatus dynamically to avoid circular dependency
    import("./statusWidget.js").then((module) => {
      if (typeof module.updateSystemStatus === "function") {
        // This will be handled by the main application
      }
    });
  });
  const promptContainer = imageViewer.querySelector("#nig-prompt-container");
  promptContainer.addEventListener("click", () => {
    promptContainer.classList.toggle("expanded");
  });
}

export function show(imageUrls, prompt, provider, model = "Unknown") {
  if (!document.getElementById("nig-image-viewer")) {
    create();
  }
  const imageViewer = document.getElementById("nig-image-viewer");
  const gallery = imageViewer.querySelector("#nig-image-gallery");
  gallery.innerHTML = "";
  const promptContainer = imageViewer.querySelector("#nig-prompt-container");
  const promptText = imageViewer.querySelector("#nig-prompt-text");
  promptText.textContent = prompt;
  promptContainer.classList.remove("expanded");
  const extension =
    provider === "Pollinations" || provider === "OpenAICompat" ? "jpg" : "png";

  imageUrls.forEach((url, index) => {
    const container = document.createElement("div");
    container.className = "nig-image-container";
    const img = document.createElement("img");
    img.src = url;

    // Add loading state for URL images
    if (!isBase64Image(url)) {
      img.loading = "lazy";
      img.alt = "Generated image";

      // Add error handling for URL images
      img.onerror = () => {
        img.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
        img.alt = "Image not available";
      };

      // Add loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "nig-image-loading";
      loadingDiv.innerHTML = '<div class="nig-spinner"></div>';
      container.appendChild(loadingDiv);

      img.onload = () => {
        loadingDiv.remove();
      };
    }

    const actions = document.createElement("div");
    actions.className = "nig-image-actions";

    // Download button
    const downloadBtn = document.createElement("button");
    downloadBtn.innerHTML =
      '<span class="material-symbols-outlined">download</span>';
    downloadBtn.title = "Download Image";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      const scriptName = getScriptName();
      const providerName = provider
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_");
      const modelName = model.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
      const promptSnippet = prompt
        .substring(0, 15)
        .replace(/\s/g, "_")
        .replace(/[^\w_]/g, "");
      a.download = `${scriptName}_${providerName}_${modelName}_${promptSnippet}_${index + 1}.${extension}`;
      a.click();
    };

    // Fullscreen button
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.innerHTML =
      '<span class="material-symbols-outlined">fullscreen</span>';
    fullscreenBtn.title = "View Fullscreen";
    fullscreenBtn.onclick = () => {
      if (img.requestFullscreen) {
        img.requestFullscreen();
      }
    };

    // URL link button (only for URL images)
    const urlLinkBtn = document.createElement("button");
    if (!isBase64Image(url) && isValidUrl(url)) {
      urlLinkBtn.innerHTML =
        '<span class="material-symbols-outlined">link</span>';
      urlLinkBtn.title = "Open Image URL";
      urlLinkBtn.onclick = () => {
        window.open(url, "_blank");
      };
      actions.appendChild(urlLinkBtn);
    }

    actions.appendChild(downloadBtn);
    actions.appendChild(fullscreenBtn);
    container.appendChild(img);
    container.appendChild(actions);
    gallery.appendChild(container);
  });
  imageViewer.style.display = "flex";
}

export function initialize() {
  create();
}
