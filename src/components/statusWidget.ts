let widgetElement = null;

/**
 * Creates the status widget DOM element and appends it to the body.
 * This should only be called once during initialization.
 */
export function create() {
  if (widgetElement) {
    return;
  }

  widgetElement = document.createElement("div");
  widgetElement.id = "nig-status-widget";
  widgetElement.className = "nig-status-widget";
  widgetElement.innerHTML = `<div class="nig-status-icon"></div><span class="nig-status-text"></span><button type="button" class="nig-status-cancel" aria-label="Stop generation" title="Stop generation" style="display:none;cursor:pointer;margin-left:var(--nig-space-sm);font-weight:bold;background:transparent;border:none;color:inherit;font-size:var(--nig-font-size-base);padding:0 var(--nig-space-xs);line-height:1;flex-shrink:0;">✕</button>`;
  document.body.appendChild(widgetElement);
}

/**
 * Updates the state and content of the status widget.
 * @param {'hidden'|'loading'|'success'|'error'} state - The visual state of the widget.
 * @param {string} text - The text to display.
 * @param {function|null} [onClickHandler=null] - An optional click handler for the widget.
 * @param {function|null} [onCancel=null] - An optional cancel callback shown as a ✕ button during loading.
 */
export function update(state, text, onClickHandler = null, onCancel = null) {
  if (!widgetElement) {
    return;
  }

  widgetElement.classList.remove("loading", "success", "error");
  widgetElement.onclick = onClickHandler;

  const cancelBtn = widgetElement.querySelector(".nig-status-cancel");
  if (cancelBtn) {
    cancelBtn.style.display = "none";
    cancelBtn.onclick = null;
  }

  if (state === "hidden") {
    widgetElement.style.display = "none";
    return;
  }

  widgetElement.style.display = "flex";
  widgetElement.querySelector(".nig-status-text").textContent = text;
  widgetElement.classList.add(state);

  const icon = widgetElement.querySelector(".nig-status-icon");
  icon.innerHTML = ""; // Clear previous icon
  if (state === "success") {
    icon.innerHTML = "✅";
  } else if (state === "error") {
    icon.innerHTML = "❌";
  }

  // Show cancel button during loading when an onCancel handler is provided
  if (state === "loading" && onCancel && cancelBtn) {
    cancelBtn.style.display = "inline";
    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      onCancel();
    };
  }
}
