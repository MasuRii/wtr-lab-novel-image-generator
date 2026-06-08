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
  widgetElement.innerHTML = `<div class="nig-status-icon"></div><span class="nig-status-text"></span>`;
  document.body.appendChild(widgetElement);
}

/**
 * Updates the state and content of the status widget.
 * @param {'hidden'|'loading'|'success'|'error'} state - The visual state of the widget.
 * @param {string} text - The text to display.
 * @param {function|null} [onClickHandler=null] - An optional click handler for the widget.
 */
export function update(state, text, onClickHandler = null) {
  if (!widgetElement) {
    return;
  }

  widgetElement.classList.remove("loading", "success", "error");
  widgetElement.onclick = onClickHandler;

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
}
