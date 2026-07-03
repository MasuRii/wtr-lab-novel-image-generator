// ==UserScript==
// @name WTR LAB Novel Image Generator
// @description A powerful userscript to enhance web novel reading on WTR-LAB.COM. Select text to generate AI-powered images using multiple providers (Pollinations, AI Horde, OpenAI). Features AI prompt enhancement via OpenAI-compatible endpoints, 100+ art styles, a modern UI, history, and robust configuration options. Built with Webpack for modularity and maintainability.
// @version 6.3.1
// @author MasuRii
// @supportURL https://github.com/MasuRii/wtr-lab-novel-image-generator/issues
// @match https://wtr-lab.com/en/novel/*/*/*
// @connect *
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @icon https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license MIT
// @namespace http://tampermonkey.net/
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 565
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Base Typography ===
 * System fonts are used to avoid leaking @import Google Fonts into the
 * host page. Inter and Fira Code are listed as optional preferred fonts;
 * if the user has them installed locally they will be used, otherwise the
 * system font stack applies.
 */

/* === CSS Custom Properties (Design Tokens) === */
:root {
  /* Color Palette - Modern Dark Theme */
  --nig-color-bg-primary: #1a1a1e;
  --nig-color-bg-secondary: #2d2d32;
  --nig-color-bg-tertiary: #3a3a40;
  --nig-color-bg-elevated: #404046;
  --nig-color-text-primary: #f0f0f0;
  --nig-color-text-secondary: #b4b4b8;
  --nig-color-text-muted: #8a8a8e;
  --nig-color-border: #55555a;
  --nig-color-border-light: #6a6a6e;

  /* Accent Colors - success darkened from #10b981 to #047857 for WCAG AA contrast with white text (was ~2.5:1, now ~5.5:1) */
  --nig-color-accent-primary: #6366f1;
  --nig-color-accent-secondary: #8b5cf6;
  --nig-color-accent-success: #047857;
  --nig-color-accent-warning: #f59e0b;
  --nig-color-accent-error: #ef4444;

  /* Interactive States */
  --nig-color-hover-primary: #5855eb;
  --nig-color-hover-secondary: #7c3aed;
  --nig-color-hover-success: #065f46;
  --nig-color-hover-error: #dc2626;

  /* Spacing Scale */
  --nig-space-xs: 0.25rem;
  --nig-space-sm: 0.5rem;
  --nig-space-md: 0.75rem;
  --nig-space-lg: 1rem;
  --nig-space-xl: 1.5rem;
  --nig-space-2xl: 2rem;
  --nig-space-3xl: 3rem;

  /* Typography Scale */
  --nig-font-size-xs: 0.75rem;
  --nig-font-size-sm: 0.875rem;
  --nig-font-size-base: 1rem;
  --nig-font-size-lg: 1.125rem;
  --nig-font-size-xl: 1.25rem;
  --nig-font-size-2xl: 1.5rem;
  --nig-font-size-3xl: 1.875rem;

  /* Border Radius */
  --nig-radius-sm: 0.375rem;
  --nig-radius-md: 0.5rem;
  --nig-radius-lg: 0.75rem;
  --nig-radius-xl: 1rem;

  /* Shadows */
  --nig-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 30%);
  --nig-shadow-md:
    0 4px 6px -1px rgb(0 0 0 / 40%), 0 2px 4px -1px rgb(0 0 0 / 30%);
  --nig-shadow-lg:
    0 10px 15px -3px rgb(0 0 0 / 50%), 0 4px 6px -2px rgb(0 0 0 / 40%);
  --nig-shadow-xl:
    0 20px 25px -5px rgb(0 0 0 / 60%), 0 10px 10px -5px rgb(0 0 0 / 50%);

  /* Transitions */
  --nig-transition-fast: 0.15s ease-out;
  --nig-transition-normal: 0.2s ease-out;
  --nig-transition-slow: 0.3s ease-out;

  /* Breakpoints */
  --nig-breakpoint-sm: 640px;
  --nig-breakpoint-md: 768px;
  --nig-breakpoint-lg: 1024px;
  --nig-breakpoint-xl: 1280px;
}

/* === Print Styles === */
@media print {
  .nig-modal-overlay,
  .nig-status-widget,
  .nig-button {
    display: none !important;
  }

  .nig-modal-content {
    box-shadow: none;
    border: 1px solid #000;
    background: white;
    color: black;
  }
}

/* === High Contrast Mode Support ===
 * Use prefers-contrast: more for standards-aligned high contrast enhancement.
 */
@media (prefers-contrast: more) {
  :root {
    --nig-color-bg-primary: #000;
    --nig-color-bg-secondary: #1a1a1a;
    --nig-color-bg-tertiary: #2a2a2a;
    --nig-color-text-primary: #fff;
    --nig-color-border: #666;
  }
}

/* === Reduced Motion Support (scoped to userscript elements only) ===
 * The original global *,*::before,*::after selector leaked into the host
 * page and killed ALL site animations for reduced-motion users. Now scoped
 * to userscript containers only.
 */
@media (prefers-reduced-motion: reduce) {
  .nig-modal-overlay,
  .nig-modal-overlay *,
  .nig-modal-overlay *::before,
  .nig-modal-overlay *::after,
  .nig-status-widget,
  .nig-status-widget *,
  .nig-button,
  .nig-button *,
  .nig-toast-container,
  .nig-toast-container * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Material Symbols Import === */
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
  font-size: 18px;
}

/* === File Input Styling (scoped to userscript container) === */
.nig-modal-content input[type="file"] {
  border: 2px dashed var(--nig-color-border);
  background: var(--nig-color-bg-primary);
  padding: var(--nig-space-xl);
  border-radius: var(--nig-radius-lg);
  color: var(--nig-color-text-secondary);
  transition:
    border-color var(--nig-transition-normal),
    background var(--nig-transition-normal);
  cursor: pointer;
}

.nig-modal-content input[type="file"]:hover {
  border-color: var(--nig-color-accent-primary);
  background: var(--nig-color-bg-elevated);
}

.nig-modal-content input[type="file"]:focus {
  outline: none;
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 754
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Base Components === */
/* Generate Image button — styled after the site's native floating action button
 * (card surface + accent border/text, soft shadow, hover tint) so it blends
 * with the host UI. Hidden by default; shown as inline-flex near the current
 * text selection. */
.nig-button {
  position: absolute;
  z-index: 99998;
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2rem;
  padding: 0.625rem 1.25rem;
  background-color: #ffffff;
  color: var(--nig-color-accent-primary);
  border: 1px solid var(--nig-color-accent-primary);
  border-radius: 0.375rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 600;
  line-height: 1;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  transition:
    box-shadow var(--nig-transition-normal),
    background-color var(--nig-transition-normal);
}

.nig-button:hover {
  background-color: rgb(99 102 241 / 10%);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 15%),
    0 4px 6px -4px rgb(0 0 0 / 15%);
}

.nig-button:active {
  box-shadow:
    0 2px 4px -1px rgb(0 0 0 / 10%);
}

.nig-button svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Dark site theme: switch the card surface to match the site's dark card. */
html.dark .nig-button,
body.dark .nig-button {
  background-color: #1f2129;
}

/* === Modal Components === */
.nig-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--nig-space-lg);
}

.nig-modal-content {
  background: var(--nig-color-bg-secondary);
  color: var(--nig-color-text-primary);
  padding: var(--nig-space-2xl);
  border-radius: var(--nig-radius-xl);
  box-shadow: var(--nig-shadow-xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  border: 1px solid var(--nig-color-border);
  animation: nig-modal-appear 0.2s ease-out;
}

@keyframes nig-modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.nig-modal-content li {
  margin-bottom: var(--nig-space-md);
}

.nig-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  font-size: var(--nig-font-size-2xl);
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  color: var(--nig-color-text-muted);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--nig-radius-md);
  transition:
    color var(--nig-transition-fast),
    background var(--nig-transition-fast);
}

.nig-close-btn:hover,
.nig-close-btn:focus-visible {
  color: var(--nig-color-text-primary);
  background: var(--nig-color-bg-tertiary);
}

.nig-close-btn:focus-visible {
  outline: 2px solid var(--nig-color-accent-primary);
  outline-offset: 2px;
}

.nig-modal-content h2 {
  margin-top: 0;
  border-bottom: 1px solid var(--nig-color-border);
  padding-bottom: var(--nig-space-lg);
  font-size: var(--nig-font-size-2xl);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.nig-version-badge {
  display: inline-block;
  font-size: var(--nig-font-size-xs);
  font-weight: 500;
  color: var(--nig-color-text-muted);
  background: var(--nig-color-bg-tertiary);
  padding: 2px var(--nig-space-sm);
  border-radius: var(--nig-radius-sm);
  margin-left: var(--nig-space-sm);
  vertical-align: middle;
  letter-spacing: 0;
  white-space: nowrap;
}

/* === Form Elements === */
.nig-form-group {
  margin-bottom: var(--nig-space-xl);
}

.nig-form-group label {
  display: block;
  margin-bottom: var(--nig-space-sm);
  font-weight: 500;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
}

.nig-form-group small.nig-hint {
  color: var(--nig-color-text-muted);
  font-weight: normal;
  display: block;
  margin-top: var(--nig-space-sm);
  margin-bottom: var(--nig-space-sm);
  min-height: 1.2em;
  font-size: var(--nig-font-size-xs);
  line-height: 1.4;
}

.nig-form-group input,
.nig-form-group select,
.nig-form-group textarea {
  width: 100%;
  padding: var(--nig-space-sm) var(--nig-space-md);
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  transition:
    border-color var(--nig-transition-fast),
    box-shadow var(--nig-transition-fast),
    background var(--nig-transition-fast);
  outline: none;
}

.nig-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nig-space-lg);
}

.nig-checkbox-group label {
  display: flex;
  align-items: center;
  margin-right: 0;
  font-weight: normal;
  cursor: pointer;
  color: var(--nig-color-text-secondary);
}

.nig-checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: var(--nig-space-sm);
  margin-bottom: 0;
  transform: scale(1.1);
}

.nig-form-group input:focus,
.nig-form-group select:focus,
.nig-form-group textarea:focus {
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
  background: var(--nig-color-bg-elevated);
}

.nig-form-group select:disabled {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
  cursor: not-allowed;
}

.nig-form-group-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--nig-space-lg);
  align-items: end;
}

.nig-form-group-inline label {
  margin-bottom: var(--nig-space-sm);
}

/* A direct group label (e.g. "Dimensions (Width × Height)") is itself a grid
 * item. Span it across all columns so it sits above its paired inputs instead
 * of taking a column beside them — fixes the misalignment visible on
 * tablet/desktop (1fr 1fr / auto-fit) where the label ended up next to the
 * first input. Nested labels inside the input cells are unaffected. */
.nig-form-group-inline > label {
  grid-column: 1 / -1;
}

/* Password / API key visibility wrapper */
.nig-password-wrapper {
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
}

.nig-password-wrapper input[type="password"],
.nig-password-wrapper input[type="text"] {
  flex: 1;
}

.nig-password-toggle {
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--nig-color-text-muted);
  transition:
    color var(--nig-transition-fast),
    transform var(--nig-transition-fast);
}

.nig-password-toggle:hover,
.nig-password-toggle:focus-visible {
  color: var(--nig-color-accent-primary);
  transform: scale(1.05);
  outline: none;
}

.nig-password-toggle .material-symbols-outlined {
  font-size: 20px;
}

/* === Button Components === */
.nig-save-btn {
  background: var(--nig-color-accent-success);
  color: white;
  padding: var(--nig-space-md) var(--nig-space-xl);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-base);
  font-weight: 500;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
}

.nig-save-btn:hover {
  background: var(--nig-color-hover-success);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-fetch-models-btn {
  padding: var(--nig-space-sm) var(--nig-space-md);
  margin-left: 0;
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-accent-primary);
  color: white;
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal);
}

.nig-fetch-models-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
}

.nig-delete-btn {
  padding: var(--nig-space-sm) var(--nig-space-md);
  margin-left: 0;
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-accent-error);
  color: white;
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal);
}

.nig-delete-btn:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
}

.nig-history-cleanup-btn {
  background: var(--nig-color-accent-error);
  color: white;
  padding: var(--nig-space-sm) var(--nig-space-md);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
}

.nig-history-cleanup-btn:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
}

.nig-retry-btn {
  background: var(--nig-color-accent-primary);
  color: white;
  padding: var(--nig-space-md) var(--nig-space-xl);
  border: none;
  border-radius: var(--nig-radius-md);
  cursor: pointer;
  font-size: var(--nig-font-size-base);
  font-weight: 500;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
}

.nig-retry-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-override-btn {
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-sm) var(--nig-space-md);
  font-size: var(--nig-font-size-sm);
  cursor: pointer;
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal);
  align-self: flex-start;
}

.nig-override-btn:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
}

.nig-template-btn {
  background: var(--nig-color-bg-elevated);
  border: 1px solid var(--nig-color-border);
  color: var(--nig-color-text-secondary);
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
  cursor: pointer;
  transition:
    background var(--nig-transition-fast),
    color var(--nig-transition-fast),
    border-color var(--nig-transition-fast);
}

.nig-template-btn:hover {
  background: var(--nig-color-accent-primary);
  color: white;
  border-color: var(--nig-color-accent-primary);
}

/* === Button Footer === */
.nig-button-footer {
  margin-top: var(--nig-space-3xl);
  padding-top: var(--nig-space-xl);
  border-top: 1px solid var(--nig-color-border);
  text-align: center;
}

/* === Toast Notifications (alert replacement) === */
.nig-toast-container {
  position: fixed;
  bottom: var(--nig-space-xl);
  right: var(--nig-space-xl);
  z-index: 100100;
  display: flex;
  flex-direction: column;
  gap: var(--nig-space-sm);
  pointer-events: none;
  max-width: 380px;
}

.nig-toast {
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
  padding: 0.625rem 1rem;
  background-color: #ffffff;
  color: #1f2937;
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: var(--nig-font-size-sm);
  pointer-events: auto;
  opacity: 0;
  transform: translateX(20px);
  transition:
    opacity var(--nig-transition-normal),
    transform var(--nig-transition-normal),
    background-color var(--nig-transition-normal);
}

/* Dark site theme: adapt the toast card surface, text, and border. */
html.dark .nig-toast,
body.dark .nig-toast {
  background-color: #1f2129;
  color: #e2e8f0;
  border-color: rgb(255 255 255 / 10%);
}

.nig-toast.nig-toast-visible {
  opacity: 1;
  transform: translateX(0);
}

.nig-toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.nig-toast.nig-toast-success {
  border-color: #10b981;
}

.nig-toast-success .nig-toast-icon {
  color: #10b981;
}

.nig-toast.nig-toast-error {
  border-color: var(--nig-color-accent-error);
}

.nig-toast-error .nig-toast-icon {
  color: var(--nig-color-accent-error);
}

.nig-toast.nig-toast-info {
  border-color: var(--nig-color-accent-primary);
}

.nig-toast-info .nig-toast-icon {
  color: var(--nig-color-accent-primary);
}

.nig-toast-text {
  flex: 1;
  min-width: 0;
  line-height: 1.4;
  overflow-wrap: break-word;
}

.nig-toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: var(--nig-color-text-muted);
  font-size: var(--nig-font-size-lg);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--nig-radius-sm);
  line-height: 1;
}

.nig-toast-close:hover,
.nig-toast-close:focus-visible {
  color: var(--nig-color-text-primary);
  background: var(--nig-color-bg-tertiary);
  outline: none;
}

.nig-toast-close:focus-visible {
  outline: 2px solid var(--nig-color-accent-primary);
  outline-offset: 1px;
}

/* === Confirm/Prompt Dialog Actions === */
.nig-confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--nig-space-md);
  margin-top: var(--nig-space-lg);
}

.nig-confirm-message {
  color: var(--nig-color-text-secondary);
  line-height: 1.6;
  margin: var(--nig-space-md) 0;
}

.nig-prompt-label {
  display: block;
  margin-bottom: var(--nig-space-sm);
  font-weight: 500;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
}

.nig-prompt-input {
  width: 100%;
  padding: var(--nig-space-sm) var(--nig-space-md);
  border-radius: var(--nig-radius-md);
  border: 1px solid var(--nig-color-border);
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  outline: none;
  transition:
    border-color var(--nig-transition-fast),
    box-shadow var(--nig-transition-fast);
}

.nig-prompt-input:focus {
  border-color: var(--nig-color-accent-primary);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
}

/* === Error Modal Hint === */
.nig-error-hint {
  margin-top: var(--nig-space-md);
  padding: var(--nig-space-md) var(--nig-space-lg);
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-accent-warning);
  border-radius: var(--nig-radius-md);
  color: var(--nig-color-accent-warning);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 784
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Tab System === */
.nig-tabs {
  display: flex;
  border-bottom: 1px solid var(--nig-color-border);
  margin-bottom: var(--nig-space-xl);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nig-tabs::-webkit-scrollbar {
  display: none;
}

.nig-tab {
  padding: var(--nig-space-md) var(--nig-space-xl);
  cursor: pointer;
  border-radius: var(--nig-radius-md) var(--nig-radius-md) 0 0;
  background: transparent;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition:
    background var(--nig-transition-fast),
    color var(--nig-transition-fast),
    border-color var(--nig-transition-fast);
  white-space: nowrap;
  border: 1px solid transparent;
  border-bottom: none;
}

.nig-tab:hover {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
}

.nig-tab.active {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-primary);
  border: 1px solid var(--nig-color-border);
  border-bottom: 1px solid var(--nig-color-bg-tertiary);
  box-shadow: 0 -2px 0 var(--nig-color-accent-primary) inset;
}

.nig-tab-content {
  display: none;
  animation: nig-content-fade 0.2s ease-out;
}

.nig-tab-content.active {
  display: block;
}

@keyframes nig-content-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Image Gallery === */
.nig-image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--nig-space-xl);
  margin-top: var(--nig-space-xl);
}

.nig-image-container {
  position: relative;
  border-radius: var(--nig-radius-lg);
  overflow: hidden;
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  transition:
    box-shadow var(--nig-transition-normal),
    transform var(--nig-transition-normal),
    border-color var(--nig-transition-normal);
}

.nig-image-container:hover {
  box-shadow: var(--nig-shadow-lg);
  transform: translateY(-2px);
}

.nig-image-container img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform var(--nig-transition-slow);
}

.nig-image-container:hover img {
  transform: scale(1.02);
}

.nig-image-actions {
  position: absolute;
  top: var(--nig-space-md);
  right: var(--nig-space-md);
  display: flex;
  gap: var(--nig-space-sm);
  background: rgb(0 0 0 / 70%);
  backdrop-filter: blur(6px);
  padding: var(--nig-space-sm);
  border-radius: var(--nig-radius-md);
  opacity: 0.85;
  transition: opacity var(--nig-transition-normal);
}

.nig-image-container:hover .nig-image-actions {
  opacity: 1;
}

.nig-image-actions button {
  background: rgb(0 0 0 / 80%);
  border: none;
  border-radius: var(--nig-radius-md);
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--nig-font-size-base);
  color: white;
  transition:
    background var(--nig-transition-fast),
    transform var(--nig-transition-fast);
}

.nig-image-actions button:hover {
  background: white;
  transform: scale(1.1);
}

/* === URL Link Button Styling === */
.nig-image-actions button[title="Open Image URL"] {
  background: rgb(99 102 241 / 90%);
}

.nig-image-actions button[title="Open Image URL"]:hover {
  background: var(--nig-color-accent-primary);
}

/* === History System === */
.nig-history-list {
  list-style: none;
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.nig-history-item {
  background: var(--nig-color-bg-tertiary);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-bottom: var(--nig-space-md);
  border: 1px solid var(--nig-color-border);
  transition:
    border-color var(--nig-transition-fast),
    box-shadow var(--nig-transition-fast);
}

.nig-history-item:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-sm);
}

.nig-history-item small {
  display: block;
  color: var(--nig-color-text-muted);
  margin-bottom: var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
}

.nig-history-item a {
  color: var(--nig-color-accent-primary);
  text-decoration: none;
  word-break: break-all;
  font-weight: 500;
  transition: color var(--nig-transition-fast);
}

/* History prompt: use up to 2 lines, full width, then ellipsis */
.nig-history-prompt {
  margin-bottom: var(--nig-space-xs);
  font-size: var(--nig-font-size-sm);

  /* Use a contrast-safe token for history prompts (was hardcoded #d0d0d0a6 which failed WCAG AA) */
  color: var(--nig-color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.nig-history-prompt-empty {
  color: var(--nig-color-text-muted);
  font-style: italic;
}

.nig-history-item a:hover {
  color: var(--nig-color-hover-primary);
}

/* === Panel Configuration Grid Layout === */
.nig-config-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--nig-space-xl);
}

.nig-config-section {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
}

.nig-provider-container {
  display: grid;
  gap: var(--nig-space-lg);
}

.nig-provider-header {
  margin-bottom: var(--nig-space-lg);
  padding-bottom: var(--nig-space-lg);
  border-bottom: 1px solid var(--nig-color-border);
}

.nig-provider-header h3 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
}

.nig-provider-header p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-provider-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

.nig-provider-settings {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  transition:
    border-color var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal);
}

.nig-provider-settings:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-sm);
}

.nig-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

/* === Styling Tab Layout === */
.nig-styling-container {
  display: grid;
  gap: var(--nig-space-xl);
}

.nig-styling-intro {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
}

.nig-styling-intro p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.6;
}

.nig-style-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--nig-space-xl);
}

.nig-style-section {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
}

.nig-section-header {
  margin-bottom: var(--nig-space-lg);
  padding-bottom: var(--nig-space-lg);
  border-bottom: 1px solid var(--nig-color-border);
}

.nig-section-header h4 {
  margin: 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

/* === History Tab Layout === */
.nig-history-container {
  display: grid;
  gap: var(--nig-space-xl);
}

.nig-history-cleanup {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  display: grid;
  gap: var(--nig-space-lg);
}

.nig-cleanup-info h4 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

.nig-cleanup-info p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-cleanup-controls {
  display: flex;
  align-items: center;
  gap: var(--nig-space-md);
}

.nig-cleanup-controls label {
  color: var(--nig-color-text-primary);
  font-weight: 500;
  font-size: var(--nig-font-size-sm);
}

.nig-cleanup-controls input[type="number"] {
  width: 80px;
  padding: var(--nig-space-sm);
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-md);
  color: var(--nig-color-text-primary);
}

/* === Provider Priority Info === */
.nig-provider-priority-info {
  background: var(--nig-color-bg-primary);
  border: 1px solid var(--nig-color-accent-warning);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-lg);
  margin-bottom: var(--nig-space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--nig-space-md);
}

.nig-priority-header {
  display: flex;
  align-items: center;
  gap: var(--nig-space-sm);
  color: var(--nig-color-accent-warning);
  font-weight: 600;
  font-size: var(--nig-font-size-sm);
}

/* === Prompt Container === */
.nig-prompt-container {
  background: var(--nig-color-bg-tertiary);
  border-radius: var(--nig-radius-md);
  margin-bottom: var(--nig-space-lg);
  border: 1px solid var(--nig-color-border);
  transition:
    border-color var(--nig-transition-normal),
    background var(--nig-transition-normal);
  overflow: hidden;
}

.nig-prompt-header {
  padding: var(--nig-space-lg);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  user-select: none;
  color: var(--nig-color-text-primary);
  transition:
    color var(--nig-transition-fast),
    background var(--nig-transition-fast);
  position: relative;
  z-index: 1;
}

.nig-prompt-header:hover {
  color: var(--nig-color-accent-primary);
  background: var(--nig-color-bg-primary);
}

.nig-prompt-header::before {
  content: "▸";
  margin-right: var(--nig-space-md);
  transition:
    transform var(--nig-transition-normal),
    color var(--nig-transition-normal);
  color: var(--nig-color-text-muted);
  font-size: 14px;
  display: inline-block;
}

.nig-prompt-container.expanded .nig-prompt-header::before {
  transform: rotate(90deg);
  color: var(--nig-color-accent-primary);
}

.nig-prompt-text {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 var(--nig-space-lg);
  border-top: 1px solid transparent;
  overflow-wrap: break-word;
  color: var(--nig-color-text-secondary);
  line-height: 1.6;
  transition:
    max-height var(--nig-transition-normal),
    opacity var(--nig-transition-normal),
    padding var(--nig-transition-normal),
    border-top-color var(--nig-transition-normal),
    overflow var(--nig-transition-normal);
}

/* When expanded, show full prompt inside a scrollable area.
 * - Uses a fixed max-height with overflow-y: auto to avoid truncation.
 * - Keeps existing look-and-feel and arrow behavior.
 * - Allows mouse wheel, touch, and keyboard scrolling within the prompt area.
 */
.nig-prompt-container.expanded .nig-prompt-text {
  max-height: 260px;
  opacity: 1;
  padding: var(--nig-space-lg);
  border-top-color: var(--nig-color-border);
  overflow-y: auto;
}

/* Ensure prompt text uses pre-wrap so multi-line prompts (with newlines) are preserved,
 * and that very long tokens still wrap without breaking layout.
 */
#nig-prompt-text.nig-prompt-text {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

@keyframes nig-expand {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
}

/* === Additional Layout Utilities === */

.nig-api-prompt-link {
  color: var(--nig-color-accent-primary);
  text-decoration: none;
  transition: color var(--nig-transition-fast);
}

.nig-api-prompt-link:hover {
  color: var(--nig-color-hover-primary);
  text-decoration: underline;
}

/* Override for History Tab Cleaner number input width on mobile.
   Ensures #nig-history-clean-days remains compact even if external CSS applies width: 100%. */
@media (width <= 767px) {
  .nig-history-cleanup input[type="number"]#nig-history-clean-days {
    width: 80px;
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 249
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(565);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(754);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(92);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(784);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(484);
// Imports







var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_css__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Novel Image Generator - Main CSS Module ===
 * This file imports all CSS modules to maintain functionality
 * while providing better organization and maintainability.
 */

/* Import all CSS modules in proper order for cascade and specificity */

/* CSS Modules Structure:
 * - base.css: CSS custom properties, typography, fonts, and base styles
 * - components.css: UI components like buttons, modals, forms, and interactive elements
 * - utilities.css: Utility classes, status widgets, and helper functions
 * - layout.css: Layout systems, grids, tabs, image gallery, and responsive grids
 * - themes.css: Responsive design, media queries, and theme-specific styles
 */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 484
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Responsive Design === */

/* Mobile First Base (up to 767px) */
@media (width <= 767px) {
  .nig-modal-content {
    margin: var(--nig-space-md);
    padding: var(--nig-space-xl);
    max-height: 95vh;
    border-radius: var(--nig-radius-lg);
  }

  .nig-modal-overlay {
    padding: var(--nig-space-sm);
  }

  .nig-button {
    position: fixed;
    bottom: var(--nig-space-3xl);
    left: 50% !important;
    transform: translateX(-50%);
    top: auto !important;
    padding: var(--nig-space-sm) var(--nig-space-lg);
    font-size: var(--nig-font-size-sm);
    z-index: 100001;
    min-height: 44px; /* Touch target */
    border-radius: var(--nig-radius-lg);
  }

  .nig-button:hover {
    /* Prevent hover movement on mobile - maintain centering */
    transform: translateX(-50%);
    background-color: rgb(99 102 241 / 10%);
  }

  .nig-tabs {
    margin: 0 calc(-1 * var(--nig-space-xl)) var(--nig-space-xl)
      calc(-1 * var(--nig-space-xl));
    padding: 0 var(--nig-space-xl);
  }

  .nig-tab {
    padding: var(--nig-space-md) var(--nig-space-lg);
    font-size: var(--nig-font-size-xs);
  }

  .nig-form-group-inline {
    grid-template-columns: 1fr;
    gap: var(--nig-space-md);
  }

  .nig-checkbox-group {
    flex-direction: column;
    gap: var(--nig-space-sm);
  }

  .nig-checkbox-group label {
    justify-content: flex-start;
  }

  .nig-utilities-grid {
    grid-template-columns: 1fr;
    gap: var(--nig-space-lg);
  }

  .nig-utility-card {
    padding: var(--nig-space-lg);
  }

  .nig-card-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--nig-space-sm);
  }

  .nig-card-secondary-actions {
    grid-template-columns: 1fr;
    gap: var(--nig-space-sm);
  }

  .nig-card-footer {
    text-align: center;
  }

  .nig-history-cleanup {
    flex-direction: column;
    align-items: stretch;
    gap: var(--nig-space-md);
  }

  .nig-history-cleanup input[type="number"] {
    width: 100%;
  }

  .nig-status-widget {
    bottom: var(--nig-space-lg);
    left: var(--nig-space-md);
    padding: var(--nig-space-md);
    font-size: var(--nig-font-size-xs);
  }

  .nig-image-gallery {
    grid-template-columns: 1fr;
    gap: var(--nig-space-lg);
  }

  .nig-modal-content h2 {
    font-size: var(--nig-font-size-xl);
    padding-right: 48px; /* Space for close button */
  }

  /* Mobile Enhancement Styles */
  .nig-enhancement-status {
    margin-left: 0;
    margin-top: var(--nig-space-sm);
    align-self: flex-start;
  }
}

/* Tablet (768px to 1023px) */
@media (width >= 768px) and (width <= 1023px) {
  .nig-modal-content {
    max-width: 700px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .nig-image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(2, 1fr);
  }

  .nig-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-cleanup-controls {
    justify-content: flex-start;
  }
}

/* Desktop (1024px and up) */
@media (width >= 1024px) {
  .nig-modal-content {
    max-width: 760px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .nig-image-gallery {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .nig-form-group-inline {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .nig-form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-settings:hover {
    transform: translateY(-2px);
    box-shadow: var(--nig-shadow-md);
  }

  /* Enhanced hover states for desktop */
  .nig-tab:hover {
    background: var(--nig-color-bg-tertiary);
  }

  .nig-history-item:hover {
    transform: translateY(-1px);
  }
}

/* Large Desktop (1280px and up) */
@media (width >= 1280px) {
  .nig-modal-content {
    max-width: 820px;
  }

  .nig-utilities-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .nig-config-grid {
    grid-template-columns: 1fr;
  }

  .nig-provider-controls {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  .nig-style-grid {
    grid-template-columns: 1fr;
  }

  .nig-styling-container {
    grid-template-columns: 1fr;
  }
}

/* === Error Modal === */
#nig-error-reason {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-top: var(--nig-space-sm);
  max-height: 150px;
  overflow-y: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Fira Code", Monaco, Consolas, monospace;
  color: var(--nig-color-text-primary);
  line-height: 1.5;
}

.nig-error-prompt {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  padding: var(--nig-space-lg);
  border-radius: var(--nig-radius-md);
  margin-top: var(--nig-space-lg);
  max-height: 200px;
  overflow-y: auto;
  overflow-wrap: break-word;
  font-family: "Fira Code", Monaco, Consolas, monospace;
  width: 100%;
  resize: vertical;
  min-height: 80px;
  color: var(--nig-color-text-primary);
  line-height: 1.5;
}

.nig-error-actions {
  margin-top: var(--nig-space-xl);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 92
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* === Modern Utilities Tab === */
.nig-utilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--nig-space-xl);
  margin-top: var(--nig-space-xl);
}

.nig-utility-card {
  background: var(--nig-color-bg-tertiary);
  border: 1px solid var(--nig-color-border);
  border-radius: var(--nig-radius-lg);
  padding: var(--nig-space-xl);
  transition:
    border-color var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal),
    transform var(--nig-transition-normal);
}

.nig-utility-card:hover {
  border-color: var(--nig-color-border-light);
  box-shadow: var(--nig-shadow-md);
  transform: translateY(-2px);
}

.nig-utility-card h4 {
  margin: 0 0 var(--nig-space-md) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
}

.nig-utility-card p {
  margin: 0 0 var(--nig-space-lg) 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-utility-card .nig-save-btn {
  width: 100%;
  justify-content: center;
}

/* === Enhanced Utility Card Structure === */
.nig-card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--nig-space-md);
  margin-bottom: var(--nig-space-lg);
}

.nig-card-title {
  flex: 1;
  min-width: 0;
}

.nig-card-title h4 {
  margin: 0 0 var(--nig-space-sm) 0;
  color: var(--nig-color-text-primary);
  font-size: var(--nig-font-size-lg);
  font-weight: 600;
  line-height: 1.3;
}

.nig-card-title p {
  margin: 0;
  color: var(--nig-color-text-secondary);
  font-size: var(--nig-font-size-sm);
  line-height: 1.5;
}

.nig-card-actions {
  margin-bottom: var(--nig-space-lg);
}

.nig-card-secondary-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--nig-space-sm);
  margin-bottom: var(--nig-space-lg);
}

.nig-card-footer {
  padding-top: var(--nig-space-md);
  border-top: 1px solid var(--nig-color-border);
  margin-top: auto;
}

/* === Modern Button Variants === */
.nig-btn-primary {
  width: 100%;
  background: var(--nig-color-accent-warning);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-md) var(--nig-space-lg);
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-sm);
  transition:
    background var(--nig-transition-normal),
    color var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.nig-btn-primary:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--nig-shadow-sm);
}

.nig-btn-secondary {
  background: var(--nig-color-accent-primary);
  color: white;
  border: none;
  border-radius: var(--nig-radius-md);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  font-size: var(--nig-font-size-xs);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--nig-space-xs);
  transition:
    background var(--nig-transition-normal),
    transform var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal);
  box-shadow: var(--nig-shadow-sm);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  min-height: 36px;
}

.nig-btn-secondary:hover {
  background: var(--nig-color-hover-primary);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-secondary:active {
  transform: translateY(0);
  box-shadow: var(--nig-shadow-sm);
}

.nig-btn-secondary.nig-btn-error {
  background: var(--nig-color-accent-error);
  color: white;
}

.nig-btn-secondary.nig-btn-error:hover {
  background: var(--nig-color-hover-error);
  transform: translateY(-1px);
  box-shadow: var(--nig-shadow-md);
}

.nig-btn-secondary .material-symbols-outlined {
  font-size: var(--nig-font-size-xs);
}

.nig-btn-primary .material-symbols-outlined {
  font-size: var(--nig-font-size-sm);
}

/* === Status Widget === */
.nig-status-widget {
  position: fixed;
  bottom: var(--nig-space-xl);
  left: var(--nig-space-xl);
  z-index: 1020;
  display: none;
  align-items: center;
  gap: var(--nig-space-md);
  max-width: calc(100vw - 2 * var(--nig-space-xl));
  padding: 0.625rem 1rem;
  background-color: #ffffff;
  color: #1f2937;
  border: 1px solid rgb(0 0 0 / 10%);
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: var(--nig-font-size-sm);
  font-weight: 500;
  transition:
    background-color var(--nig-transition-normal),
    box-shadow var(--nig-transition-normal),
    border-color var(--nig-transition-normal);
}

/* Dark site theme: adapt the card surface, text, and border to match the
 * site's dark card (same approach as the Generate button). */
html.dark .nig-status-widget,
body.dark .nig-status-widget {
  background-color: #1f2129;
  color: #e2e8f0;
  border-color: rgb(255 255 255 / 10%);
}

.nig-status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nig-status-widget.loading .nig-status-icon {
  box-sizing: border-box;
  border: 2px solid var(--nig-color-text-muted);
  border-top-color: var(--nig-color-accent-primary);
  border-radius: 50%;
  animation: nig-spin 1s linear infinite;
}

.nig-status-widget.success {
  border-color: #10b981;
  cursor: pointer;
}

.nig-status-widget.success:hover {
  background-color: rgb(16 185 129 / 10%);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 15%),
    0 4px 6px -4px rgb(0 0 0 / 15%);
}

.nig-status-widget.error {
  border-color: var(--nig-color-accent-error);
}

@keyframes nig-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* === Loading Animations === */
.nig-image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.nig-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgb(255 255 255 / 30%);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: nig-spin 1s linear infinite;
}

/* === Enhancement Status & Priority Utilities === */
.nig-enhancement-status {
  display: inline-flex;
  align-items: center;
  gap: var(--nig-space-sm);
  padding: var(--nig-space-xs) var(--nig-space-sm);
  border-radius: var(--nig-radius-md);
  font-size: var(--nig-font-size-xs);
  font-weight: 500;
  margin-left: var(--nig-space-md);
}

.nig-enhancement-status.provider-priority {
  background: var(--nig-color-accent-warning);
  color: white;
}

.nig-enhancement-status.external-ai {
  background: var(--nig-color-accent-primary);
  color: white;
}

.nig-enhancement-status.disabled {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
}

.nig-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nig-color-text-muted);
  opacity: 0.6;
  transition:
    background var(--nig-transition-fast),
    opacity var(--nig-transition-fast);
}

/* State-specific indicator colors (JS sets these classes on the indicator) */
.nig-status-indicator.provider-active {
  background: var(--nig-color-accent-warning);
  opacity: 1;
}

.nig-status-indicator.external-active {
  background: var(--nig-color-accent-primary);
  opacity: 1;
}

.nig-status-indicator.disabled {
  background: var(--nig-color-text-muted);
  opacity: 0.4;
}

/* === Enhancement Settings States === */
.nig-enhancement-settings {
  transition: opacity var(--nig-transition-normal);
}

/* Disabled state: pointer-events + opacity for visual feedback.
 * JS also sets tabindex=-1 and aria-disabled on inputs to remove them
 * from the keyboard tab order (finding #20). */
.nig-enhancement-settings.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nig-enhancement-settings.disabled .nig-form-group input,
.nig-enhancement-settings.disabled .nig-form-group select,
.nig-enhancement-settings.disabled .nig-form-group textarea {
  background: var(--nig-color-bg-tertiary);
  color: var(--nig-color-text-muted);
  cursor: not-allowed;
}

/* === Modal Overlay Z-Index Hierarchy === */

/* Config Panel - Lower z-index */
#nig-config-panel.nig-modal-overlay {
  z-index: 99998;
}

/* Image Viewer - Higher z-index than config panel */
#nig-image-viewer.nig-modal-overlay {
  z-index: 99999;
}

/* Image Viewer — widen the modal on tablet/desktop so generated images can
 * expand to the available viewport size instead of being constrained to the
 * narrower config-panel width. Mobile (<768px) keeps its full-width layout. */
@media (width >= 768px) {
  #nig-image-viewer .nig-modal-content {
    max-width: min(95vw, 1280px);
  }
}

/* Make generated images expand to the largest size that fits: each grid cell
 * is at least 600px (capped to 100% on narrow screens). auto-fit collapses
 * empty tracks, so a single image fills the whole modal width and multiple
 * images form large columns rather than tiny thumbnails. */
#nig-image-viewer .nig-image-gallery {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 600px), 1fr));
}

/* Navigation Tabs - Higher than status widget, lower than modals */
.nig-tabs {
  z-index: 1000;
  position: relative;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ 314
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ 601
(module) {



module.exports = function (i) {
  return i[1];
};

/***/ },

/***/ 72
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ 659
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ 540
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ 56
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ 825
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ 113
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ 770
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CB: () => (/* binding */ deleteSelectedOpenAIProfile),
/* harmony export */   VM: () => (/* binding */ fetchOpenAICompatModels),
/* harmony export */   Yl: () => (/* binding */ saveProviderConfigs),
/* harmony export */   jG: () => (/* binding */ loadEnhancementModels),
/* harmony export */   populateProviderForms: () => (/* binding */ populateProviderForms),
/* harmony export */   tH: () => (/* binding */ loadSelectedOpenAIProfile),
/* harmony export */   xE: () => (/* binding */ fetchEnhancementModels)
/* harmony export */ });
/* unused harmony exports parsePollinationsModelsResponse, fetchPollinationsModels, fetchAIHordeModels, groupAIHordeModels, loadCachedOpenAICompatModels, loadOpenAIProfiles, buildEnhancementModelsRequest, isZenFreeModel, isZenEndpoint, parseEnhancementModelsResponse */
/* harmony import */ var _utils_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(165);
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(201);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(187);
/* harmony import */ var _utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(511);
// --- IMPORTS ---




// --- PUBLIC FUNCTIONS ---
const POLLINATIONS_DEFAULT_MODEL = "zimage";
const POLLINATIONS_LEGACY_ALIASES = new Set(["sana", "turbo"]);
const POLLINATIONS_MODELS_ENDPOINT = "https://gen.pollinations.ai/image/models";
const AI_HORDE_MODELS_ENDPOINT = "https://aihorde.net/api/v2/status/models?type=image";
function normalizePollinationsModelName(model) {
    const value = typeof model === "string" ? model.trim() : "";
    if (!value || POLLINATIONS_LEGACY_ALIASES.has(value.toLowerCase())) {
        return POLLINATIONS_DEFAULT_MODEL;
    }
    return value;
}
/**
 * Parses the Pollinations /image/models response (array of objects with name,
 * category, etc.) into a sorted list of image model name strings.
 * Filters out non-image models (e.g. video) using the category field.
 * @param {Array} data - Array of model objects from gen.pollinations.ai/image/models
 * @returns {string[]} Sorted image model names
 */
function parsePollinationsModelsResponse(data) {
    if (!Array.isArray(data)) {
        return [];
    }
    return data
        .filter((entry) => entry &&
        typeof entry === "object" &&
        typeof entry.name === "string" &&
        entry.name.trim().length > 0 &&
        (!entry.category || entry.category === "image"))
        .map((entry) => entry.name.trim())
        .sort((a, b) => a.localeCompare(b));
}
/**
 * Fetches Pollinations models and populates the dropdown
 */
async function fetchPollinationsModels(selectedModel) {
    const select = document.getElementById("nig-pollinations-model");
    select.innerHTML = "<option>Loading models...</option>";
    try {
        const cachedModels = await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .getCachedModelsForProvider */ .bu("pollinations", POLLINATIONS_MODELS_ENDPOINT);
        if (cachedModels && cachedModels.length > 0) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("CACHE", "Loading Pollinations models from cache");
            populatePollinationsSelect(select, cachedModels, selectedModel);
            return;
        }
    }
    catch (error) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("CACHE", "Failed to get cached Pollinations models", {
            error: error.message,
        });
    }
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", "Fetching Pollinations models from API");
    GM_xmlhttpRequest({
        method: "GET",
        url: POLLINATIONS_MODELS_ENDPOINT,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        },
        onload: async (response) => {
            try {
                const models = parsePollinationsModelsResponse(JSON.parse(response.responseText));
                await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .setCachedModels */ .Hg("pollinations", models, POLLINATIONS_MODELS_ENDPOINT);
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", "Fetched and cached Pollinations models", {
                    count: models.length,
                });
                populatePollinationsSelect(select, models, selectedModel);
            }
            catch (e) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to parse Pollinations models", {
                    error: e.message,
                });
                select.innerHTML = "<option>zimage</option>";
                select.value = POLLINATIONS_DEFAULT_MODEL;
            }
        },
        onerror: (error) => {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to fetch Pollinations models", {
                error: error,
            });
            select.innerHTML = "<option>zimage</option>";
            select.value = POLLINATIONS_DEFAULT_MODEL;
        },
    });
}
/**
 * Populates the Pollinations model dropdown
 */
function populatePollinationsSelect(select, models, selectedModel) {
    select.innerHTML = "";
    const normalizedSelected = normalizePollinationsModelName(selectedModel);
    const normalizedModels = Array.from(new Set([POLLINATIONS_DEFAULT_MODEL, ...models.map(normalizePollinationsModelName)]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))));
    normalizedModels.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        let textContent = model;
        if (model === POLLINATIONS_DEFAULT_MODEL) {
            textContent += " (Current default)";
        }
        option.textContent = textContent;
        select.appendChild(option);
    });
    if (normalizedModels.includes(normalizedSelected)) {
        select.value = normalizedSelected;
    }
    else {
        select.value = POLLINATIONS_DEFAULT_MODEL;
    }
}
/**
 * Fetches AI Horde models and populates the dropdown
 */
async function fetchAIHordeModels(selectedModel) {
    const select = document.getElementById("nig-horde-model");
    select.innerHTML = "<option>Loading models...</option>";
    try {
        const cachedModels = await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .getCachedModelsForProvider */ .bu("aiHorde", AI_HORDE_MODELS_ENDPOINT);
        if (cachedModels && cachedModels.length > 0) {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("CACHE", "Loading AI Horde models from cache");
            populateAIHordeSelect(select, cachedModels, selectedModel);
            return;
        }
    }
    catch (error) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("CACHE", "Failed to get cached AI Horde models", {
            error: error.message,
        });
    }
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", "Fetching AI Horde models from API");
    GM_xmlhttpRequest({
        method: "GET",
        url: AI_HORDE_MODELS_ENDPOINT,
        onload: async (response) => {
            try {
                const apiModels = JSON.parse(response.responseText);
                await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .setCachedModels */ .Hg("aiHorde", apiModels, AI_HORDE_MODELS_ENDPOINT);
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", "Fetched and cached AI Horde models", {
                    count: apiModels.length,
                });
                populateAIHordeSelect(select, apiModels, selectedModel);
            }
            catch (e) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to parse AI Horde models", {
                    error: e.message,
                });
                select.innerHTML = "<option>Stable Diffusion</option>";
                select.value = "Stable Diffusion";
            }
        },
        onerror: (error) => {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to fetch AI Horde models", {
                error: error,
            });
            select.innerHTML = "<option>Stable Diffusion</option>";
            select.value = "Stable Diffusion";
        },
    });
}
/**
 * Groups AI Horde models into top (popular) and other buckets based on live
 * API metadata (worker count), replacing the former static curated list.
 * @param {Array} models - Array of AI Horde model objects with { name, count, ... }
 * @returns {{ top: Array, other: Array }}
 */
function groupAIHordeModels(models) {
    const sorted = [...models].sort((a, b) => (b.count || 0) - (a.count || 0));
    const topCount = Math.min(10, sorted.length);
    return {
        top: sorted.slice(0, topCount),
        other: sorted.slice(topCount),
    };
}
/**
 * Populates the AI Horde model dropdown.
 * Top/popular grouping is derived from live API metadata (worker count),
 * not from any hardcoded list.
 */
function populateAIHordeSelect(select, models, selectedModel) {
    select.innerHTML = "";
    const { top, other } = groupAIHordeModels(models);
    const topCount = top.length;
    const topGroup = document.createElement("optgroup");
    topGroup.label =
        topCount > 0 ? `Top ${topCount} Popular Models` : "Popular Models";
    const otherGroup = document.createElement("optgroup");
    otherGroup.label = "Other Models";
    top.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.name;
        option.textContent = `${model.name} (${model.count || 0} workers)`;
        topGroup.appendChild(option);
    });
    other.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.name;
        option.textContent = `${model.name} (${model.count || 0} workers)`;
        otherGroup.appendChild(option);
    });
    select.appendChild(topGroup);
    if (otherGroup.childElementCount > 0) {
        select.appendChild(otherGroup);
    }
    if (Array.from(select.options).some((opt) => opt.value === selectedModel)) {
        select.value = selectedModel;
    }
    else {
        select.value = models[0]?.name || "Stable Diffusion";
    }
}
/**
 * Checks if a model is free to use, based primarily on plan_requirements.
 *
 * New rules:
 * - FREE if plan_requirements contains "free"
 * - PAID if plan_requirements does NOT contain "free" but contains "basic" or any higher tier
 * - Ignore intermediate tiers as separate categories; only free vs paid matters
 *
 * Robust handling:
 * - If plan_requirements missing/empty/malformed → fall back to legacy fields for backward compatibility
 *
 * @param {object} model
 * @returns {boolean} true if classified as free, false otherwise
 */
function isModelFree(model) {
    if (!model || typeof model !== "object") {
        // Malformed data - safe default is paid
        return false;
    }
    const tiersPriority = {
        free: 0,
        economy: 1,
        basic: 2,
        premium: 3,
        pro: 4,
        ultra: 5,
        enterprise: 6,
        admin: 7,
    };
    const hasValidPlanRequirements = Object.prototype.hasOwnProperty.call(model, "plan_requirements") &&
        Array.isArray(model.plan_requirements);
    if (hasValidPlanRequirements) {
        const normalized = model.plan_requirements
            .filter((t) => typeof t === "string")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t);
        if (normalized.length > 0) {
            if (normalized.includes("free")) {
                return true;
            }
            // Detect if any basic-or-higher tier is present.
            const hasBasicOrHigher = normalized.some((t) => {
                const rank = tiersPriority[t];
                return typeof rank === "number" && rank >= tiersPriority.basic;
            });
            if (hasBasicOrHigher) {
                return false;
            }
            // If we reach here, plan_requirements existed but only contained unknown/low tiers
            // that are not explicitly "free" and not mapped as paid → safe default is paid.
            return false;
        }
        // If it's an array but empty, fall through to legacy logic.
    }
    // Legacy / backward-compatible behavior:
    if (typeof model.is_free === "boolean") {
        return model.is_free;
    }
    if (typeof model.premium_model === "boolean") {
        return !model.premium_model;
    }
    if (Array.isArray(model.tiers)) {
        const normalizedTiers = model.tiers
            .filter((t) => typeof t === "string")
            .map((t) => t.trim().toLowerCase());
        if (normalizedTiers.includes("free")) {
            return true;
        }
    }
    // Default safe behavior when nothing else is conclusive: treat as paid.
    return false;
}
/**
 * Populates the OpenAI compatible model dropdown
 */
function populateOpenAICompatSelect(select, models, selectedModel) {
    select.innerHTML = "";
    const freeGroup = document.createElement("optgroup");
    freeGroup.label = "Free Models";
    const paidGroup = document.createElement("optgroup");
    paidGroup.label = "Paid Models";
    models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.id;
        option.textContent = model.id;
        if (isModelFree(model)) {
            freeGroup.appendChild(option);
        }
        else {
            paidGroup.appendChild(option);
        }
    });
    if (freeGroup.childElementCount > 0) {
        select.appendChild(freeGroup);
    }
    if (paidGroup.childElementCount > 0) {
        select.appendChild(paidGroup);
    }
    if (models.some((m) => m.id === selectedModel)) {
        select.value = selectedModel;
    }
}
/**
 * Fetches OpenAI compatible models
 */
async function fetchOpenAICompatModels() {
    const baseUrl = document
        .getElementById("nig-openai-compat-base-url")
        .value.trim();
    const apiKey = document
        .getElementById("nig-openai-compat-api-key")
        .value.trim();
    if (!baseUrl) {
        (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)("Please enter a Base URL first.", "error");
        return;
    }
    const select = document.getElementById("nig-openai-compat-model");
    select.innerHTML = "<option>Fetching models...</option>";
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", `Fetching OpenAI compatible models from ${baseUrl}`);
    GM_xmlhttpRequest({
        method: "GET",
        url: `${baseUrl}/models`,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        onload: async (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (!data.data || !Array.isArray(data.data)) {
                    throw new Error("Invalid model list format received.");
                }
                let imageModels = [];
                if (data.data.some((m) => m.endpoint || m.endpoints)) {
                    imageModels = data.data.filter((model) => model.endpoint === "/v1/images/generations" ||
                        model.endpoints?.includes("/v1/images/generations"));
                }
                else if (data.data.some((m) => m.type === "images.generations")) {
                    imageModels = data.data.filter((model) => model.type === "images.generations");
                }
                else {
                    // If no explicit image models found, try to identify them by name patterns
                    imageModels = data.data.filter((model) => {
                        const modelId = model.id.toLowerCase();
                        return (modelId.includes("gpt-image") ||
                            modelId.includes("chatgpt-image") ||
                            modelId.includes("image") ||
                            modelId.includes("midjourney") ||
                            modelId.includes("stable diffusion") ||
                            modelId.includes("flux"));
                    });
                }
                imageModels.sort((a, b) => {
                    const aIsFree = isModelFree(a);
                    const bIsFree = isModelFree(b);
                    if (aIsFree && !bIsFree) {
                        return -1;
                    }
                    if (!aIsFree && bIsFree) {
                        return 1;
                    }
                    return a.id.localeCompare(b.id);
                });
                if (imageModels.length === 0) {
                    throw new Error("No image generation models found. This provider may not support image generation.");
                }
                populateOpenAICompatSelect(select, imageModels, undefined);
                // Cache the models for this profile
                await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .setCachedOpenAICompatModels */ .Bh(baseUrl, imageModels);
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", `Successfully fetched and cached ${imageModels.length} models for ${baseUrl}`);
            }
            catch (error) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to parse OpenAI compatible models", {
                    error: error.message,
                });
                select.innerHTML = "<option>Failed to fetch models</option>";
                (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)(`Failed to fetch models. Check the Base URL and API Key. You can enter the model name manually. Error: ${error.message}`, "error");
                // Switch to manual input mode
                document.getElementById("nig-openai-model-container-select").style.display = "none";
                document.getElementById("nig-openai-model-container-manual").style.display = "block";
            }
        },
        onerror: (error) => {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to fetch OpenAI compatible models", {
                error,
            });
            select.innerHTML = "<option>Failed to fetch models</option>";
            (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)("Failed to fetch models. Check your network connection and the Base URL. Switching to manual input.", "error");
            // Switch to manual input mode
            document.getElementById("nig-openai-model-container-select").style.display = "none";
            document.getElementById("nig-openai-model-container-manual").style.display = "block";
        },
    });
}
/**
 * Loads cached OpenAI compatible models for a profile
 */
async function loadCachedOpenAICompatModels(profileUrl, selectedModel) {
    const select = document.getElementById("nig-openai-compat-model");
    const cachedModels = await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .getCachedOpenAICompatModels */ .tb(profileUrl);
    if (cachedModels && cachedModels.length > 0) {
        populateOpenAICompatSelect(select, cachedModels, selectedModel);
    }
    else {
        // No cached models, show fetch prompt
        select.innerHTML =
            "<option>No cached models. Click Fetch to get models.</option>";
    }
}
/**
 * Loads OpenAI profiles and populates the dropdown
 */
async function loadOpenAIProfiles() {
    const select = document.getElementById("nig-openai-compat-profile-select");
    const config = await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .getConfig */ .zj();
    const profiles = config.openAICompatProfiles || {};
    const activeUrl = config.openAICompatActiveProfileUrl;
    select.innerHTML = "";
    Object.keys(profiles).forEach((url) => {
        const option = document.createElement("option");
        option.value = url;
        option.textContent = url;
        select.appendChild(option);
    });
    const newOption = document.createElement("option");
    newOption.value = "__new__";
    newOption.textContent = "— Add or Edit Profile —";
    select.appendChild(newOption);
    if (activeUrl && profiles[activeUrl]) {
        select.value = activeUrl;
    }
    else {
        select.value = "__new__";
    }
    loadSelectedOpenAIProfile();
}
/**
 * Loads the selected OpenAI profile
 */
async function loadSelectedOpenAIProfile() {
    const select = document.getElementById("nig-openai-compat-profile-select");
    const config = await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .getConfig */ .zj();
    const profiles = config.openAICompatProfiles || {};
    const selectedUrl = select.value;
    if (selectedUrl && profiles[selectedUrl]) {
        const profile = profiles[selectedUrl];
        document.getElementById("nig-openai-compat-base-url").value = selectedUrl;
        document.getElementById("nig-openai-compat-api-key").value = profile.apiKey;
        if (config.openAICompatModelManualInput) {
            document.getElementById("nig-openai-compat-model-manual").value =
                profile.model;
        }
        else {
            document.getElementById("nig-openai-compat-model").value = profile.model;
            // Load cached models for this profile, if available
            loadCachedOpenAICompatModels(selectedUrl, profile.model);
        }
    }
    else {
        // New profile mode - clear the model selection
        document.getElementById("nig-openai-compat-base-url").value = "";
        document.getElementById("nig-openai-compat-api-key").value = "";
        document.getElementById("nig-openai-compat-model").innerHTML =
            "<option>Enter URL/Key and fetch...</option>";
    }
}
/**
 * Deletes the selected OpenAI profile
 */
async function deleteSelectedOpenAIProfile() {
    const select = document.getElementById("nig-openai-compat-profile-select");
    const selectedUrl = select.value;
    if (selectedUrl === "__new__") {
        (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)("You can't delete the 'Add New' option.", "error");
        return;
    }
    if (await (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showConfirm */ .GQ)(`Delete profile for "${selectedUrl}"?`, "Delete Profile")) {
        const config = await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .getConfig */ .zj();
        const profiles = config.openAICompatProfiles || {};
        delete profiles[selectedUrl];
        await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("openAICompatProfiles", profiles);
        // Clear form fields
        document.getElementById("nig-openai-compat-base-url").value = "";
        document.getElementById("nig-openai-compat-api-key").value = "";
        document.getElementById("nig-openai-compat-model").innerHTML =
            "<option>Enter URL/Key and fetch...</option>";
        document.getElementById("nig-openai-compat-model-manual").value = "";
        await loadOpenAIProfiles();
    }
}
// --- Enhancement Model Discovery ---
/**
 * Name patterns for models that are unambiguously NOT chat/text models.
 * Used as a permissive fallback when no explicit capability metadata is present.
 */
const ENHANCEMENT_NON_CHAT_PATTERNS = [
    /\bembed/i,
    /\btts/i,
    /whisper/i,
    /moderation/i,
    /\baudio\b/i,
    /transcri/i,
    /image/i,
];
/**
 * Builds the request URL and headers for fetching enhancement models from an
 * OpenAI-compatible /models endpoint.
 *
 * Authorization is omitted when no API key is provided, supporting no-auth
 * local servers (Ollama, LM Studio, vLLM).
 * @param {string} baseUrl - Enhancement endpoint base URL (e.g. https://api.openai.com/v1)
 * @param {string} apiKey - Optional Bearer token; empty for no-auth servers
 * @returns {{ url: string, headers: Record<string, string> }}
 */
function buildEnhancementModelsRequest(baseUrl, apiKey) {
    const endpointUrl = typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
    const headers = { "Content-Type": "application/json" };
    const key = typeof apiKey === "string" ? apiKey.trim() : "";
    if (key) {
        headers["Authorization"] = `Bearer ${key}`;
    }
    return { url: `${endpointUrl}/models`, headers };
}
/**
 * Extracts model entries from common OpenAI-compatible /models response shapes.
 * Handles: { data: [...] }, bare arrays, { models: [...] }, and string arrays.
 * Returns deduplicated { id, meta } entries.
 */
function extractEnhancementModelEntries(data) {
    let modelList = [];
    if (data && Array.isArray(data.data)) {
        modelList = data.data;
    }
    else if (Array.isArray(data)) {
        modelList = data;
    }
    else if (data && Array.isArray(data.models)) {
        modelList = data.models;
    }
    else {
        return [];
    }
    const entries = [];
    const seen = new Set();
    for (const entry of modelList) {
        let id = null;
        let meta = {};
        if (typeof entry === "string") {
            id = entry;
        }
        else if (entry && typeof entry === "object") {
            id = entry.id || entry.name || entry.model;
            if (id) {
                meta = entry;
            }
        }
        if (typeof id === "string") {
            id = id.trim();
            if (id && !seen.has(id)) {
                seen.add(id);
                entries.push({ id, meta });
            }
        }
    }
    return entries;
}
/**
 * Filters model entries to chat/text models.
 * - Uses explicit endpoint/type metadata when available.
 * - Falls back to name heuristics for providers with minimal metadata.
 * - Never returns an empty list if the input had entries (falls back to all)
 *   so local providers with minimal metadata are never left without options.
 * @param {Array} entries - Array of { id, meta } entries
 * @returns {Array} Filtered entries
 */
function filterEnhancementChatModels(entries) {
    const isChat = (entry) => {
        const meta = entry.meta || {};
        // Explicit endpoint metadata — strongest signal
        if (meta.endpoint === "/v1/chat/completions") {
            return true;
        }
        if (Array.isArray(meta.endpoints) &&
            meta.endpoints.includes("/v1/chat/completions")) {
            return true;
        }
        // Explicit type metadata
        if (typeof meta.type === "string" && meta.type.trim().length > 0) {
            const t = meta.type.toLowerCase();
            if (t.includes("image") ||
                t.includes("embedding") ||
                t.includes("audio") ||
                t.includes("transcription") ||
                t.includes("tts")) {
                return false;
            }
            return true; // chat / text / llm / language
        }
        // No explicit metadata — use name heuristics (permissive for local servers)
        const id = entry.id.toLowerCase();
        if (ENHANCEMENT_NON_CHAT_PATTERNS.some((re) => re.test(id))) {
            return false;
        }
        return true;
    };
    const filtered = entries.filter(isChat);
    // Never leave the user with an empty list; fall back to all entries.
    return filtered.length > 0 ? filtered : entries;
}
/**
 * Determines if a model is free on OpenCode Zen.
 * Free models include IDs containing "free" plus "big-pickle" (a stealth free model).
 * The Zen /models API returns no pricing field, so the name heuristic is required.
 * @param {string} modelId - The model ID to check
 * @returns {boolean} true if the model is free on Zen
 */
function isZenFreeModel(modelId) {
    const id = typeof modelId === "string" ? modelId.toLowerCase() : "";
    return id.includes("free") || id === "big-pickle";
}
/**
 * Determines if a base URL points to OpenCode Zen.
 * @param {string} baseUrl - The enhancement endpoint base URL
 * @returns {boolean} true if the URL is an OpenCode Zen endpoint
 */
function isZenEndpoint(baseUrl) {
    return (typeof baseUrl === "string" && baseUrl.includes("opencode.ai/zen"));
}
/**
 * Parses an OpenAI-compatible /models response into a sorted list of chat model ids.
 * Pure function: no DOM, no network. Handles common response shapes and filters
 * non-chat models (embeddings, tts, image, etc.) without excluding local providers
 * that expose minimal metadata.
 * @param {object|Array} data - Parsed JSON response from GET {baseUrl}/models
 * @param {{ zenFreeOnly?: boolean }} [options] - When zenFreeOnly is true, filters to Zen free models only
 * @returns {string[]} Sorted, deduplicated chat model ids
 */
function parseEnhancementModelsResponse(data, options = {}) {
    const entries = extractEnhancementModelEntries(data);
    let filtered = filterEnhancementChatModels(entries);
    if (options.zenFreeOnly) {
        filtered = filtered.filter((e) => isZenFreeModel(e.id));
    }
    return filtered.map((e) => e.id).sort((a, b) => a.localeCompare(b));
}
/**
 * Populates the enhancement model <select> with fetched model ids.
 * Preserves a saved model that is absent from the fetched list.
 */
function populateEnhancementModelSelect(select, modelIds, selectedModel) {
    select.innerHTML = "";
    modelIds.forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = id;
        select.appendChild(option);
    });
    // Preserve a saved model that is absent from the fetched list
    if (selectedModel && !modelIds.includes(selectedModel)) {
        const option = document.createElement("option");
        option.value = selectedModel;
        option.textContent = `${selectedModel} (saved)`;
        select.insertBefore(option, select.firstChild);
    }
    if (selectedModel &&
        Array.from(select.options).some((opt) => opt.value === selectedModel)) {
        select.value = selectedModel;
    }
    else if (modelIds.length > 0) {
        select.value = modelIds[0];
    }
}
/**
 * Switches the enhancement model UI to manual input mode (used on fetch failure).
 */
function switchEnhancementToManual() {
    const selectContainer = document.getElementById("nig-enhancement-model-container-select");
    const manualContainer = document.getElementById("nig-enhancement-model-container-manual");
    if (selectContainer) {
        selectContainer.style.display = "none";
    }
    if (manualContainer) {
        manualContainer.style.display = "block";
    }
}
/**
 * Fetches enhancement models from {enhancementBaseUrl}/models and populates the dropdown.
 * @param {string} baseUrl - Enhancement endpoint base URL
 * @param {string} apiKey - Optional Bearer token; empty for no-auth local servers
 */
async function fetchEnhancementModels(baseUrl, apiKey) {
    const endpointUrl = typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
    if (!endpointUrl) {
        (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)("Please enter an Enhancement Endpoint URL first.", "error");
        return;
    }
    const key = typeof apiKey === "string" ? apiKey.trim() : "";
    const select = document.getElementById("nig-enhancement-model");
    if (!select) {
        return;
    }
    select.innerHTML = "<option>Fetching models...</option>";
    const { url, headers } = buildEnhancementModelsRequest(endpointUrl, key);
    _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", `Fetching enhancement models from ${url}`);
    GM_xmlhttpRequest({
        method: "GET",
        url,
        headers,
        onload: async (response) => {
            try {
                const data = JSON.parse(response.responseText);
                const isZen = isZenEndpoint(endpointUrl);
                const zenFreeOnly = isZen && !key;
                const modelIds = parseEnhancementModelsResponse(data, { zenFreeOnly });
                if (modelIds.length === 0) {
                    throw new Error("No chat/text models found at this endpoint.");
                }
                await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .setCachedModels */ .Hg("enhancement", modelIds, endpointUrl);
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", `Fetched and cached ${modelIds.length} enhancement models`);
                // Preserve the current selection (if it is a real model id) across refresh
                const currentModel = select.value &&
                    !select.value.toLowerCase().includes("fetch") &&
                    !select.value.toLowerCase().includes("enter")
                    ? select.value
                    : "";
                populateEnhancementModelSelect(select, modelIds, currentModel);
            }
            catch (error) {
                _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to parse enhancement models", {
                    error: error.message,
                });
                select.innerHTML = "<option>Failed to fetch models</option>";
                (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)(`Failed to fetch enhancement models. Check the endpoint URL and API key. You can enter the model name manually. Error: ${error.message}`, "error");
                switchEnhancementToManual();
            }
        },
        onerror: (error) => {
            _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("NETWORK", "Failed to fetch enhancement models", {
                error,
            });
            select.innerHTML = "<option>Failed to fetch models</option>";
            (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_3__/* .showToast */ .P0)("Failed to fetch enhancement models. Check your network connection and endpoint URL. Switching to manual input.", "error");
            switchEnhancementToManual();
        },
    });
}
/**
 * Loads cached enhancement models (if available) into the dropdown and preserves
 * the saved model selection. Called when populating the enhancement settings.
 * For Zen endpoints with no API key and an empty cache, auto-fetches the free
 * model list so the dropdown is not blank.
 * @param selectedModel - The currently saved enhancement model name
 * @param baseUrl - The enhancement endpoint base URL (for cache validation)
 * @param apiKey - Optional API key (used to decide auto-fetch for Zen)
 */
async function loadEnhancementModels(selectedModel, baseUrl, apiKey) {
    const select = document.getElementById("nig-enhancement-model");
    if (!select) {
        return;
    }
    const normalizedBaseUrl = typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
    try {
        const cached = await _utils_cache__WEBPACK_IMPORTED_MODULE_0__/* .getCachedModelsForProvider */ .bu("enhancement", normalizedBaseUrl);
        if (Array.isArray(cached) && cached.length > 0) {
            populateEnhancementModelSelect(select, cached, selectedModel);
            return;
        }
    }
    catch (error) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logError */ .vV("CACHE", "Failed to get cached enhancement models", {
            error: error.message,
        });
    }
    // No cache available: preserve the saved model or show a fetch prompt
    select.innerHTML = "";
    if (selectedModel && typeof selectedModel === "string" && selectedModel.trim()) {
        const option = document.createElement("option");
        option.value = selectedModel;
        option.textContent = `${selectedModel} (saved — click Fetch to refresh list)`;
        select.appendChild(option);
        select.value = selectedModel;
    }
    else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Enter endpoint URL and fetch...";
        select.appendChild(option);
    }
    // Auto-fetch Zen free models when endpoint is Zen and no API key is set.
    // Zen free models work without authentication, so auto-fetch is safe and
    // prevents a blank dropdown for existing users after migration.
    if (isZenEndpoint(normalizedBaseUrl) && !apiKey) {
        _utils_logger__WEBPACK_IMPORTED_MODULE_2__/* .logInfo */ .fH("NETWORK", "Auto-fetching Zen free models for enhancement dropdown");
        fetchEnhancementModels(normalizedBaseUrl, apiKey);
    }
}
/**
 * Saves provider-specific configuration to storage
 */
async function saveProviderConfigs() {
    // Pollinations configuration
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsModel", document.getElementById("nig-pollinations-model").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsWidth", document.getElementById("nig-pollinations-width").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsHeight", document.getElementById("nig-pollinations-height").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsSeed", document.getElementById("nig-pollinations-seed").value.trim());
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsEnhance", document.getElementById("nig-pollinations-enhance").checked);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsSafe", document.getElementById("nig-pollinations-safe").checked);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsNologo", document.getElementById("nig-pollinations-nologo").checked);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsPrivate", document.getElementById("nig-pollinations-private").checked);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("pollinationsToken", document.getElementById("nig-pollinations-token").value.trim());
    // AI Horde configuration
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeApiKey", document.getElementById("nig-horde-api-key").value.trim() || "0000000000");
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeModel", document.getElementById("nig-horde-model").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeSampler", document.getElementById("nig-horde-sampler").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeSteps", document.getElementById("nig-horde-steps").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeCfgScale", document.getElementById("nig-horde-cfg").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeWidth", document.getElementById("nig-horde-width").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeHeight", document.getElementById("nig-horde-height").value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordeSeed", document.getElementById("nig-horde-seed").value.trim());
    const postProcessing = Array.from(document.querySelectorAll('input[name="nig-horde-post"]:checked')).map((cb) => cb.value);
    await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("aiHordePostProcessing", postProcessing);
    // OpenAI Compatible configuration
    const baseUrl = document
        .getElementById("nig-openai-compat-base-url")
        .value.trim();
    if (baseUrl) {
        const profiles = await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .getConfigValue */ .Ct("openAICompatProfiles");
        const isManualMode = document.getElementById("nig-openai-model-container-manual").style
            .display !== "none";
        const model = isManualMode
            ? document.getElementById("nig-openai-compat-model-manual").value.trim()
            : document.getElementById("nig-openai-compat-model").value;
        profiles[baseUrl] = {
            apiKey: document.getElementById("nig-openai-compat-api-key").value.trim(),
            model: model,
        };
        await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("openAICompatProfiles", profiles);
        await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("openAICompatActiveProfileUrl", baseUrl);
        await _utils_storage__WEBPACK_IMPORTED_MODULE_1__/* .setConfigValue */ .yJ("openAICompatModelManualInput", isManualMode);
        // Refresh the OpenAI profiles dropdown to show the newly saved profile
        await loadOpenAIProfiles();
    }
}
/**
 * Populates provider-specific form fields
 */
async function populateProviderForms(config) {
    // Pollinations settings
    document.getElementById("nig-pollinations-width").value =
        config.pollinationsWidth;
    document.getElementById("nig-pollinations-height").value =
        config.pollinationsHeight;
    document.getElementById("nig-pollinations-seed").value =
        config.pollinationsSeed;
    document.getElementById("nig-pollinations-enhance").checked =
        config.pollinationsEnhance;
    document.getElementById("nig-pollinations-safe").checked =
        config.pollinationsSafe;
    document.getElementById("nig-pollinations-nologo").checked =
        config.pollinationsNologo;
    document.getElementById("nig-pollinations-private").checked =
        config.pollinationsPrivate;
    document.getElementById("nig-pollinations-token").value =
        config.pollinationsToken;
    fetchPollinationsModels(config.pollinationsModel);
    // AI Horde settings
    document.getElementById("nig-horde-api-key").value = config.aiHordeApiKey;
    document.getElementById("nig-horde-sampler").value = config.aiHordeSampler;
    document.getElementById("nig-horde-steps").value = config.aiHordeSteps;
    document.getElementById("nig-horde-cfg").value = config.aiHordeCfgScale;
    document.getElementById("nig-horde-width").value = config.aiHordeWidth;
    document.getElementById("nig-horde-height").value = config.aiHordeHeight;
    document.getElementById("nig-horde-seed").value = config.aiHordeSeed;
    document.querySelectorAll('input[name="nig-horde-post"]').forEach((cb) => {
        cb.checked = config.aiHordePostProcessing.includes(cb.value);
    });
    fetchAIHordeModels(config.aiHordeModel);
    // OpenAI Compatible settings
    await loadOpenAIProfiles();
    if (config.openAICompatModelManualInput) {
        document.getElementById("nig-openai-model-container-select").style.display =
            "none";
        document.getElementById("nig-openai-model-container-manual").style.display =
            "block";
    }
    else {
        document.getElementById("nig-openai-model-container-select").style.display =
            "block";
        document.getElementById("nig-openai-model-container-manual").style.display =
            "none";
    }
}


/***/ },

/***/ 237
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   show: () => (/* binding */ show),
/* harmony export */   v: () => (/* binding */ create)
/* harmony export */ });
/* unused harmony export initialize */
/* harmony import */ var _utils_file__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(409);
/* harmony import */ var _utils_uiUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(511);
// Image Viewer Component


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
    }
    catch {
        return false;
    }
}
function create() {
    if (document.getElementById("nig-image-viewer")) {
        return;
    }
    const imageViewer = document.createElement("div");
    imageViewer.id = "nig-image-viewer";
    imageViewer.className = "nig-modal-overlay";
    imageViewer.style.display = "none";
    imageViewer.innerHTML = `
		<div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-image-viewer-title">
			<button type="button" class="nig-close-btn" aria-label="Close image viewer">&times;</button>
			<div id="nig-prompt-container" class="nig-prompt-container" role="button" tabindex="0" aria-expanded="false" aria-controls="nig-prompt-text" aria-label="Toggle prompt visibility">
				<div class="nig-prompt-header"><span id="nig-image-viewer-title" style="display:none;">Image Viewer</span><span>Generated Image Prompt</span></div>
				<p id="nig-prompt-text" class="nig-prompt-text"></p>
			</div>
			<div id="nig-image-gallery" class="nig-image-gallery"></div>
		</div>`;
    document.body.appendChild(imageViewer);
    imageViewer.querySelector(".nig-close-btn").addEventListener("click", () => {
        imageViewer.style.display = "none";
        if (imageViewer._nigA11yCleanup) {
            imageViewer._nigA11yCleanup();
            imageViewer._nigA11yCleanup = null;
        }
    });
    const promptContainer = imageViewer.querySelector("#nig-prompt-container");
    function togglePrompt() {
        const isExpanded = promptContainer.classList.toggle("expanded");
        promptContainer.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
    promptContainer.addEventListener("click", togglePrompt);
    promptContainer.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePrompt();
        }
    });
    // Store cleanup for use in show()
    imageViewer._nigA11yCleanup = null;
}
function show(imageUrls, prompt, provider, model = "Unknown") {
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
    promptContainer.setAttribute("aria-expanded", "false");
    const extension = provider === "Pollinations" || provider === "OpenAICompat" ? "jpg" : "png";
    imageUrls.forEach((url, index) => {
        const container = document.createElement("div");
        container.className = "nig-image-container";
        const img = document.createElement("img");
        img.src = url;
        // Set aspect-ratio to reduce CLS (finding #24)
        img.style.aspectRatio = "auto";
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
            const scriptName = (0,_utils_file__WEBPACK_IMPORTED_MODULE_0__/* .getScriptName */ .t)();
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
        // Add aria-labels to action buttons for screen readers
        downloadBtn.setAttribute("aria-label", "Download image");
        fullscreenBtn.setAttribute("aria-label", "View image fullscreen");
        actions.appendChild(downloadBtn);
        actions.appendChild(fullscreenBtn);
        container.appendChild(img);
        container.appendChild(actions);
        gallery.appendChild(container);
    });
    imageViewer.style.display = "flex";
    // Set up modal accessibility (focus trap, Escape, scroll lock, focus management)
    if (imageViewer._nigA11yCleanup) {
        imageViewer._nigA11yCleanup();
    }
    imageViewer._nigA11yCleanup = (0,_utils_uiUtils__WEBPACK_IMPORTED_MODULE_1__/* .setupModalA11y */ .nI)(imageViewer, {
        closeOnEscape: true,
        onClose: () => {
            imageViewer.style.display = "none";
            if (imageViewer._nigA11yCleanup) {
                imageViewer._nigA11yCleanup();
                imageViewer._nigA11yCleanup = null;
            }
        },
    });
}
function initialize() {
    create();
}


/***/ },

/***/ 916
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CONFIG_SCHEMA_VERSION),
/* harmony export */   z: () => (/* binding */ DEFAULTS)
/* harmony export */ });
const CONFIG_SCHEMA_VERSION = 2;
const DEFAULTS = {
    configSchemaVersion: 1,
    selectedProvider: "Pollinations",
    loggingEnabled: false,
    // Prompt Styling
    mainPromptStyle: "None",
    subPromptStyle: "none",
    customStyleEnabled: false,
    customStyleText: "",
    // AI Prompt Enhancement (OpenAI-compatible /chat/completions endpoint)
    enhancementEnabled: true,
    enhancementBaseUrl: "https://opencode.ai/zen/v1", // OpenCode Zen: free models work with no API key
    enhancementApiKey: "", // Bearer token; leave empty for Zen free models or no-auth local servers
    enhancementModel: "big-pickle", // OpenCode Zen free model (works without API key)
    enhancementModelManualInput: false, // false = dropdown (dynamic fetch), true = manual text input
    // Default enhancement behavior is driven by the selected preset.
    // This base template is aligned with the "Standard Enhancement" preset.
    enhancementTemplate: "Extract visual elements from this text and craft a concise, image-ready prompt as a flowing paragraph. Focus on: clear subjects, setting and environment, lighting/mood/color palette, and artistic style/composition/framing. Omit narrative, dialogue, text overlays, and non-visual details. Use vivid, concrete descriptors separated by commas or short phrases. End with quality boosters such as highly detailed, sharp focus, high resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene and mood, then add style and technical details.",
    enhancementTemplateSelected: "standard",
    enhancementOverrideProvider: false,
    enhancementLastStatus: "disabled",
    // Enhancement Retry and Fallback Configuration
    enhancementMaxRetriesPerModel: 2,
    enhancementRetryDelay: 1000,
    enhancementLogLevel: "info", // 'debug', 'info', 'warn', 'error'
    enhancementAlwaysFallback: true,
    // Preset Enhancement Prompts
    // Default enhancement presets (top 5 only). User presets are stored separately.
    enhancementPresets: {
        standard: {
            name: "Standard Enhancement",
            description: "Default enhancement that improves prompt quality",
            template: 'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:',
        },
        safety: {
            name: "Safety Enhancement",
            description: "Enhances prompts while removing harmful or inappropriate content",
            template: 'Extract visual elements from this text and craft a safe, concise image generation prompt as a flowing paragraph while removing harmful, inappropriate, or policy-violating elements. Focus on: positive and suitable characters and their appropriate appearances/actions/expressions, safe setting and environment, wholesome lighting/mood/color palette, appropriate artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with safety-focused quality boosters like "appropriate content, family-friendly, positive imagery, safe, well-balanced, detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with safe core subjects, layer in safe scene/mood, then appropriate style/technicals:',
        },
        artistic: {
            name: "Artistic Enhancement",
            description: "Focuses on artistic and creative elements",
            template: 'Extract visual elements from this text and craft an artistic image generation prompt as a flowing paragraph with emphasis on creative elements and visual aesthetics. Focus on: characters and their creative appearances/actions/expressions with artistic flair, artistic setting and environment, vibrant lighting/mood/color palette, artistic style/composition/framing with emphasis on artistic techniques. Omit narrative, dialogue, text, or non-visual details. Use vivid, artistic descriptors separated by commas or short phrases for clarity. End with artistic quality boosters like "artistic masterpiece, creative composition, vibrant colors, detailed artwork, museum quality, fine art, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with artistic core subjects, layer in creative scene/mood, then artistic style/technicals:',
        },
        technical: {
            name: "Technical Enhancement",
            description: "Emphasizes technical accuracy and detail",
            template: 'Extract visual elements from this text and craft a technically-precise image generation prompt as a flowing paragraph with emphasis on technical accuracy and realistic elements. Focus on: characters with technically accurate appearances/actions/expressions, realistic setting and environment, precise lighting/mood/color palette, technical artistic style/composition/framing with photorealistic qualities. Omit narrative, dialogue, text, or non-visual details. Use precise, technical descriptors separated by commas or short phrases for clarity. End with technical quality boosters like "photorealistic, technical precision, accurate details, high resolution, professional photography, sharp focus, 8K detail, masterpiece. Generated Prompt Structure: Start with technically accurate core subjects, layer in realistic scene/mood, then technical style/technicals:',
        },
        character: {
            name: "Character Enhancement",
            description: "Focuses on character development and description",
            template: 'Extract visual elements from this text and craft a character-focused image generation prompt as a flowing paragraph with emphasis on character details and development. Focus on: detailed character appearances/actions/expressions with rich personality traits, character-centric setting and environment, character-appropriate lighting/mood/color palette, character-driven artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, character-specific descriptors separated by commas or short phrases for clarity. End with character-focused quality boosters like "detailed character, expressive features, well-defined personality, professional portrait, masterpiece character study, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with compelling core characters, layer in character-appropriate scene/mood, then character-focused style/technicals:',
        },
    },
    /**
     * User-defined enhancement presets (schema v1).
     * Stored separately from enhancementPresets to preserve default set across updates.
     *
     * Shape:
     * {
     *   "<id>": {
     *     id: string,
     *     name: string,
     *     description?: string,
     *     template: string,
     *     createdAt?: string,
     *     updatedAt?: string,
     *     version?: 1
     *   },
     *   ...
     * }
     *
     * Backward compatibility:
     * - If existing stored value is an array or legacy map without id, migration logic
     *   in the UI/loader should normalize it into this keyed-object shape.
     */
    enhancementUserPresets: {},
    // Global Negative Prompting
    enableNegPrompt: true,
    globalNegPrompt: "ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality",
    // AI Horde
    aiHordeApiKey: "0000000000",
    aiHordeModel: "AlbedoBase XL (SDXL)",
    aiHordeSampler: "k_dpmpp_2m",
    aiHordeSteps: 25,
    aiHordeCfgScale: 7,
    aiHordeWidth: 512,
    aiHordeHeight: 512,
    aiHordePostProcessing: [],
    aiHordeSeed: "",
    // Pollinations.ai
    pollinationsModel: "zimage",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    pollinationsSeed: "",
    pollinationsEnhance: true,
    pollinationsNologo: false,
    pollinationsPrivate: false,
    pollinationsSafe: true,
    pollinationsToken: "",
    // OpenAI Compatible
    openAICompatProfiles: {},
    openAICompatActiveProfileUrl: "",
    openAICompatModelManualInput: false,
    // History Management
    historyDays: 30,
};


/***/ },

/***/ 165
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bh: () => (/* binding */ setCachedOpenAICompatModels),
/* harmony export */   Hg: () => (/* binding */ setCachedModels),
/* harmony export */   WN: () => (/* binding */ clearCachedModels),
/* harmony export */   bu: () => (/* binding */ getCachedModelsForProvider),
/* harmony export */   tb: () => (/* binding */ getCachedOpenAICompatModels)
/* harmony export */ });
/* unused harmony exports CACHE_EXPIRATION_MS, CACHE_SCHEMA_VERSION, getCachedModels, clearCachedOpenAICompatModels */
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(187);
/* harmony import */ var _uiUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(511);


const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_SCHEMA_VERSION = 2;
// Cache entry shape (schema v2):
//   { models: any[], timestamp: number, endpoint?: string, schemaVersion: number }
//
// Legacy shape (schema v1 / unversioned):
//   { [provider]: any[] }  ← bare array of models with no metadata
// Legacy entries are treated as cache misses and overwritten on next fetch.
/**
 * Validates a cache entry against the current schema, TTL, and endpoint.
 * @param entry - The cache entry to validate
 * @param endpoint - Optional endpoint URL that must match the stored value
 * @returns true if the entry is valid, fresh, and endpoint-matched
 */
function isCacheEntryValid(entry, endpoint) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return false;
    }
    if (entry.schemaVersion !== CACHE_SCHEMA_VERSION) {
        return false;
    }
    if (typeof entry.timestamp !== "number") {
        return false;
    }
    if (Date.now() - entry.timestamp > CACHE_EXPIRATION_MS) {
        return false;
    }
    if (endpoint &&
        typeof entry.endpoint === "string" &&
        entry.endpoint !== endpoint) {
        return false;
    }
    if (!Array.isArray(entry.models)) {
        return false;
    }
    return true;
}
async function getCachedModels() {
    try {
        const cachedData = await GM_getValue("cachedModels", "{}");
        if (typeof cachedData === "string" && cachedData.trim()) {
            return JSON.parse(cachedData);
        }
        else if (typeof cachedData === "object" && cachedData !== null) {
            return cachedData;
        }
        else {
            // Invalid or empty data, return empty object
            return {};
        }
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to parse cached models data, resetting cache", { error: error.message });
        // Clear the corrupted cache and return empty object
        await GM_setValue("cachedModels", "{}");
        return {};
    }
}
/**
 * Gets cached models for a specific provider.
 * Returns the models array only when the cache entry is valid (correct schema
 * version, not expired, endpoint matches). Legacy bare-array entries and
 * expired/endpoint-mismatched entries are treated as cache misses (null).
 * @param provider - The provider name (e.g. 'pollinations', 'aiHorde')
 * @param endpoint - Optional endpoint URL to validate against the stored value
 * @returns {Promise<Array|null>} Array of cached models or null if not found/expired
 */
async function getCachedModelsForProvider(provider, endpoint) {
    try {
        const cache = await getCachedModels();
        const entry = cache[provider];
        if (isCacheEntryValid(entry, endpoint)) {
            return entry.models;
        }
        return null;
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", `Failed to get cached models for ${provider}`, {
            error: error.message,
        });
        return null;
    }
}
/**
 * Sets cached models for a specific provider with timestamp, endpoint, and
 * schema version metadata so the cache can auto-expire and invalidate on
 * endpoint changes.
 * @param provider - The provider name
 * @param models - Array of model objects/strings to cache
 * @param endpoint - Optional endpoint URL the models were fetched from
 */
async function setCachedModels(provider, models, endpoint) {
    try {
        const cache = await getCachedModels();
        cache[provider] = {
            models: models,
            timestamp: Date.now(),
            endpoint: endpoint || null,
            schemaVersion: CACHE_SCHEMA_VERSION,
        };
        await GM_setValue("cachedModels", JSON.stringify(cache));
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", `Cached models for ${provider}`);
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache models", {
            provider,
            error: error.message,
        });
        // Try to reset the cache and retry once
        await GM_setValue("cachedModels", "{}");
        try {
            const resetCache = await getCachedModels();
            resetCache[provider] = models;
            await GM_setValue("cachedModels", JSON.stringify(resetCache));
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", `Cached models for ${provider} after cache reset`);
        }
        catch (retryError) {
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache models even after reset", {
                provider,
                error: retryError.message,
            });
        }
    }
}
async function clearCachedModels(provider = null) {
    try {
        if (provider) {
            const cache = await getCachedModels();
            delete cache[provider];
            await GM_setValue("cachedModels", JSON.stringify(cache));
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)("CACHE", `Cleared cached models for ${provider}.`);
        }
        else {
            // Only clear the cached models, preserve all profile data
            // The profiles contain important user data like base URLs and API keys
            // that should not be affected by cache clearing
            await clearCachedOpenAICompatModels();
            // Also clear the main cached models (Pollinations, AI Horde, etc.)
            await GM_setValue("cachedModels", "{}");
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)("CACHE", "Cleared all cached models and reset OpenAI Compatible model selections.");
            (0,_uiUtils__WEBPACK_IMPORTED_MODULE_1__/* .showToast */ .P0)("All cached models have been cleared. They will be re-fetched when you next open the settings.", "success");
        }
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to clear cached models", {
            provider,
            error: error.message,
        });
        // Force reset cache as fallback
        try {
            await GM_setValue("cachedModels", "{}");
            // Only reset the models cache, preserve profile data
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", "Force reset cache data as fallback");
        }
        catch (fallbackError) {
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to force reset cache", {
                error: fallbackError.message,
            });
        }
    }
}
// --- OpenAI Compatible Provider Caching Functions ---
/**
 * Gets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @returns {Promise<Array>} Array of cached model objects or empty array
 */
async function getCachedOpenAICompatModels(profileUrl) {
    try {
        const cacheKey = `openAICompatModels_${profileUrl}`;
        const cachedData = await GM_getValue(cacheKey, "[]");
        if (typeof cachedData === "string" && cachedData.trim()) {
            return JSON.parse(cachedData);
        }
        else if (Array.isArray(cachedData)) {
            return cachedData;
        }
        else {
            return [];
        }
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to parse OpenAI compatible models cache", {
            profileUrl,
            error: error.message,
        });
        return [];
    }
}
/**
 * Sets cached models for a specific OpenAI compatible profile URL
 * @param {string} profileUrl - The base URL of the OpenAI compatible provider
 * @param {Array} models - Array of model objects to cache
 */
async function setCachedOpenAICompatModels(profileUrl, models) {
    try {
        const cacheKey = `openAICompatModels_${profileUrl}`;
        await GM_setValue(cacheKey, JSON.stringify(models));
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("info", "CACHE", `Cached models for OpenAI compatible provider: ${profileUrl}`);
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to cache OpenAI compatible models", {
            profileUrl,
            error: error.message,
        });
    }
}
/**
 * Clears cached models for all OpenAI compatible providers
 */
async function clearCachedOpenAICompatModels() {
    try {
        // Get the profiles to know which cache keys to clear
        let profiles = {};
        try {
            const profilesData = await GM_getValue("openAICompatProfiles", "{}");
            if (typeof profilesData === "string" && profilesData.trim()) {
                profiles = JSON.parse(profilesData);
            }
            else if (typeof profilesData === "object" && profilesData !== null) {
                profiles = profilesData;
            }
        }
        catch (error) {
            (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to get OpenAI profiles for cache clearing", { error: error.message });
            return;
        }
        // Clear cache for each known profile
        for (const profileUrl of Object.keys(profiles)) {
            const cacheKey = `openAICompatModels_${profileUrl}`;
            await GM_setValue(cacheKey, "[]");
        }
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .logInfo */ .fH)("CACHE", "Cleared cached models for all OpenAI compatible providers.");
    }
    catch (error) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("error", "CACHE", "Failed to clear OpenAI compatible model caches", {
            error: error.message,
        });
    }
}


/***/ },

/***/ 409
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ downloadFile),
/* harmony export */   t: () => (/* binding */ getScriptName)
/* harmony export */ });
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function getScriptName() {
    const scriptName = "WTR LAB Novel Image Generator";
    return scriptName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
}


/***/ },

/***/ 187
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $f: () => (/* binding */ getEnhancementLogHistory),
/* harmony export */   JE: () => (/* binding */ logWarn),
/* harmony export */   MD: () => (/* binding */ logDebug),
/* harmony export */   RJ: () => (/* binding */ updateLoggingStatus),
/* harmony export */   Rm: () => (/* binding */ log),
/* harmony export */   X: () => (/* binding */ clearEnhancementLogs),
/* harmony export */   fH: () => (/* binding */ logInfo),
/* harmony export */   vV: () => (/* binding */ logError),
/* harmony export */   xx: () => (/* binding */ loadEnhancementLogHistory)
/* harmony export */ });
/* unused harmony export formatLogEntry */
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(201);

let loggingEnabled = false;
let enhancementLogHistory = [];
/**
 * Updates the logging status from storage. Should be called on init.
 */
async function updateLoggingStatus() {
    loggingEnabled = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .getConfigValue */ .Ct)("loggingEnabled");
}
/**
 * The core logging function.
 * @param {'info'|'debug'|'warn'|'error'} level - The log level.
 * @param {string} category - The category of the log (e.g., 'UI', 'API').
 * @param {string} message - The log message.
 * @param {any} [data=null] - Optional data to log.
 */
function log(level, category, message, data = null) {
    const normalizedLevel = (level || "").toLowerCase();
    // Always log critical errors and warnings, regardless of toggle state
    const isCritical = normalizedLevel === "error" ||
        normalizedLevel === "warn" ||
        category === "SECURITY" ||
        category === "ERROR" ||
        category === "APP" ||
        category === "CONFIG_IMPORT";
    if (!loggingEnabled && !isCritical) {
        // When logging is disabled, completely suppress debug/info and non-critical logs
        return;
    }
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level: normalizedLevel,
        category,
        message,
        data,
    };
    const prefix = `[NIG-${normalizedLevel.toUpperCase()}]`;
    const categoryPrefix = `[${category}]`;
    const style = {
        error: "color: #ef4444",
        warn: "color: #f59e0b",
        debug: "color: #8b5cf6",
        info: "color: #6366f1",
    }[normalizedLevel];
    // Route to appropriate console method, ensuring critical visibility
    const consoleMethod = (() => {
        if (normalizedLevel === "error") {
            return console.error;
        }
        if (normalizedLevel === "warn") {
            return console.warn;
        }
        if (normalizedLevel === "info") {
            return console.info;
        }
        if (normalizedLevel === "debug") {
            return console.debug || console.log;
        }
        return console.log;
    })();
    if (data !== null && data !== undefined) {
        consoleMethod(`%c${prefix}`, style, categoryPrefix, message, data);
    }
    else {
        consoleMethod(`%c${prefix}`, style, categoryPrefix, message);
    }
    // Persist enhancement-related logs for history when logging is enabled
    if (loggingEnabled && category === "ENHANCEMENT") {
        enhancementLogHistory.unshift(logEntry);
        if (enhancementLogHistory.length > 50) {
            enhancementLogHistory = enhancementLogHistory.slice(0, 50);
        }
        GM_setValue("enhancementLogHistory", JSON.stringify(enhancementLogHistory.slice(0, 20)));
    }
}
// Convenience methods for different log levels
const logInfo = (category, message, data = null) => log("info", category, message, data);
const logDebug = (category, message, data = null) => log("debug", category, message, data);
const logWarn = (category, message, data = null) => log("warn", category, message, data);
const logError = (category, message, data = null) => log("error", category, message, data);
/**
 * Loads enhancement log history from storage.
 */
async function loadEnhancementLogHistory() {
    try {
        const stored = await GM_getValue("enhancementLogHistory", "[]");
        if (typeof stored === "string" && stored.trim()) {
            enhancementLogHistory = JSON.parse(stored);
        }
        else if (Array.isArray(stored)) {
            enhancementLogHistory = stored;
        }
        else {
            enhancementLogHistory = [];
        }
        logDebug("LOG", `Loaded ${enhancementLogHistory.length} enhancement log entries from storage`);
    }
    catch (e) {
        logError("LOG", "Failed to load enhancement log history", e);
        enhancementLogHistory = [];
        // Clear corrupted data
        try {
            await GM_setValue("enhancementLogHistory", "[]");
        }
        catch (clearError) {
            logError("LOG", "Failed to clear corrupted enhancement log history", clearError);
        }
    }
}
async function getEnhancementLogHistory() {
    await loadEnhancementLogHistory();
    return enhancementLogHistory;
}
function clearEnhancementLogs() {
    enhancementLogHistory = [];
    GM_setValue("enhancementLogHistory", "[]");
    logInfo("LOG", "Enhancement logs cleared by user");
}
function formatLogEntry(entry) {
    const time = new Date(entry.timestamp).toLocaleString();
    const levelColors = {
        ERROR: "#ef4444",
        WARN: "#f59e0b",
        INFO: "#6366f1",
        DEBUG: "#8b5cf6",
    };
    const color = levelColors[entry.level.toUpperCase()] || "#6366f1";
    return {
        time,
        level: entry.level,
        category: entry.category,
        message: entry.message,
        color,
        data: entry.data,
    };
}


/***/ },

/***/ 201
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Pc: () => (/* binding */ addToHistory),
  qg: () => (/* binding */ cleanHistoryEnhanced),
  j5: () => (/* binding */ cleanOldHistory),
  zj: () => (/* binding */ getConfig),
  Ct: () => (/* binding */ getConfigValue),
  A5: () => (/* binding */ getFilteredHistory),
  Iy: () => (/* binding */ getHistoryDays),
  yJ: () => (/* binding */ setConfigValue),
  qH: () => (/* binding */ setHistoryDays)
});

// UNUSED EXPORTS: getHistory

// EXTERNAL MODULE: ./src/config/defaults.ts
var defaults = __webpack_require__(916);
;// ./src/config/migration.ts
// src/config/migration.ts
// Schema-versioned config migration for existing users.
//
// When DEFAULTS change in ways that existing stored values should be updated
// (e.g. new Zen enhancement defaults), a migration step runs on config load to
// upgrade stale/empty settings while preserving truly custom user values.

const ZEN_DEFAULT_URL = defaults/* DEFAULTS */.z.enhancementBaseUrl;
const ZEN_DEFAULT_MODEL = defaults/* DEFAULTS */.z.enhancementModel;
function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function isZenEndpoint(baseUrl) {
    return typeof baseUrl === "string" && baseUrl.includes("opencode.ai/zen");
}
/**
 * Determines whether a stored enhancement model is a stale legacy value that
 * should be replaced with the Zen default.
 * Stale = empty, non-string, or provider-prefixed (e.g. "models/...").
 */
function isStaleModel(model) {
    if (!isNonEmptyString(model)) {
        return true;
    }
    return model.startsWith("models/");
}
/**
 * Migrates a config object to the current schema version.
 *
 * - Skips entirely when configSchemaVersion is already current.
 * - For schema v1 → v2: upgrades empty/stale enhancement settings to Zen
 *   defaults (https://opencode.ai/zen/v1, big-pickle, dropdown mode) while
 *   preserving non-empty custom endpoints and models.
 * - Bumps configSchemaVersion to CONFIG_SCHEMA_VERSION after migration.
 *
 * @param config - The raw config object loaded from storage
 * @returns The migrated config object (same reference if no migration needed)
 */
function migrateConfig(config) {
    const version = typeof config?.configSchemaVersion === "number"
        ? config.configSchemaVersion
        : 1;
    if (version >= defaults/* CONFIG_SCHEMA_VERSION */.C) {
        return config;
    }
    const migrated = { ...config };
    // --- v1 → v2: Zen enhancement defaults migration ---
    if (version < 2) {
        const hasCustomEndpoint = isNonEmptyString(migrated.enhancementBaseUrl);
        const hasCustomModel = !isStaleModel(migrated.enhancementModel);
        if (!hasCustomEndpoint) {
            migrated.enhancementBaseUrl = ZEN_DEFAULT_URL;
        }
        if (!hasCustomModel) {
            migrated.enhancementModel = ZEN_DEFAULT_MODEL;
        }
        // When any enhancement setting was migrated to Zen, ensure dropdown mode
        // so the user sees the free-model list rather than a blank manual input.
        if ((!hasCustomEndpoint || !hasCustomModel) && isZenEndpoint(migrated.enhancementBaseUrl)) {
            migrated.enhancementModelManualInput = false;
        }
    }
    migrated.configSchemaVersion = defaults/* CONFIG_SCHEMA_VERSION */.C;
    return migrated;
}

;// ./src/utils/linkValidator.ts
/**
 * Link validation utility for checking image URL accessibility
 */
/**
 * Checks if an image URL is accessible and valid
 * @param {string} url - The image URL to validate
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Result object with status and accessibility info
 */
async function validateImageLink(url, timeout = 5000) {
    // Skip validation for data URLs (base64 images)
    if (url.startsWith("data:")) {
        return {
            isAccessible: true,
            status: "valid",
            error: null,
            method: "data-url",
        };
    }
    // Skip validation for blob URLs
    if (url.startsWith("blob:")) {
        return {
            isAccessible: true,
            status: "valid",
            error: null,
            method: "blob-url",
        };
    }
    try {
        // Try HEAD request first (more efficient)
        const headController = new AbortController();
        const headTimeoutId = setTimeout(() => headController.abort(), timeout);
        const headResponse = await fetch(url, {
            method: "HEAD",
            mode: "cors",
            signal: headController.signal,
            cache: "no-cache",
        });
        clearTimeout(headTimeoutId);
        if (headResponse.ok) {
            return {
                isAccessible: true,
                status: headResponse.status,
                statusText: headResponse.statusText,
                error: null,
                method: "head",
            };
        }
        // If HEAD fails with certain status codes, try GET
        if (headResponse.status === 405 || headResponse.status === 501) {
            // Method Not Allowed or Not Implemented - try GET
            const getController = new AbortController();
            const getTimeoutId = setTimeout(() => getController.abort(), timeout);
            const getResponse = await fetch(url, {
                method: "GET",
                mode: "cors",
                signal: getController.signal,
                cache: "no-cache",
            });
            clearTimeout(getTimeoutId);
            return {
                isAccessible: getResponse.ok,
                status: getResponse.status,
                statusText: getResponse.statusText,
                error: getResponse.ok
                    ? null
                    : new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`),
                method: "get",
            };
        }
        // For other error status codes (403, 404, 500, etc.)
        return {
            isAccessible: false,
            status: headResponse.status,
            statusText: headResponse.statusText,
            error: new Error(`HTTP ${headResponse.status}: ${headResponse.statusText}`),
            method: "head",
        };
    }
    catch (error) {
        // Handle network errors, CORS issues, timeouts, etc.
        if (error.name === "AbortError") {
            return {
                isAccessible: false,
                status: "timeout",
                statusText: "Request timeout",
                error: new Error("Request timeout"),
                method: "timeout",
            };
        }
        if (error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError")) {
            return {
                isAccessible: false,
                status: "network-error",
                statusText: "Network error or CORS blocked",
                error: new Error("Network error or CORS blocked"),
                method: "network-error",
            };
        }
        return {
            isAccessible: false,
            status: "unknown-error",
            statusText: "Unknown error",
            error: error,
            method: "error",
        };
    }
}
/**
 * Validates multiple image links concurrently with progress callback
 * @param {Array<string>} urls - Array of image URLs to validate
 * @param {Function} progressCallback - Callback function for progress updates
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Array<Object>>} Array of validation results
 */
async function validateImageLinks(urls, progressCallback = null, timeout = 5000) {
    const results = [];
    const total = urls.length;
    // Process URLs in batches to avoid overwhelming the network
    const batchSize = 3;
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchPromises = batch.map(async (url, _index) => {
            const result = await validateImageLink(url, timeout);
            result.url = url;
            return result;
        });
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        // Update progress
        if (progressCallback) {
            progressCallback({
                current: Math.min(i + batchSize, total),
                total: total,
                completed: results.length,
                failed: results.filter((r) => !r.isAccessible).length,
            });
        }
        // Small delay between batches to be respectful to servers
        if (i + batchSize < urls.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    return results;
}
/**
 * Filters history entries to remove expired/broken links
 * @param {Array<Object>} history - History entries to filter
 * @param {Function} progressCallback - Optional progress callback
 * @returns {Promise<Object>} Object with filtered history and statistics
 */
async function filterExpiredLinks(history, progressCallback = null) {
    const urlsToCheck = history
        .filter((entry) => entry.url &&
        !entry.url.startsWith("data:") &&
        !entry.url.startsWith("blob:"))
        .map((entry) => entry.url);
    if (urlsToCheck.length === 0) {
        return {
            filteredHistory: history,
            expiredLinksCount: 0,
            totalLinksChecked: 0,
            results: [],
        };
    }
    const validationResults = await validateImageLinks(urlsToCheck, progressCallback);
    const expiredUrls = validationResults
        .filter((result) => !result.isAccessible)
        .map((result) => result.url);
    const validEntries = history.filter((entry) => {
        if (!entry.url ||
            entry.url.startsWith("data:") ||
            entry.url.startsWith("blob:")) {
            return true; // Always keep data URLs and blob URLs
        }
        return !expiredUrls.includes(entry.url);
    });
    return {
        filteredHistory: validEntries,
        expiredLinksCount: expiredUrls.length,
        totalLinksChecked: urlsToCheck.length,
        results: validationResults,
    };
}

;// ./src/utils/storage.ts



/**
 * Retrieves a single configuration value from storage.
 * @param {string} key - The key of the config value to retrieve.
 * @returns {Promise<any>} The value from storage or the default value.
 */
async function getConfigValue(key) {
    return await GM_getValue(key, defaults/* DEFAULTS */.z[key]);
}
/**
 * Retrieves the entire configuration object from storage.
 * Runs schema-versioned migration on load to upgrade stale/empty settings
 * (e.g. Zen enhancement defaults) for existing users.
 * @returns {Promise<object>} The complete configuration object.
 */
async function getConfig() {
    const config = {};
    for (const key in defaults/* DEFAULTS */.z) {
        config[key] = await GM_getValue(key, defaults/* DEFAULTS */.z[key]);
    }
    // Run config migration if the stored schema version is outdated
    const migrated = migrateConfig(config);
    if (migrated !== config) {
        for (const key in migrated) {
            if (migrated[key] !== config[key]) {
                await GM_setValue(key, migrated[key]);
            }
        }
    }
    return migrated;
}
/**
 * Sets a configuration value in storage.
 * @param {string} key - The key of the config value to set.
 * @param {any} value - The value to store.
 */
async function setConfigValue(key, value) {
    await GM_setValue(key, value);
}
/**
 * Retrieves the generation history from storage.
 * @returns {Promise<Array<object>>} The history array.
 */
async function getHistory() {
    try {
        const historyData = await GM_getValue("history", "[]");
        if (typeof historyData === "string" && historyData.trim()) {
            return JSON.parse(historyData);
        }
        else if (Array.isArray(historyData)) {
            return historyData;
        }
        else {
            // Invalid or empty data, return empty array
            return [];
        }
    }
    catch (error) {
        console.error("Failed to parse history data, resetting", error);
        // Clear the corrupted history and return empty array
        await GM_setValue("history", "[]");
        return [];
    }
}
/**
 * Adds a new item to the generation history.
 * @param {object} item - The history item to add.
 */
async function addToHistory(item) {
    const history = await getHistory();
    history.unshift(item);
    // Limit history to the last 100 entries
    if (history.length > 100) {
        history.pop();
    }
    await GM_setValue("history", JSON.stringify(history));
}
/**
 * Retrieves the history days setting from storage.
 * @returns {Promise<number>} The number of days for history retention.
 */
async function getHistoryDays() {
    try {
        const days = await GM_getValue("historyDays", defaults/* DEFAULTS */.z.historyDays);
        // Validate and ensure the value is a positive number
        const parsedDays = parseInt(days);
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
            console.warn("Invalid historyDays value, using default:", days);
            await setHistoryDays(defaults/* DEFAULTS */.z.historyDays);
            return defaults/* DEFAULTS */.z.historyDays;
        }
        return parsedDays;
    }
    catch (error) {
        console.error("Failed to get historyDays setting:", error);
        return defaults/* DEFAULTS */.z.historyDays;
    }
}
/**
 * Sets the history days setting in storage.
 * @param {number} days - The number of days to retain history.
 */
async function setHistoryDays(days) {
    try {
        // Validate the input
        const parsedDays = parseInt(days);
        if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
            throw new Error(`Invalid historyDays value: ${days}. Must be between 1 and 365.`);
        }
        await GM_setValue("historyDays", parsedDays);
        return true;
    }
    catch (error) {
        console.error("Failed to set historyDays:", error);
        throw error;
    }
}
/**
 * Gets filtered history based on the configured days setting.
 * @returns {Promise<Array<object>>} The filtered history array.
 */
async function getFilteredHistory() {
    try {
        const history = await getHistory();
        const historyDays = await getHistoryDays();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - historyDays);
        return history.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate > cutoffDate;
        });
    }
    catch (error) {
        console.error("Failed to get filtered history:", error);
        return await getHistory(); // Fallback to unfiltered history
    }
}
/**
 * Cleans old history entries based on the configured days setting.
 * @returns {Promise<number>} The number of entries removed.
 */
async function cleanOldHistory() {
    try {
        const history = await getHistory();
        const historyDays = await getHistoryDays();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - historyDays);
        const filteredHistory = history.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate > cutoffDate;
        });
        const removedCount = history.length - filteredHistory.length;
        if (removedCount > 0) {
            await GM_setValue("history", JSON.stringify(filteredHistory));
        }
        return removedCount;
    }
    catch (error) {
        console.error("Failed to clean old history:", error);
        throw error;
    }
}
/**
 * Enhanced cleaning function that removes both expired links and old entries.
 * @param {Function} progressCallback - Optional callback for progress updates during link validation
 * @returns {Promise<Object>} Object containing cleaning statistics.
 */
async function cleanHistoryEnhanced(progressCallback = null) {
    try {
        const history = await getHistory();
        const historyDays = await getHistoryDays();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - historyDays);
        // Step 1: Filter out old entries based on age
        const ageFilteredHistory = history.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate > cutoffDate;
        });
        const oldEntriesRemoved = history.length - ageFilteredHistory.length;
        // Step 2: Filter out entries with broken/expired links
        const linkValidationResult = await filterExpiredLinks(ageFilteredHistory, progressCallback);
        const expiredLinksRemoved = linkValidationResult.expiredLinksCount;
        const finalFilteredHistory = linkValidationResult.filteredHistory;
        // Step 3: Save the cleaned history
        const totalRemoved = oldEntriesRemoved + expiredLinksRemoved;
        if (totalRemoved > 0) {
            await GM_setValue("history", JSON.stringify(finalFilteredHistory));
        }
        return {
            totalRemoved: totalRemoved,
            oldEntriesRemoved: oldEntriesRemoved,
            expiredLinksRemoved: expiredLinksRemoved,
            totalLinksChecked: linkValidationResult.totalLinksChecked,
            finalHistoryCount: finalFilteredHistory.length,
        };
    }
    catch (error) {
        console.error("Failed to clean history with enhanced method:", error);
        throw error;
    }
}


/***/ },

/***/ 511
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GQ: () => (/* binding */ showConfirm),
/* harmony export */   P0: () => (/* binding */ showToast),
/* harmony export */   ZD: () => (/* binding */ escapeHtml),
/* harmony export */   nI: () => (/* binding */ setupModalA11y),
/* harmony export */   q9: () => (/* binding */ showPrompt)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(187);
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
function escapeHtml(str) {
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
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
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
function setupModalA11y(modalElement, options) {
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
    }
    else {
        modalElement.setAttribute("tabindex", "-1");
        modalElement.focus();
    }
    // Focus trap: cycle focus within the modal
    function handleKeydown(e) {
        if (e.key === "Escape" && closeOnEscape) {
            e.preventDefault();
            e.stopPropagation();
            cleanup();
            if (onClose) {
                onClose();
            }
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
            }
            else {
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
            }
            catch (_e) {
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
function showToast(message, type = "info", duration = 4000) {
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
            if (dismissed) {
                return;
            }
            dismissed = true;
            toast.classList.remove("nig-toast-visible");
            setTimeout(() => toast.remove(), 300);
        };
        closeBtn.addEventListener("click", dismiss);
        if (duration > 0) {
            setTimeout(dismiss, duration);
        }
    }
    catch (e) {
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
function showConfirm(message, title = "Please Confirm") {
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
            if (msgEl) {
                msgEl.textContent = String(message);
            }
            let resolved = false;
            const cleanup = setupModalA11y(overlay, {
                labelledBy: titleId,
                closeOnEscape: true,
            });
            const close = (result) => {
                if (resolved) {
                    return;
                }
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
                if (e.target === overlay) {
                    close(false);
                }
            });
        }
        catch (e) {
            _logger__WEBPACK_IMPORTED_MODULE_0__/* .logError */ .vV("UI", "Failed to show confirm dialog", {
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
function showPrompt(message, defaultValue = "", title = "Input Required") {
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
            if (labelEl) {
                labelEl.textContent = String(message);
            }
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
                if (resolved) {
                    return;
                }
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
                if (e.target === overlay) {
                    close(null);
                }
            });
        }
        catch (e) {
            _logger__WEBPACK_IMPORTED_MODULE_0__/* .logError */ .vV("UI", "Failed to show prompt dialog", {
                error: (e)?.message,
            });
            resolve(null);
        }
    });
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css
var main = __webpack_require__(249);
;// ./src/styles/main.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.A, options);




       /* harmony default export */ const styles_main = (main/* default */.A && main/* default */.A.locals ? main/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./src/utils/logger.ts
var logger = __webpack_require__(187);
// EXTERNAL MODULE: ./src/utils/storage.ts + 2 modules
var storage = __webpack_require__(201);
;// ./src/utils/error.ts
/**
 * Parses a raw error string into a user-friendly message and a retryable status.
 * @param {string} errorString - The raw error message from the API.
 * @param {string|null} provider - The name of the provider that failed.
 * @param {string|null} providerProfileUrl - The URL of the OpenAI compatible profile, if applicable.
 * @returns {{message: string, retryable: boolean}}
 */
function parseErrorMessage(errorString, provider = null, providerProfileUrl = null) {
    const messageContent = String(errorString);
    const lowerCaseContent = messageContent.toLowerCase();
    if (lowerCaseContent.includes("error code: 524") ||
        lowerCaseContent.includes("timed out") ||
        lowerCaseContent.includes("502 bad gateway") ||
        lowerCaseContent.includes("unable to reach the origin service")) {
        return {
            message: "The generation service is temporarily unavailable or busy (e.g., 502 Bad Gateway). This is usually a temporary issue. Please try again in a few minutes.",
            retryable: true,
        };
    }
    // Check for specific OpenAI Compatible provider false positive error
    if (provider === "OpenAICompat" &&
        providerProfileUrl?.includes("api.mnnai.ru")) {
        try {
            const errorJson = JSON.parse(messageContent.substring(messageContent.indexOf("{")));
            if (errorJson.error ===
                "Sorry, there's been some kind of mistake, please use a different model") {
                return {
                    message: "Temporary service error detected. The same prompt typically works on retry. This error will be automatically retried.",
                    retryable: true,
                };
            }
        }
        catch (e) {
            /* Fall through */
        }
    }
    if (lowerCaseContent.includes("unsafe content") ||
        lowerCaseContent.includes("safety system") ||
        lowerCaseContent.includes("moderation_blocked")) {
        return {
            message: "The prompt was rejected by the safety system for containing potentially unsafe content.",
            retryable: false,
        };
    }
    // Check for OpenAI-compatible provider model access / tier restriction errors
    if (provider === "OpenAICompat" &&
        (lowerCaseContent.includes("access denied for model") ||
            lowerCaseContent.includes("not available for free users") ||
            lowerCaseContent.includes("premium model requires a subscription") ||
            lowerCaseContent.includes('"code":402') ||
            lowerCaseContent.includes("requires a subscription") ||
            lowerCaseContent.includes("your plan does not have access to model"))) {
        return {
            message: "The selected model is not available for your current plan. You may switch to a free model, choose a supported provider, or upgrade your account according to your provider’s tiers.",
            // Keep this retryable so the UI allows switching provider/model and retrying.
            retryable: true,
            errorType: "model_access",
            isNonRetryable: false,
        };
    }
    // Check for AIHorde specific API key validation errors
    if (provider === "AIHorde" &&
        lowerCaseContent.includes("no user matching sent api key")) {
        return {
            message: "AIHorde API key validation failed. Please check your API key configuration and ensure you have registered at https://stablehorde.net/register. You can try a different provider or update your API key in settings.",
            retryable: true,
            errorType: "api_key_validation",
            isNonRetryable: false,
        };
    }
    // Check for OpenAI Compatible provider specific errors
    if (provider === "OpenAICompat") {
        // Check for authentication errors (non-retryable)
        if (lowerCaseContent.includes("invalid api key") ||
            lowerCaseContent.includes("authentication failed") ||
            lowerCaseContent.includes("unauthorized")) {
            return {
                message: "Authentication failed. Please check your API key configuration and ensure it is valid for this OpenAI-compatible provider.",
                retryable: false,
                errorType: "authentication",
                isNonRetryable: true,
            };
        }
        // Check for IP address mismatch errors (retryable)
        if (lowerCaseContent.includes("ip address mismatch")) {
            return {
                message: "IP Address Mismatch: Your current IP doesn't match your account. Try the /user resetip command in the Discord server or upgrade to premium for multi-IP support.",
                retryable: true,
                errorType: "ip_mismatch",
                isNonRetryable: false,
                discordLink: "https://discord.gg/zukijourney",
                resetipCommand: "/user resetip",
            };
        }
        // Check for image conversion errors
        if (lowerCaseContent.includes("failed to convert image to base64") ||
            lowerCaseContent.includes("base64") ||
            lowerCaseContent.includes("image conversion")) {
            return {
                message: "Image conversion failed. The provider returned image data that could not be properly converted. This may be a temporary issue with the provider.",
                retryable: true,
                errorType: "image_conversion",
                isNonRetryable: false,
            };
        }
        // Check for JSON parsing errors
        if (lowerCaseContent.includes("html response instead of json") ||
            lowerCaseContent.includes("unexpected token '<'") ||
            lowerCaseContent.includes("received html")) {
            return {
                message: "The API endpoint returned an HTML page instead of JSON data. This usually indicates endpoint configuration issues, authentication problems, or an invalid API endpoint URL. Please check your OpenAI-compatible provider configuration.",
                retryable: false,
                errorType: "html_response",
                isNonRetryable: true,
                endpointIssue: true,
            };
        }
        // Check for malformed JSON errors
        if (lowerCaseContent.includes("json parsing failed") ||
            lowerCaseContent.includes("malformed json") ||
            lowerCaseContent.includes("unexpected character at line 1 column 1")) {
            return {
                message: "The API returned malformed or invalid JSON data. This may indicate server issues with the OpenAI-compatible provider. Please try again later or contact the provider support.",
                retryable: true,
                errorType: "malformed_json",
                isNonRetryable: false,
                serverIssue: true,
            };
        }
        // Check for generic JSON parse errors
        if (lowerCaseContent.includes("json parse error") ||
            lowerCaseContent.includes("json parsing error") ||
            lowerCaseContent.includes("invalid json")) {
            return {
                message: "JSON parsing failed for the API response. This may indicate server issues or malformed response from the OpenAI-compatible provider.",
                retryable: true,
                errorType: "json_parse_error",
                isNonRetryable: false,
            };
        }
    }
    try {
        const errorJson = JSON.parse(messageContent.substring(messageContent.indexOf("{")));
        const message = errorJson.message ||
            (errorJson.error ? errorJson.error.message : null) ||
            JSON.stringify(errorJson);
        return {
            message: typeof message === "object" ? JSON.stringify(message) : message,
            retryable: false,
        };
    }
    catch (e) {
        return {
            message: messageContent || "An unknown error occurred.",
            retryable: false,
        };
    }
}

;// ./src/utils/promptUtils.ts
/**
 * Prompt Utilities for cleaning and formatting prompts
 * Provides functionality to clean prompts for API transmission
 */
/**
 * Cleans excessive newline characters from prompts for API transmission
 * Removes 3+ consecutive newlines and reduces to 2 newlines maximum
 * Removes leading/trailing newlines and trims whitespace
 * @param {string} prompt - The prompt to clean
 * @returns {string} - The cleaned prompt suitable for API transmission
 */
function cleanPromptForApi(prompt) {
    if (!prompt || typeof prompt !== "string") {
        return prompt;
    }
    return prompt
        .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2 newlines
        .replace(/^\n+|\n+$/g, "") // Remove leading and trailing newlines
        .trim();
}
/**
 * Validates and sanitizes a prompt
 * @param {string} prompt - The prompt to validate
 * @returns {boolean} - True if prompt is valid
 */
function isValidPrompt(prompt) {
    if (!prompt || typeof prompt !== "string") {
        return false;
    }
    // Check for minimum length
    if (prompt.trim().length === 0) {
        return false;
    }
    // Check for maximum length (reasonable limit for API calls)
    if (prompt.length > 32000) {
        // 32K character limit
        return false;
    }
    return true;
}
/**
 * Logs prompt cleaning information for debugging
 * @param {string} originalPrompt - The original prompt
 * @param {string} cleanedPrompt - The cleaned prompt
 * @param {string} context - Context where cleaning occurred
 */
function logPromptCleaning(_originalPrompt, _cleanedPrompt, _context) {
    // Intentionally a no-op placeholder:
    // - Callers may treat this as a debug hook.
    // - Using underscored params keeps ESLint satisfied and documents intent.
}
/**
 * Main function to get a prompt ready for API transmission
 * Combines validation, cleaning, and logging
 * @param {string} prompt - The prompt to process
 * @param {string} context - Context for logging (e.g., 'generate', 'enhance')
 * @returns {string} - The cleaned prompt
 */
function getApiReadyPrompt(prompt, context = "api") {
    if (!isValidPrompt(prompt)) {
        return prompt || "";
    }
    const originalPrompt = prompt;
    const cleanedPrompt = cleanPromptForApi(prompt);
    // Log if prompt was actually cleaned
    if (originalPrompt !== cleanedPrompt) {
        logPromptCleaning(originalPrompt, cleanedPrompt, context);
    }
    return cleanedPrompt;
}

;// ./src/utils/abortRegistry.ts
/**
 * Abort Registry — tracks active GM_xmlhttpRequest handles and setTimeout timers
 * so that in-flight generation/enhancement/polling can be cancelled by the user.
 *
 * Each generate() call captures the cancel token at start; onload/onerror handlers
 * compare the live token to detect cancellation and skip callbacks silently.
 */
const activeRequests = new Set();
const activeTimers = new Set();
let cancelToken = 0;
/**
 * Returns the current cancel token. Callers capture this at the start of a
 * generate/enhance cycle and compare it later to detect cancellation.
 */
function getCancelToken() {
    return cancelToken;
}
/**
 * Tracks a GM_xmlhttpRequest handle so it can be aborted on cancel.
 * Returns the handle for convenience.
 */
function trackRequest(handle) {
    if (handle) {
        activeRequests.add(handle);
    }
    return handle;
}
/**
 * Removes a handle from tracking (called after onload/onerror completes).
 */
function untrackRequest(handle) {
    activeRequests.delete(handle);
}
/**
 * Tracks a setTimeout timer ID so it can be cleared on cancel.
 * Returns the timer ID for convenience.
 */
function trackTimer(timerId) {
    if (timerId) {
        activeTimers.add(timerId);
    }
    return timerId;
}
/**
 * Removes a timer from tracking.
 */
function untrackTimer(timerId) {
    activeTimers.delete(timerId);
}
/**
 * Aborts all tracked requests and clears all tracked timers.
 * Increments the cancel token so in-flight callbacks detect cancellation.
 * Returns the total number of requests and timers that were cancelled.
 */
function abortAll() {
    cancelToken++;
    let count = 0;
    for (const handle of activeRequests) {
        try {
            const h = handle;
            if (typeof h.abort === "function") {
                h.abort();
            }
        }
        catch {
            // Ignore abort errors
        }
        count++;
    }
    activeRequests.clear();
    for (const timer of activeTimers) {
        try {
            clearTimeout(timer);
        }
        catch {
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
function hasActive() {
    return activeRequests.size > 0 || activeTimers.size > 0;
}

;// ./src/api/enhancement.ts



/**
 * Extracts the Retry-After delay (in milliseconds) from an HTTP response.
 * Returns null when no valid Retry-After header is present.
 * @param {object} response - GM_xmlhttpRequest response object
 * @returns {number|null} Delay in ms, or null
 */
function parseRetryAfter(response) {
    if (!response) {
        return null;
    }
    const headers = response.responseHeaders || "";
    const match = headers.match(/^retry-after:\s*(\d+)/im);
    if (match) {
        return Math.min(parseInt(match[1], 10) * 1000, 60000);
    }
    return null;
}
/**
 * Detects if response content is HTML instead of JSON.
 * Mirrors the pattern from openAI.ts for consistent error handling.
 * @param {string} responseText - The response text to check
 * @returns {boolean} - True if content appears to be HTML
 */
function isHtmlResponse(responseText) {
    const trimmed = responseText.trim().toLowerCase();
    return (trimmed.startsWith("<!doctype") ||
        trimmed.startsWith("<html") ||
        trimmed.includes("<!doctype") ||
        trimmed.includes("<html>") ||
        trimmed.startsWith("<!") ||
        trimmed.startsWith("<head>") ||
        trimmed.includes("<title>"));
}
/**
 * Safely parses JSON with enhanced error handling.
 * @param {string} responseText - The response text to parse
 * @param {string} endpointUrl - The endpoint URL for context in error messages
 * @returns {object} - Parsed JSON object
 */
function safeJsonParse(responseText, endpointUrl) {
    try {
        return JSON.parse(responseText);
    }
    catch (e) {
        if (isHtmlResponse(responseText)) {
            throw new Error(`Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`);
        }
        throw new Error(`JSON parsing error: ${e.message}. This may indicate server issues or malformed response.`);
    }
}
/**
 * Determines if the selected image provider's built-in enhancement should be used.
 * This is provider-agnostic: it checks the IMAGE provider (e.g., Pollinations)
 * for built-in enhancement, not the enhancement endpoint provider.
 * @param {string} provider - The name of the image generation provider.
 * @param {object} config - The current script configuration.
 * @returns {boolean} - True if provider enhancement should be used.
 */
function shouldUseProviderEnhancement(provider, config) {
    (0,logger/* logDebug */.MD)("ENHANCEMENT", "Checking provider priority for enhancement", {
        provider,
        config,
    });
    const shouldUse = (() => {
        if (provider === "Pollinations") {
            const result = config.pollinationsEnhance;
            (0,logger/* logInfo */.fH)("ENHANCEMENT", `Provider ${provider} has built-in enhancement: ${result}`);
            return result;
        }
        (0,logger/* logInfo */.fH)("ENHANCEMENT", `Provider ${provider} does not have built-in enhancement`);
        return false;
    })();
    (0,logger/* logDebug */.MD)("ENHANCEMENT", "Provider priority decision completed", {
        shouldUseProviderEnhancement: shouldUse,
        willUseExternalAI: config.enhancementEnabled &&
            config.enhancementBaseUrl &&
            (!shouldUse || config.enhancementOverrideProvider),
    });
    return shouldUse;
}
/**
 * Enhances a given prompt using an OpenAI-compatible /chat/completions endpoint
 * with robust retry and fallback logic.
 *
 * Supports any OpenAI-compatible provider (cloud or local) including OpenAI,
 * OpenRouter, Ollama, LM Studio, and vLLM.
 *
 * @param {string} originalPrompt - The user's original prompt.
 * @param {object} config - The current script configuration.
 * @returns {Promise<string>} The enhanced prompt.
 */
async function enhancePrompt(originalPrompt, config) {
    const startTime = Date.now();
    const myToken = getCancelToken();
    const { enhancementBaseUrl: baseUrl, enhancementApiKey: apiKey, enhancementModel: rawModel, enhancementTemplate: userTemplateOverride, mainPromptStyle, subPromptStyle, customStyleEnabled, customStyleText, enhancementMaxRetriesPerModel = 2, enhancementRetryDelay = 1000, enhancementAlwaysFallback = true, } = config;
    const model = typeof rawModel === "string" ? rawModel.trim() : "";
    const endpointUrl = typeof baseUrl === "string" ? baseUrl.trim().replace(/\/+$/, "") : "";
    // Build a style-respecting instruction layer:
    // - If custom style is enabled, explicitly tell the model to preserve and reinforce it.
    // - Else if main/sub styles are set, tell the model to keep them.
    // - Otherwise, no extra constraint.
    const styleDirectives = (() => {
        if (customStyleEnabled &&
            customStyleText &&
            customStyleText.trim().length > 0) {
            return [
                `The user has explicitly chosen this style: "${customStyleText.trim()}".`,
                `You MUST preserve and honor this exact style and aesthetic.`,
                `Do NOT replace it with "photorealistic", "professional photography", or any other conflicting medium unless the user text itself asks for that.`,
                `All enhancements must be consistent with this declared style.`,
            ].join(" ");
        }
        if (mainPromptStyle && mainPromptStyle !== "None") {
            if (subPromptStyle && subPromptStyle !== "none") {
                return [
                    `The user has selected main style "${mainPromptStyle}" and sub-style "${subPromptStyle}".`,
                    `You MUST preserve and honor these styles as the primary aesthetic.`,
                    `Do NOT override them with photorealistic/technical photography language unless these styles explicitly imply it.`,
                    `All enhancements must be consistent with these selected styles.`,
                ].join(" ");
            }
            return [
                `The user has selected main style "${mainPromptStyle}".`,
                `You MUST preserve and honor this style as the primary aesthetic.`,
                `Do NOT override them with photorealistic/technical photography language unless this style explicitly implies it.`,
                `All enhancements must be consistent with this selected style.`,
            ].join(" ");
        }
        return "";
    })();
    // Base template: prefer user override from UI textarea, otherwise use config default.
    const baseTemplate = userTemplateOverride && userTemplateOverride.trim().length > 0
        ? userTemplateOverride.trim()
        : (config.enhancementTemplate || "").trim();
    // Merge base template and style directives into the system message.
    const mergedTemplate = [
        baseTemplate ||
            "Extract visual, image-ready elements from the text without changing its intended style.",
        styleDirectives,
    ]
        .filter(Boolean)
        .join(" ");
    if (!endpointUrl) {
        throw new Error("Enhancement endpoint URL is required for prompt enhancement.");
    }
    if (!model) {
        throw new Error("Enhancement model is required for prompt enhancement.");
    }
    (0,logger/* logInfo */.fH)("ENHANCEMENT", "Starting prompt enhancement via OpenAI-compatible endpoint", {
        originalLength: originalPrompt.length,
        endpointUrl,
        model,
        maxRetries: enhancementMaxRetriesPerModel,
        apiKeyPresent: Boolean(apiKey),
    });
    let lastError = null;
    let attempts = 0;
    while (attempts < enhancementMaxRetriesPerModel) {
        attempts++;
        try {
            const enhancedText = await attemptEnhancement(originalPrompt, model, mergedTemplate, endpointUrl, apiKey, attempts, enhancementMaxRetriesPerModel, myToken);
            const duration = Date.now() - startTime;
            (0,logger/* logInfo */.fH)("ENHANCEMENT", "Prompt enhancement successful", {
                model,
                attempts,
                duration,
            });
            return enhancedText;
        }
        catch (error) {
            lastError = error;
            // Don't retry if the request was cancelled by the user
            if (getCancelToken() !== myToken) {
                throw error;
            }
            (0,logger/* logInfo */.fH)("ENHANCEMENT", `Enhancement failed (attempt ${attempts}/${enhancementMaxRetriesPerModel})`, {
                model,
                attemptNumber: attempts,
                error: error.message,
            });
            // If this is not the last retry, wait before retrying
            if (attempts < enhancementMaxRetriesPerModel) {
                // Use Retry-After header value if available (e.g. from 429), otherwise default delay
                const delay = error.retryAfter !== undefined && error.retryAfter !== null
                    ? error.retryAfter
                    : enhancementRetryDelay;
                (0,logger/* logInfo */.fH)("ENHANCEMENT", `Retrying after delay`, {
                    retryDelay: delay,
                    nextAttempt: attempts + 1,
                    isRateLimited: error.status === 429,
                });
                await sleep(delay);
            }
        }
    }
    // All retries exhausted
    const duration = Date.now() - startTime;
    (0,logger/* logError */.vV)("ENHANCEMENT", "All retries exhausted for prompt enhancement", {
        totalAttempts: attempts,
        duration,
        lastError: lastError?.message,
        originalPrompt: originalPrompt.substring(0, 100) +
            (originalPrompt.length > 100 ? "..." : ""),
    });
    if (enhancementAlwaysFallback) {
        const fallbackPrompt = createBasicEnhancementFallback(originalPrompt);
        (0,logger/* logInfo */.fH)("ENHANCEMENT", "Providing basic enhancement fallback", {
            fallbackType: "basic_enhancement",
            originalLength: originalPrompt.length,
            fallbackLength: fallbackPrompt.length,
        });
        return fallbackPrompt;
    }
    throw new Error(`All enhancement attempts failed. Last error: ${lastError?.message || "Unknown error"}`);
}
/**
 * Attempts enhancement with the configured model via /chat/completions.
 */
async function attemptEnhancement(originalPrompt, model, template, endpointUrl, apiKey, _attemptNumber, _maxRetries, myToken) {
    const cleanPrompt = getApiReadyPrompt(originalPrompt, "enhancement");
    const url = `${endpointUrl}/chat/completions`;
    const requestData = {
        model,
        messages: [
            { role: "system", content: template },
            { role: "user", content: cleanPrompt },
        ],
        temperature: 0.7,
        stream: false,
    };
    const headers = { "Content-Type": "application/json" };
    // Send Bearer auth only when an API key is configured (supports no-auth local servers).
    if (apiKey && apiKey.trim().length > 0) {
        headers["Authorization"] = `Bearer ${apiKey.trim()}`;
    }
    return new Promise((resolve, reject) => {
        const timeout = 45000;
        const xhr = GM_xmlhttpRequest({
            method: "POST",
            url,
            headers,
            data: JSON.stringify(requestData),
            timeout,
            onload: (response) => {
                untrackRequest(xhr);
                if (getCancelToken() !== myToken) {
                    reject(new Error("Request canceled"));
                    return;
                }
                // Handle HTTP 429 rate-limiting with Retry-After support
                if (response.status === 429) {
                    const retryAfter = parseRetryAfter(response);
                    reject(Object.assign(new Error("Rate limited (429)"), {
                        retryable: true,
                        retryAfter,
                        status: 429,
                    }));
                    return;
                }
                try {
                    if (!response.responseText) {
                        throw new Error("Empty response received from enhancement endpoint");
                    }
                    const data = safeJsonParse(response.responseText, endpointUrl);
                    // Check for OpenAI-compatible error shape
                    if (data.error) {
                        throw new Error(data.error.message || "Enhancement API error");
                    }
                    const content = data.choices?.[0]?.message?.content;
                    if (content && typeof content === "string" && content.trim().length > 0) {
                        const enhancedText = content.trim();
                        const cleanedText = enhancedText.replace(/^["']|["']$/g, "");
                        resolve(cleanedText);
                    }
                    else {
                        throw new Error("No enhancement result received from endpoint");
                    }
                }
                catch (e) {
                    reject(e);
                }
            },
            onerror: () => {
                untrackRequest(xhr);
                if (getCancelToken() !== myToken) {
                    reject(new Error("Request canceled"));
                    return;
                }
                reject(new Error("Network error during enhancement request."));
            },
            ontimeout: () => {
                untrackRequest(xhr);
                if (getCancelToken() !== myToken) {
                    reject(new Error("Request canceled"));
                    return;
                }
                reject(new Error(`Enhancement request timed out after ${timeout / 1000} seconds.`));
            },
        });
        trackRequest(xhr);
    });
}
/**
 * Creates a basic enhancement fallback when all retries fail.
 * Provider-agnostic heuristic-based enhancement.
 */
function createBasicEnhancementFallback(originalPrompt) {
    let enhanced = originalPrompt;
    const qualityBoosters = [
        "highly detailed",
        "sharp focus",
        "8K resolution",
        "masterpiece",
    ];
    const hasQualityTerms = qualityBoosters.some((term) => enhanced.toLowerCase().includes(term.toLowerCase()));
    if (!hasQualityTerms) {
        enhanced += ", " + qualityBoosters.join(", ");
    }
    enhanced = enhanced.replace(/,+/g, ",").replace(/,\s*$/, "");
    return enhanced;
}
/**
 * Utility function to sleep for a given number of milliseconds
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// EXTERNAL MODULE: ./src/utils/cache.ts
var cache = __webpack_require__(165);
;// ./src/api/pollinations.ts





const POLLINATIONS_CURRENT_DEFAULT_MODEL = "zimage";
// Legacy Pollinations model names that were renamed to the current default.
// These are deliberate backward-compat aliases for obsolete catalog entries,
// not silent server-side fallbacks.
const POLLINATIONS_LEGACY_MODEL_ALIASES = new Set(["sana", "turbo"]);
const POLLINATIONS_GEN_ENDPOINT = "https://gen.pollinations.ai/v1/images/generations";
const POLLINATIONS_LEGACY_BASE = "https://image.pollinations.ai/prompt/";
const POLLINATIONS_REFERRER = "https://github.com/MasuRii/wtr-lab-novel-image-generator";
function normalizePollinationsModel(model) {
    const trimmedModel = typeof model === "string" ? model.trim() : "";
    if (!trimmedModel ||
        POLLINATIONS_LEGACY_MODEL_ALIASES.has(trimmedModel.toLowerCase())) {
        return POLLINATIONS_CURRENT_DEFAULT_MODEL;
    }
    return trimmedModel;
}
/**
 * Parses a GM_xmlhttpRequest responseHeaders string (newline-delimited
 * "Name: value" pairs) into a lowercase-keyed lookup map.
 * @param {string} responseHeaders - Raw headers string from GM_xmlhttpRequest
 * @returns {Record<string, string>} Lowercase header name -> value
 */
function parseResponseHeaders(responseHeaders) {
    const map = {};
    if (typeof responseHeaders !== "string" || responseHeaders.length === 0) {
        return map;
    }
    const lines = responseHeaders.split(/\r?\n/);
    for (const line of lines) {
        const separator = line.indexOf(":");
        if (separator === -1) {
            continue;
        }
        const name = line.slice(0, separator).trim().toLowerCase();
        const value = line.slice(separator + 1).trim();
        if (name.length > 0) {
            map[name] = value;
        }
    }
    return map;
}
async function readResponseText(response) {
    if (response?.response && typeof response.response.text === "function") {
        return await response.response.text();
    }
    return response?.responseText || "";
}
function base64ToDataUrl(b64, mimeType) {
    return `data:${mimeType || "image/png"};base64,${b64}`;
}
/**
 * Extracts image result strings (data URLs or remote URLs) from an
 * OpenAI-compatible image generations response body.
 * @param {object} data - Parsed JSON response
 * @returns {string[]} Image URL/data-URL strings
 */
function extractGenImageUrls(data) {
    if (!data || !Array.isArray(data.data)) {
        return [];
    }
    return data.data
        .map((item) => {
        if (item &&
            typeof item.b64_json === "string" &&
            item.b64_json.length > 0) {
            const outputFormat = typeof item.output_format === "string" &&
                item.output_format.length > 0
                ? `image/${item.output_format.replace(/^image\//, "")}`
                : "image/png";
            return base64ToDataUrl(item.b64_json, outputFormat);
        }
        if (item && typeof item.url === "string" && item.url.length > 0) {
            return item.url;
        }
        return null;
    })
        .filter(Boolean);
}
/**
 * Fetches a remote image URL via GM_xmlhttpRequest and converts the response
 * blob to a self-contained data: URL using FileReader. This ensures history
 * always stores actual image content rather than ephemeral remote URLs that
 * may 404 or change. The request is tracked in the abort registry so cancel
 * behavior is preserved.
 *
 * @param {string} remoteUrl - The remote https:// image URL to fetch.
 * @param {number} myToken - The cancel token captured at generation start.
 * @returns {Promise<string>} A persistent data: URL.
 */
function fetchRemoteImageAsDataUrl(remoteUrl, myToken) {
    return new Promise((resolve, reject) => {
        const xhr = GM_xmlhttpRequest({
            method: "GET",
            url: remoteUrl,
            responseType: "blob",
            onload: (response) => {
                untrackRequest(xhr);
                if (getCancelToken() !== myToken) {
                    reject(new Error("cancelled"));
                    return;
                }
                if (response.status >= 200 && response.status < 300) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (reader.error) {
                            reject(new Error(`Failed to encode image: ${reader.error.message || "FileReader error"}`));
                        }
                        else {
                            resolve(reader.result);
                        }
                    };
                    reader.onerror = () => {
                        reject(new Error("Failed to encode image with FileReader"));
                    };
                    reader.readAsDataURL(response.response);
                }
                else {
                    reject(new Error(`Failed to fetch image (HTTP ${response.status})`));
                }
            },
            onerror: (error) => {
                untrackRequest(xhr);
                if (getCancelToken() !== myToken) {
                    reject(new Error("cancelled"));
                    return;
                }
                reject(new Error(`Network error fetching image: ${JSON.stringify(error)}`));
            },
        });
        trackRequest(xhr);
    });
}
/**
 * Determines whether a gen.pollinations.ai JSON error relates to an
 * invalid/unknown model so the cached model list can be refreshed.
 * @param {object} errorObj - The error object from the response envelope
 * @returns {boolean}
 */
function isGenModelError(errorObj) {
    const code = (errorObj?.code || "").toLowerCase();
    const message = (errorObj?.message || "").toLowerCase();
    return (code.includes("model") ||
        message.includes("model not found") ||
        message.includes("unknown model") ||
        message.includes("not a valid model"));
}
function buildLegacyUrl(cleanPrompt, finalModel, opts) {
    const params = new URLSearchParams();
    // Official 2026 Pollinations auth: identify the web app via referrer param.
    // The referrer is not an authentication token; it only identifies the
    // client on the free legacy endpoint.
    params.append("referrer", POLLINATIONS_REFERRER);
    params.append("model", finalModel);
    if (opts.hasValidNegative) {
        params.append("negative_prompt", opts.cleanNegativePrompt);
    }
    if (opts.width && opts.width > 0) {
        params.append("width", opts.width);
    }
    if (opts.height && opts.height > 0) {
        params.append("height", opts.height);
    }
    if (opts.seed) {
        params.append("seed", opts.seed);
    }
    if (opts.enhance) {
        params.append("enhance", "true");
    }
    if (opts.safe) {
        params.append("safe", "true");
    }
    if (opts.nologo) {
        params.append("nologo", "true");
    }
    if (opts.private) {
        params.append("private", "true");
    }
    const paramString = params.toString();
    return `${POLLINATIONS_LEGACY_BASE}${encodeURIComponent(cleanPrompt)}${paramString ? "?" + paramString : ""}`;
}
/**
 * Generates an image using the authenticated Pollinations gen API
 * (POST https://gen.pollinations.ai/v1/images/generations). This endpoint
 * enforces Bearer auth, honors the selected model, and accounts key usage.
 * Failures are reported explicitly; there is no fallback to the legacy
 * endpoint or to a different model.
 */
function generateViaGenEndpoint(finalModel, genPrompt, cleanPrompt, originalPrompt, width, height, token, { onSuccess, onFailure, onAuthFailure }, myToken) {
    const url = POLLINATIONS_GEN_ENDPOINT;
    const payload = {
        model: finalModel,
        prompt: genPrompt,
        n: 1,
        size: `${width}x${height}`,
    };
    (0,logger/* logInfo */.fH)("POLLINATIONS", "Generating via authenticated gen endpoint", {
        endpoint: url,
        model: finalModel,
        size: payload.size,
    });
    const xhr = GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(payload),
        onload: async (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            const text = await readResponseText(response);
            if (response.status >= 200 && response.status < 300) {
                try {
                    const data = JSON.parse(text);
                    const imageUrls = extractGenImageUrls(data);
                    if (imageUrls.length > 0) {
                        // Convert any remote URLs to persistent data: URLs so history
                        // stores actual image content, not ephemeral endpoints that 404.
                        // b64_json responses are already data: URLs; only remote url
                        // responses need a secondary fetch + FileReader conversion.
                        try {
                            const dataUrls = await Promise.all(imageUrls.map(async (imageUrl) => {
                                if (imageUrl.startsWith("data:")) {
                                    return imageUrl;
                                }
                                return await fetchRemoteImageAsDataUrl(imageUrl, myToken);
                            }));
                            if (getCancelToken() !== myToken) {
                                return;
                            }
                            onSuccess(dataUrls, cleanPrompt, "Pollinations", finalModel);
                        }
                        catch (fetchError) {
                            if (getCancelToken() !== myToken) {
                                return;
                            }
                            onFailure(`Failed to preserve generated image: ${fetchError.message}`, originalPrompt, "Pollinations", finalModel);
                        }
                    }
                    else {
                        onFailure(`Pollinations gen endpoint returned no usable image data: ${text}`, originalPrompt, "Pollinations", finalModel);
                    }
                }
                catch (parseError) {
                    onFailure(`Failed to parse Pollinations gen response: ${parseError.message}`, originalPrompt, "Pollinations", finalModel);
                }
                return;
            }
            // Error path: the gen endpoint returns a JSON error envelope shaped as
            // { success: false, error: { message, code }, status }. Parse it so
            // invalid models and auth failures are surfaced explicitly instead of
            // being masked by the legacy endpoint's silent fallback.
            let errorObj = null;
            let errorMessage = `Error ${response.status}: ${text}`;
            try {
                const parsed = JSON.parse(text);
                errorObj = parsed?.error || null;
                if (errorObj?.message) {
                    errorMessage = errorObj.message;
                }
            }
            catch {
                // Non-JSON error body; keep the raw text message.
            }
            if (response.status === 401 ||
                response.status === 402 ||
                response.status === 403) {
                onAuthFailure(errorMessage, originalPrompt);
                return;
            }
            if (isGenModelError(errorObj)) {
                (0,cache/* clearCachedModels */.WN)("pollinations");
                onFailure(`Model error: ${errorMessage}. Refreshing model list.`, originalPrompt, "Pollinations", finalModel);
                return;
            }
            onFailure(errorMessage, originalPrompt, "Pollinations", finalModel);
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            onFailure(JSON.stringify(error), originalPrompt, "Pollinations", finalModel);
        },
    });
    trackRequest(xhr);
}
/**
 * Generates an image using the legacy free Pollinations endpoint
 * (GET https://image.pollinations.ai/prompt/...). This path is used only
 * without an API key. The response is verified via the X-Model-Used header:
 * if the server used a different model than requested (silent fallback), the
 * generation fails explicitly instead of reporting success with the wrong
 * model.
 */
function generateViaLegacyEndpoint(finalModel, cleanPrompt, originalPrompt, opts, { onSuccess, onFailure, onAuthFailure }, myToken) {
    const url = buildLegacyUrl(cleanPrompt, finalModel, opts);
    (0,logger/* logInfo */.fH)("POLLINATIONS", "Generating via legacy free endpoint", {
        endpoint: "image.pollinations.ai",
        model: finalModel,
    });
    const xhr = GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        },
        onload: async (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            if (response.status >= 200 && response.status < 300) {
                // Verify the server actually used the requested model. The legacy
                // endpoint silently falls back to a free default (e.g. "sana") for
                // unauthenticated or unauthorized requests, returning HTTP 200 with
                // the wrong model. Treat any mismatch as a hard failure rather than
                // presenting the wrong image as the requested model.
                const headers = parseResponseHeaders(response.responseHeaders);
                const modelUsed = (headers["x-model-used"] || "").trim().toLowerCase();
                if (modelUsed && modelUsed !== finalModel.toLowerCase()) {
                    onFailure(`Pollinations used "${modelUsed}" instead of the requested model "${finalModel}". ` +
                        `The selected model likely requires an API key (paid tier). Add a Pollinations API key in settings to use "${finalModel}".`, originalPrompt, "Pollinations", finalModel);
                    return;
                }
                // Convert the blob to a persistent data: URL so history stores
                // actual image content, not a session-only blob: URL or a
                // regeneration endpoint URL that may 404 or yield a different image.
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (getCancelToken() !== myToken) {
                        return;
                    }
                    if (reader.error) {
                        onFailure(`Failed to encode generated image: ${reader.error.message || "FileReader error"}`, originalPrompt, "Pollinations", finalModel);
                        return;
                    }
                    onSuccess([reader.result], cleanPrompt, "Pollinations", finalModel);
                };
                reader.onerror = () => {
                    if (getCancelToken() !== myToken) {
                        return;
                    }
                    onFailure("Failed to encode generated image", originalPrompt, "Pollinations", finalModel);
                };
                reader.readAsDataURL(response.response);
            }
            else {
                const text = await readResponseText(response);
                if (text.toLowerCase().includes("model not found")) {
                    onFailure(`Model error: ${text}. Refreshing model list.`, originalPrompt, "Pollinations", finalModel);
                    (0,cache/* clearCachedModels */.WN)("pollinations");
                    return;
                }
                // Check for authentication/payment requirements in any status code.
                // Restricted Pollinations models may direct users to
                // enter.pollinations.ai for authentication.
                if (response.status === 402 ||
                    (response.status === 403 &&
                        text.includes("enter.pollinations.ai")) ||
                    text.includes("enter.pollinations.ai") ||
                    (text.toLowerCase().includes("authentication") &&
                        text.toLowerCase().includes("enter.pollinations.ai"))) {
                    try {
                        const errorData = JSON.parse(text);
                        onAuthFailure(errorData.message || errorData.error || text, originalPrompt);
                        return;
                    }
                    catch (e) {
                        // If JSON parsing fails, still trigger auth modal
                        onAuthFailure(text, originalPrompt);
                        return;
                    }
                }
                onFailure(`Error ${response.status}: ${text}`, originalPrompt, "Pollinations", finalModel);
            }
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            onFailure(JSON.stringify(error), originalPrompt, "Pollinations", finalModel);
        },
    });
    trackRequest(xhr);
}
/**
 * Generates an image using the Pollinations.ai API.
 *
 * With an API key: uses POST https://gen.pollinations.ai/v1/images/generations
 * (OpenAI-compatible), which enforces Bearer auth, honors the selected model,
 * and accounts key usage on the dashboard.
 *
 * Without an API key: uses the legacy free GET image.pollinations.ai/prompt
 * endpoint, but verifies the X-Model-Used response header so a silent
 * fallback to a different model is reported as a failure, never as success.
 *
 * @param {string} prompt - The generation prompt.
 * @param {object} callbacks - An object containing onSuccess, onFailure, and onAuthFailure callbacks.
 */
async function generate(prompt, { onSuccess, onFailure, onAuthFailure }) {
    const config = await (0,storage/* getConfig */.zj)();
    const { pollinationsModel: model, pollinationsToken, pollinationsWidth, pollinationsHeight, pollinationsSeed, pollinationsEnhance, pollinationsSafe, pollinationsNologo, pollinationsPrivate, enableNegPrompt, globalNegPrompt, } = config;
    // Base positive prompt from queue (StyledPrompt or EnhancedPrompt).
    const basePositive = typeof prompt === "string" ? prompt : "";
    const negEnabled = Boolean(enableNegPrompt);
    const negText = (globalNegPrompt || "").trim();
    const cleanNegativePrompt = getApiReadyPrompt(negText, "pollinations_negative_prompt");
    const hasValidNegative = negEnabled && cleanNegativePrompt.length > 0;
    const cleanPrompt = getApiReadyPrompt(basePositive, "pollinations_api_prompt");
    const finalModel = normalizePollinationsModel(model);
    const hasToken = typeof pollinationsToken === "string" &&
        pollinationsToken.trim().length > 0;
    const myToken = getCancelToken();
    (0,logger/* logDebug */.MD)("POLLINATIONS", "Model configuration", {
        originalModel: model,
        finalModel: finalModel,
        authenticated: hasToken,
        endpoint: hasToken ? "gen" : "legacy",
    });
    (0,logger/* logDebug */.MD)("POLLINATIONS", "Prompt construction", {
        path: hasToken
            ? "gen_inline_negative_prompt"
            : "positive_path_prompt_with_negative_prompt_query",
        basePositivePromptLength: basePositive.length,
        hasNegativePrompt: hasValidNegative,
        enableNegPrompt: negEnabled,
        negativePromptLength: hasValidNegative ? cleanNegativePrompt.length : 0,
        finalPromptLength: cleanPrompt.length,
        finalPromptPreview: cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    });
    const callbacks = { onSuccess, onFailure, onAuthFailure };
    if (hasToken) {
        // Authenticated path: the gen endpoint honors the model and accounts the
        // key. The OpenAI-compatible image generations API has no dedicated
        // negative_prompt field, so the negative prompt is inlined into the
        // prompt text (mirroring the OpenAI-compatible provider behavior).
        const genPrompt = hasValidNegative
            ? getApiReadyPrompt(`${cleanPrompt}, negative prompt: ${cleanNegativePrompt}`, "pollinations_gen_prompt")
            : cleanPrompt;
        generateViaGenEndpoint(finalModel, genPrompt, cleanPrompt, prompt, pollinationsWidth, pollinationsHeight, pollinationsToken.trim(), callbacks, myToken);
    }
    else {
        generateViaLegacyEndpoint(finalModel, cleanPrompt, prompt, {
            hasValidNegative,
            cleanNegativePrompt,
            width: pollinationsWidth,
            height: pollinationsHeight,
            seed: pollinationsSeed,
            enhance: pollinationsEnhance,
            safe: pollinationsSafe,
            nologo: pollinationsNologo,
            private: pollinationsPrivate,
        }, callbacks, myToken);
    }
}

;// ./src/api/aiHorde.ts





const AI_HORDE_CLIENT_AGENT = "WTR-Lab-Novel-Image-Generator:6.3.0:https://github.com/MasuRii/wtr-lab-novel-image-generator";
const AI_HORDE_API_BASE = "https://aihorde.net/api/v2";
function getAIHordeHeaders(aiHordeApiKey = "0000000000") {
    return {
        "Content-Type": "application/json",
        apikey: aiHordeApiKey || "0000000000",
        "Client-Agent": AI_HORDE_CLIENT_AGENT,
    };
}
function parseJsonResponse(response) {
    return JSON.parse(response.responseText || "{}");
}
function getAIHordeImageUrl(imageData) {
    if (typeof imageData !== "string" || !imageData.trim()) {
        return null;
    }
    const value = imageData.trim();
    if (value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:") ||
        value.startsWith("blob:")) {
        return value;
    }
    return `data:image/webp;base64,${value}`;
}
function fetchFinalStatus(id, prompt, startTime, model, aiHordeApiKey, { onSuccess, onFailure, updateStatus }, myToken) {
    const xhr = GM_xmlhttpRequest({
        method: "GET",
        url: `${AI_HORDE_API_BASE}/generate/status/${id}`,
        headers: getAIHordeHeaders(aiHordeApiKey),
        onload: (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            try {
                const data = parseJsonResponse(response);
                const finalElapsedTime = Date.now() - startTime;
                (0,logger/* logDebug */.MD)("AIHORDE", "AI Horde final status response received", {
                    generationId: id,
                    responseData: data,
                    isDone: data.done,
                    generations: data.generations ? data.generations.length : 0,
                    totalElapsedTime: finalElapsedTime,
                });
                if (!data.generations || data.generations.length === 0) {
                    (0,logger/* logError */.vV)("AIHORDE", "Generation completed but no images returned", {
                        generationId: id,
                        data: data,
                    });
                    onFailure("Generation completed but no images were returned", prompt, "AIHorde");
                    return;
                }
                updateStatus("Completed!");
                const imageUrls = data.generations
                    .map((gen) => getAIHordeImageUrl(gen.img))
                    .filter(Boolean);
                if (imageUrls.length === 0) {
                    onFailure("Generation completed but no usable image data was returned", prompt, "AIHorde");
                    return;
                }
                (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation completed successfully", {
                    generationId: id,
                    imagesGenerated: imageUrls.length,
                    totalElapsedTime: finalElapsedTime,
                });
                onSuccess(imageUrls, prompt, "AIHorde", model);
            }
            catch (e) {
                (0,logger/* logError */.vV)("AIHORDE", "Error retrieving AI Horde final status", {
                    generationId: id,
                    error: e.message,
                    responseText: response.responseText,
                });
                onFailure(`Error retrieving results: ${e.message}`, prompt, "AIHorde");
            }
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            (0,logger/* logError */.vV)("AIHORDE", "Failed to retrieve results from AI Horde", {
                generationId: id,
                error: error,
            });
            onFailure("Failed to retrieve results from AI Horde.", prompt, "AIHorde");
        },
    });
    trackRequest(xhr);
}
function checkStatus(id, prompt, startTime, model, aiHordeApiKey, { onSuccess, onFailure, updateStatus }, myToken) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    (0,logger/* logDebug */.MD)("AIHORDE", "Checking AI Horde generation status", {
        generationId: id,
        elapsedTimeMs: elapsedTime,
        promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
    });
    const xhr = GM_xmlhttpRequest({
        method: "GET",
        url: `${AI_HORDE_API_BASE}/generate/check/${id}`,
        headers: getAIHordeHeaders(aiHordeApiKey),
        onload: (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            try {
                const data = parseJsonResponse(response);
                (0,logger/* logDebug */.MD)("AIHORDE", "AI Horde check response received", {
                    generationId: id,
                    responseData: data,
                    isDone: data.done,
                    queuePosition: data.queue_position,
                    processing: data.processing,
                    waitTime: data.wait_time,
                });
                if (data.done) {
                    fetchFinalStatus(id, prompt, startTime, model, aiHordeApiKey, {
                        onSuccess,
                        onFailure,
                        updateStatus,
                    }, myToken);
                    return;
                }
                let statusText = "Waiting for worker...";
                if (data.queue_position > 0) {
                    statusText = `Queue: ${data.queue_position}. Est: ${data.wait_time}s.`;
                    (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation waiting in queue", {
                        generationId: id,
                        queuePosition: data.queue_position,
                        estimatedWaitTime: data.wait_time,
                        statusText: statusText,
                    });
                }
                else if (data.processing > 0) {
                    // More user-friendly status with elapsed time
                    const elapsedSeconds = Math.floor(elapsedTime / 1000);
                    const minutes = Math.floor(elapsedSeconds / 60);
                    const seconds = elapsedSeconds % 60;
                    const timeStr = minutes > 0
                        ? `${minutes}:${seconds.toString().padStart(2, "0")}`
                        : `${seconds}s`;
                    statusText = `AI Horde: Generating... (${timeStr})`;
                    (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation actively processing", {
                        generationId: id,
                        processingWorkers: data.processing,
                        elapsedTime: timeStr,
                        statusText: statusText,
                    });
                }
                else {
                    (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation waiting for worker", {
                        generationId: id,
                        statusText: statusText,
                    });
                }
                // Call updateStatus with the detailed status information
                // This ensures the status widget shows the specific AI Horde status
                (0,logger/* logDebug */.MD)("AIHORDE", "Calling updateStatus callback", {
                    generationId: id,
                    statusText: statusText,
                    elapsedTimeMs: elapsedTime,
                });
                updateStatus(statusText);
                const timer = setTimeout(() => checkStatus(id, prompt, startTime, model, aiHordeApiKey, {
                    onSuccess,
                    onFailure,
                    updateStatus,
                }, myToken), 5000);
                trackTimer(timer);
            }
            catch (e) {
                (0,logger/* logError */.vV)("AIHORDE", "Error checking AI Horde status", {
                    generationId: id,
                    error: e.message,
                    responseText: response.responseText,
                });
                onFailure(`Error checking status: ${e.message}`, prompt, "AIHorde");
            }
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            (0,logger/* logError */.vV)("AIHORDE", "Failed to get status from AI Horde", {
                generationId: id,
                error: error,
            });
            onFailure("Failed to get status from AI Horde.", prompt, "AIHorde");
        },
    });
    trackRequest(xhr);
}
async function aiHorde_generate(prompt, { onSuccess, onFailure, updateStatus }) {
    const config = await (0,storage/* getConfig */.zj)();
    const myToken = getCancelToken();
    const { aiHordeApiKey, aiHordeModel, aiHordeSampler, aiHordeCfgScale, aiHordeSteps, aiHordeWidth, aiHordeHeight, aiHordeSeed, aiHordePostProcessing, enableNegPrompt, globalNegPrompt, } = config;
    // Apply prompt cleaning as a safety measure (main app already sends clean prompts)
    // For AI Horde, "prompt" must remain strictly the positive prompt (Styled/Enhanced).
    const cleanPrompt = getApiReadyPrompt(prompt, "aihorde_api_positive_only");
    const negEnabled = Boolean(enableNegPrompt);
    const negText = (globalNegPrompt || "").trim();
    const hasValidNegative = negEnabled && negText.length > 0;
    (0,logger/* logInfo */.fH)("AIHORDE", "Starting AI Horde generation", {
        promptConstructionPath: "AIHorde: positive_prompt_with_hash_separator_negative",
        positivePromptLength: cleanPrompt.length,
        positivePromptPreview: cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
        model: aiHordeModel,
        apiKeyProvided: Boolean(aiHordeApiKey),
        enableNegPrompt: negEnabled,
        hasNegativePromptText: hasValidNegative,
        negativePromptLength: hasValidNegative ? negText.length : 0,
    });
    const params = {
        sampler_name: aiHordeSampler,
        cfg_scale: parseFloat(aiHordeCfgScale),
        steps: parseInt(aiHordeSteps, 10),
        width: parseInt(aiHordeWidth, 10),
        height: parseInt(aiHordeHeight, 10),
    };
    if (aiHordeSeed) {
        params.seed = aiHordeSeed;
    }
    if (aiHordePostProcessing.length > 0) {
        params.post_processing = aiHordePostProcessing;
    }
    const payloadPrompt = hasValidNegative
        ? `${cleanPrompt}###${getApiReadyPrompt(negText, "aihorde_negative_prompt")}`
        : cleanPrompt;
    const payload = { prompt: payloadPrompt, params, models: [aiHordeModel] };
    (0,logger/* logDebug */.MD)("AIHORDE", "Sending generation request to AI Horde", {
        url: `${AI_HORDE_API_BASE}/generate/async`,
        model: aiHordeModel,
        params,
        usesHashSeparatorNegativePrompt: hasValidNegative,
        negativePromptLength: hasValidNegative ? negText.length : 0,
        negativePromptPreview: hasValidNegative
            ? negText.substring(0, 200) + (negText.length > 200 ? "..." : "")
            : null,
    });
    updateStatus("Requesting...");
    const xhr = GM_xmlhttpRequest({
        method: "POST",
        url: `${AI_HORDE_API_BASE}/generate/async`,
        headers: getAIHordeHeaders(aiHordeApiKey),
        data: JSON.stringify(payload),
        onload: (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            try {
                const data = JSON.parse(response.responseText);
                (0,logger/* logDebug */.MD)("AIHORDE", "AI Horde API response received", {
                    status: response.status,
                    hasGenerationId: Boolean(data.id),
                    message: data.message,
                    error: data.error,
                });
                if (data.id) {
                    (0,logger/* logInfo */.fH)("AIHORDE", "AI Horde generation request accepted", {
                        generationId: data.id,
                        model: aiHordeModel,
                    });
                    updateStatus("Waiting for status...");
                    checkStatus(data.id, prompt, Date.now(), aiHordeModel, aiHordeApiKey, {
                        onSuccess,
                        onFailure,
                        updateStatus,
                    }, myToken);
                }
                else {
                    if (data.message && data.message.toLowerCase().includes("model")) {
                        (0,logger/* logError */.vV)("AIHORDE", "Model error from AI Horde API", {
                            error: data.message,
                            willRefreshModels: true,
                        });
                        onFailure(`Model error: ${data.message}. Refreshing model list.`, prompt, "AIHorde");
                        (0,cache/* clearCachedModels */.WN)("aiHorde");
                        return;
                    }
                    (0,logger/* logError */.vV)("AIHORDE", "Failed to initiate generation", {
                        error: data.message || "Unknown error",
                        responseData: data,
                    });
                    throw new Error(data.message || "Failed to initiate generation.");
                }
            }
            catch (e) {
                (0,logger/* logError */.vV)("AIHORDE", "Error processing AI Horde response", {
                    error: e.message,
                    responseText: response.responseText,
                });
                onFailure(e.message, prompt, "AIHorde");
            }
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            (0,logger/* logError */.vV)("AIHORDE", "Network error during AI Horde request", {
                error: error,
            });
            onFailure(JSON.stringify(error), prompt, "AIHorde");
        },
    });
    trackRequest(xhr);
}

;// ./src/api/openAI.ts




/**
 * Detects if response content is HTML instead of JSON
 * @param {string} responseText - The response text to check
 * @returns {boolean} - True if content appears to be HTML
 */
function openAI_isHtmlResponse(responseText) {
    const trimmed = responseText.trim().toLowerCase();
    return (trimmed.startsWith("<!doctype") ||
        trimmed.startsWith("<html") ||
        trimmed.includes("<!doctype") ||
        trimmed.includes("<html>") ||
        trimmed.startsWith("<!") ||
        trimmed.startsWith("<head>") ||
        trimmed.includes("<title>"));
}
/**
 * Safely parses JSON with enhanced error handling
 * @param {string} responseText - The response text to parse
 * @param {string} endpointUrl - The endpoint URL for context in error messages
 * @returns {object|null} - Parsed JSON object or throws enhanced error
 */
function openAI_safeJsonParse(responseText, endpointUrl) {
    try {
        return JSON.parse(responseText);
    }
    catch (e) {
        // Check if this is an HTML response
        if (openAI_isHtmlResponse(responseText)) {
            throw {
                isHtmlResponse: true,
                originalError: e,
                message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`,
            };
        }
        // Check for specific JSON parsing error patterns
        const errorMessage = e.message.toLowerCase();
        if (errorMessage.includes("unexpected token '<'") &&
            responseText.trim().startsWith("<!")) {
            throw {
                isHtmlResponse: true,
                originalError: e,
                message: `Received HTML response instead of JSON from ${endpointUrl}. This usually indicates endpoint configuration issues or authentication problems.`,
            };
        }
        if (errorMessage.includes("unexpected character at line 1 column 1")) {
            throw {
                isMalformedJson: true,
                originalError: e,
                message: `JSON parsing failed at the first character. This may indicate server issues or malformed response from ${endpointUrl}`,
            };
        }
        // Re-throw as generic parsing error
        throw {
            isJsonParseError: true,
            originalError: e,
            message: `JSON parsing error: ${e.message}. This may indicate server issues or malformed response.`,
        };
    }
}
function getOptionalString(value) {
    return typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : undefined;
}
function buildOpenAIImagePayload(activeProfile, prompt) {
    const payload = {
        model: activeProfile.model,
        prompt,
        n: Number.isInteger(activeProfile.n) ? activeProfile.n : 1,
        size: getOptionalString(activeProfile.size) || "1024x1024",
    };
    const optionalFields = [
        "quality",
        "output_format",
        "background",
        "moderation",
    ];
    optionalFields.forEach((field) => {
        const value = getOptionalString(activeProfile[field]);
        if (value) {
            payload[field] = value;
        }
    });
    return payload;
}
function getMimeTypeForOpenAIItem(item) {
    const outputFormat = getOptionalString(item?.output_format);
    if (outputFormat) {
        return `image/${outputFormat.replace(/^image\//, "")}`;
    }
    return "image/png";
}
async function openAI_generate(prompt, providerProfileUrl, { onSuccess, onFailure }) {
    const config = await (0,storage/* getConfig */.zj)();
    const activeUrl = providerProfileUrl || config.openAICompatActiveProfileUrl;
    const activeProfile = config.openAICompatProfiles[activeUrl];
    if (!activeProfile) {
        onFailure(`No active or valid Openai Compatible profile found for URL: ${activeUrl}`, prompt, "OpenAICompat");
        return;
    }
    const { enableNegPrompt, globalNegPrompt } = config;
    const basePositive = typeof prompt === "string" ? prompt : "";
    const negEnabled = Boolean(enableNegPrompt);
    const negText = (globalNegPrompt || "").trim();
    const hasValidNegative = negEnabled && negText.length > 0;
    // For non-AI Horde providers:
    // FinalPrompt = (StyledPrompt or EnhancedPrompt) + ", negative prompt: " + globalNegPrompt
    // when enabled and non-empty.
    const finalPrompt = hasValidNegative
        ? `${basePositive}, negative prompt: ${negText}`
        : basePositive;
    // Apply prompt cleaning as a safety measure on the fully-formed FinalPrompt
    const cleanPrompt = getApiReadyPrompt(finalPrompt, "openai_api_final");
    const myToken = getCancelToken();
    // Respect global logging toggle for debug-level diagnostics
    (0,logger/* logDebug */.MD)("OPENAI-COMPAT", "Prompt construction", {
        path: "non-horde inline negative",
        basePositivePromptLength: basePositive.length,
        hasNegativePrompt: hasValidNegative,
        enableNegPrompt: negEnabled,
        negativePromptLength: hasValidNegative ? negText.length : 0,
        finalPromptLength: cleanPrompt.length,
        finalPromptPreview: cleanPrompt.substring(0, 200) + (cleanPrompt.length > 200 ? "..." : ""),
    });
    const url = `${activeUrl}/images/generations`;
    const payload = buildOpenAIImagePayload(activeProfile, cleanPrompt);
    const xhr = GM_xmlhttpRequest({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeProfile.apiKey}`,
        },
        data: JSON.stringify(payload),
        onload: (response) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            try {
                const data = openAI_safeJsonParse(response.responseText, activeUrl);
                // Check for authentication errors first
                if (data?.Error &&
                    data.Error.toLowerCase().includes("invalid api key")) {
                    onFailure(data.Error, prompt, "OpenAICompat", activeUrl, {
                        errorType: "authentication",
                        isNonRetryable: true,
                    });
                    return;
                }
                // Check for IP address mismatch errors
                if (data?.Error &&
                    data.Error.toLowerCase().includes("ip address mismatch")) {
                    onFailure(data.Error, prompt, "OpenAICompat", activeUrl, {
                        errorType: "ip_mismatch",
                        isNonRetryable: false,
                        retryable: true,
                    });
                    return;
                }
                if (data?.data?.[0]) {
                    try {
                        const imageUrls = data.data
                            .map((item) => {
                            if (item.b64_json) {
                                try {
                                    // Validate base64 data
                                    if (typeof item.b64_json === "string" &&
                                        item.b64_json.length > 0) {
                                        return `data:${getMimeTypeForOpenAIItem(item)};base64,${item.b64_json}`;
                                    }
                                    else {
                                        throw new Error("Invalid base64 data");
                                    }
                                }
                                catch (conversionError) {
                                    throw new Error(`Failed to convert image to base64: ${conversionError.message}`);
                                }
                            }
                            else if (item.url) {
                                return item.url;
                            }
                            return null;
                        })
                            .filter(Boolean);
                        if (imageUrls.length > 0) {
                            // Pass the exact FinalPrompt string used for the API to the viewer/history
                            onSuccess(imageUrls, cleanPrompt, "OpenAICompat", activeProfile.model);
                        }
                        else {
                            throw new Error("API response did not contain usable image data.");
                        }
                    }
                    catch (conversionError) {
                        onFailure(conversionError.message, prompt, "OpenAICompat", activeUrl, {
                            errorType: "image_conversion",
                            isNonRetryable: false,
                        });
                    }
                }
                else {
                    throw new Error(JSON.stringify(data));
                }
            }
            catch (e) {
                // Handle enhanced error types from safeJsonParse
                if (e.isHtmlResponse) {
                    onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
                        errorType: "html_response",
                        isNonRetryable: false,
                        endpointIssue: true,
                    });
                }
                else if (e.isMalformedJson) {
                    onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
                        errorType: "malformed_json",
                        isNonRetryable: false,
                        serverIssue: true,
                    });
                }
                else if (e.isJsonParseError) {
                    onFailure(e.message, prompt, "OpenAICompat", activeUrl, {
                        errorType: "json_parse_error",
                        isNonRetryable: false,
                    });
                }
                else {
                    // Fallback for generic errors
                    onFailure(e.message, prompt, "OpenAICompat", activeUrl);
                }
            }
        },
        onerror: (error) => {
            untrackRequest(xhr);
            if (getCancelToken() !== myToken) {
                return;
            }
            onFailure(JSON.stringify(error), prompt, "OpenAICompat", activeUrl);
        },
    });
    trackRequest(xhr);
}

;// ./src/components/statusWidget.ts
let widgetElement = null;
/**
 * Creates the status widget DOM element and appends it to the body.
 * This should only be called once during initialization.
 */
function create() {
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
function statusWidget_update(state, text, onClickHandler = null, onCancel = null) {
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
    }
    else if (state === "error") {
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

// EXTERNAL MODULE: ./src/components/imageViewer.ts
var imageViewer = __webpack_require__(237);
// EXTERNAL MODULE: ./src/utils/uiUtils.ts
var uiUtils = __webpack_require__(511);
;// ./src/components/errorModal.ts



let modalElement = null;
let retryCallback = (..._args) => { };
let dismissCallback = () => { };
let errorA11yCleanup = null;
/**
 * Initializes the error modal with callbacks for retry and dismiss actions.
 * @param {object} callbacks - An object containing the retry and dismiss functions.
 * @param {function} callbacks.onRetry - Function to call when the user clicks retry.
 * @param {function} callbacks.onDismiss - Function to call when the user dismisses the modal.
 */
function errorModal_init({ onRetry, onDismiss }) {
    retryCallback = onRetry;
    dismissCallback = onDismiss;
}
/**
 * Creates the error modal DOM element and appends it to the body.
 */
function errorModal_create() {
    if (modalElement) {
        return;
    }
    modalElement = document.createElement("div");
    modalElement.id = "nig-error-modal";
    modalElement.className = "nig-modal-overlay";
    modalElement.style.display = "none";
    modalElement.innerHTML = `
        <div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-error-title">
            <button type="button" class="nig-close-btn" aria-label="Close error dialog">&times;</button>
            <h2 id="nig-error-title">Generation Failed</h2>
            <p>The image could not be generated. Please review the reason below and adjust your prompt if necessary.</p>
            <p><strong>Reason:</strong></p>
            <div id="nig-error-reason"></div>
            <p><strong>Your Prompt:</strong></p>
            <textarea id="nig-error-prompt" class="nig-error-prompt"></textarea>
            <div class="nig-form-group" style="margin-top: 15px;">
                <label for="nig-retry-provider-select">Retry with Provider:</label>
                <select id="nig-retry-provider-select"></select>
            </div>
            <div id="nig-error-hint" class="nig-error-hint" style="display: none;"></div>
            <div id="nig-error-actions" class="nig-error-actions"></div>
        </div>`;
    document.body.appendChild(modalElement);
    modalElement
        .querySelector(".nig-close-btn")
        .addEventListener("click", () => hide());
}
/**
 * Hides the error modal and calls the dismiss callback.
 */
function hide() {
    if (modalElement) {
        modalElement.style.display = "none";
    }
    // Clean up a11y (focus trap, scroll lock, restore focus)
    if (errorA11yCleanup) {
        errorA11yCleanup();
        errorA11yCleanup = null;
    }
    // Call the dismiss callback if provided
    if (typeof dismissCallback === "function") {
        dismissCallback();
    }
}
/**
 * Shows and populates the error modal with details from a failed generation.
 * @param {object} errorDetails - The details of the error.
 */
async function show(errorDetails) {
    if (!modalElement) {
        errorModal_create();
    }
    const reasonContainer = document.getElementById("nig-error-reason");
    const promptTextarea = document.getElementById("nig-error-prompt");
    promptTextarea.value = errorDetails.prompt;
    const providerSelect = document.getElementById("nig-retry-provider-select");
    providerSelect.innerHTML = "";
    const config = await (0,storage/* getConfig */.zj)();
    // Derive available providers dynamically from the config panel's provider
    // dropdown instead of hardcoding, so the retry list always reflects the
    // actual available providers (finding #19).
    const providerSelectEl = document.getElementById("nig-provider");
    const providers = [];
    if (providerSelectEl) {
        for (let i = 0; i < providerSelectEl.options.length; i++) {
            const v = providerSelectEl.options[i].value;
            if (v && v !== "OpenAICompat") {
                providers.push(v);
            }
        }
    }
    // Fallback if DOM not available
    if (providers.length === 0) {
        providers.push("Pollinations", "AIHorde");
    }
    providers.forEach((p) => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        providerSelect.appendChild(option);
    });
    Object.keys(config.openAICompatProfiles).forEach((url) => {
        const option = document.createElement("option");
        option.value = `OpenAICompat::${url}`;
        option.textContent = `OpenAI: ${url.replace("https://", "").split("/")[0]}`;
        providerSelect.appendChild(option);
    });
    let failedProviderValue = errorDetails.provider;
    if (errorDetails.provider === "OpenAICompat" &&
        errorDetails.providerProfileUrl) {
        failedProviderValue = `OpenAICompat::${errorDetails.providerProfileUrl}`;
    }
    if (Array.from(providerSelect.options).some((opt) => opt.value === failedProviderValue)) {
        providerSelect.value = failedProviderValue;
    }
    // Defensive normalization for backward compatibility and robustness
    const reason = errorDetails && errorDetails.reason ? errorDetails.reason : {};
    const baseMessage = typeof reason.message === "string" && reason.message.trim().length > 0
        ? reason.message.trim()
        : "An unknown error occurred during image generation. Please review your configuration and try again.";
    const errorType = reason.errorType || null;
    // Build a single coherent Reason block with structured guidance
    const reasonParts = [];
    // Always start with the base parsed message
    reasonParts.push(baseMessage);
    // Append structured guidance based on errorType while avoiding duplication
    if (errorType === "authentication") {
        reasonParts.push("Authentication Issue: Please check your API key configuration for this OpenAI-compatible provider. Ensure the key is valid, correctly scoped, and not expired before retrying.");
    }
    else if (errorType === "api_key_validation") {
        reasonParts.push("API Key Validation Issue: For AIHorde or the relevant provider, verify that your API key is correctly configured and that you have completed any required registration. You may try a different provider or update your API key in settings.");
    }
    else if (errorType === "model_access") {
        // Avoid repeating essentially the same provider/tier guidance text; keep this concise and generic.
        if (!baseMessage.toLowerCase().includes("model") &&
            !baseMessage.toLowerCase().includes("plan") &&
            !baseMessage.toLowerCase().includes("tier") &&
            !baseMessage.toLowerCase().includes("subscription")) {
            reasonParts.push("Model Access Restriction: The selected model is not available for your current plan. Switch to a supported model or upgrade your account according to your provider’s tier documentation.");
        }
    }
    else if (errorType === "image_conversion") {
        reasonParts.push("Image Conversion Issue: The provider returned image data that could not be converted. This is often a temporary provider issue. You can try again or switch to a different provider.");
    }
    else if (errorType === "ip_mismatch") {
        const discordLink = reason.discordLink || "https://discord.gg/zukijourney";
        const resetipCommand = reason.resetipCommand || "/user resetip";
        reasonParts.push("IP Address Mismatch: Your current IP does not match the one registered to your account. " +
            "To resolve this, join the provider’s Discord server at " +
            discordLink +
            ', run the command "' +
            resetipCommand +
            '", or upgrade to a plan that supports multiple IPs. ' +
            "You can retry generation after the IP lock is reset.");
    }
    else if (errorType === "html_response") {
        reasonParts.push("Endpoint Configuration Issue: The API endpoint returned HTML instead of JSON. This usually indicates an incorrect endpoint URL, an authentication problem, or an endpoint that does not support the requested operation. " +
            "Check your OpenAI-compatible provider Base URL, path, and API key configuration.");
    }
    else if (errorType === "malformed_json") {
        reasonParts.push("Server Response Issue: The API returned malformed or invalid JSON data. This is typically a temporary server-side issue. " +
            "You can try again later or switch to another provider if the problem persists.");
    }
    else if (errorType === "json_parse_error") {
        reasonParts.push("JSON Parsing Error: The response from the provider could not be parsed. This may indicate an intermittent server issue or unexpected response format. " +
            "You can retry the request or use a different provider.");
    }
    // In case multiple signals exist, ensure uniqueness and readability
    const uniqueReasonParts = Array.from(new Set(reasonParts.filter(Boolean)));
    reasonContainer.innerHTML = uniqueReasonParts
        .map((part) => `<p>${(0,uiUtils/* escapeHtml */.ZD)(part)}</p>`)
        .join("");
    // Reset prompt text
    promptTextarea.value =
        errorDetails && typeof errorDetails.prompt === "string"
            ? errorDetails.prompt
            : errorDetails && errorDetails.prompt !== undefined
                ? String(errorDetails.prompt)
                : "";
    const actionsContainer = document.getElementById("nig-error-actions");
    actionsContainer.innerHTML = "";
    // Check if this is a non-retryable error (authentication errors or explicitly marked as non-retryable)
    const isNonRetryableError = Boolean(reason.isNonRetryable) ||
        errorType === "authentication" ||
        (!reason.retryable && !errorType);
    // Create retry button
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Retry Generation";
    retryBtn.className = "nig-retry-btn";
    retryBtn.onclick = () => {
        const editedPrompt = promptTextarea.value.trim();
        if (!editedPrompt) {
            (0,uiUtils/* showToast */.P0)("Prompt cannot be empty.", "error");
            return;
        }
        const selectedProviderValue = providerSelect.value;
        let provider;
        let providerProfileUrl;
        if (selectedProviderValue &&
            selectedProviderValue.startsWith("OpenAICompat::")) {
            provider = "OpenAICompat";
            providerProfileUrl = selectedProviderValue.split("::")[1] || null;
        }
        else {
            provider = selectedProviderValue || errorDetails.provider || null;
            providerProfileUrl = null;
        }
        try {
            retryCallback(editedPrompt, provider, providerProfileUrl);
        }
        catch (e) {
            // Fail gracefully without breaking the modal
            logger/* logError */.vV("ERROR_MODAL", "Retry callback threw an error", {
                error: e && e.message,
            });
        }
        hide();
    };
    // Handle retry button visibility based on error type
    if (!isNonRetryableError) {
        if (reason.retryable) {
            // Show retry button immediately for retryable errors
            actionsContainer.appendChild(retryBtn);
        }
        else {
            // For non-retryable errors, only show retry if user modifies prompt or changes provider
            // Show a hint explaining why Retry is hidden (finding #18)
            const hintEl = document.getElementById("nig-error-hint");
            if (hintEl) {
                hintEl.textContent =
                    "Retry is hidden because this error may not be resolved by simply retrying. Edit your prompt above or select a different provider to reveal the Retry button.";
                hintEl.style.display = "block";
            }
            const showRetryButton = () => {
                if (!actionsContainer.contains(retryBtn)) {
                    actionsContainer.appendChild(retryBtn);
                    if (hintEl) {
                        hintEl.style.display = "none";
                    }
                }
            };
            promptTextarea.oninput = showRetryButton;
            providerSelect.onchange = showRetryButton;
        }
    }
    modalElement.style.display = "flex";
    // Set up modal accessibility (focus trap, Escape, scroll lock, focus management)
    if (errorA11yCleanup) {
        errorA11yCleanup();
    }
    errorA11yCleanup = (0,uiUtils/* setupModalA11y */.nI)(modalElement, {
        labelledBy: "nig-error-title",
        closeOnEscape: true,
        onClose: () => hide(),
    });
}

;// ./src/components/pollinationsAuthPrompt.ts


let promptElement = null;
/**
 * Shows a modal for Pollinations.ai authentication.
 * @param {string} errorMessage - The error message from the API.
 * @param {string} failedPrompt - The prompt that failed.
 * @param {function} onRetry - The callback function to execute on retry.
 */
function pollinationsAuthPrompt_show(errorMessage, failedPrompt, onRetry) {
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
            <p><strong>Error Message:</strong> <em>${(0,uiUtils/* escapeHtml */.ZD)(errorMessage)}</em></p>
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
    let a11yCleanup = (0,uiUtils/* setupModalA11y */.nI)(promptElement, {
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
            await (0,storage/* setConfigValue */.yJ)("pollinationsToken", token);
            close();
            (0,uiUtils/* showToast */.P0)("Token saved. Retrying generation...", "success");
            onRetry(failedPrompt, "Pollinations");
        }
        else {
            (0,uiUtils/* showToast */.P0)("Token cannot be empty.", "error");
        }
    });
}

// EXTERNAL MODULE: ./src/utils/file.ts
var file = __webpack_require__(409);
// EXTERNAL MODULE: ./src/config/defaults.ts
var defaults = __webpack_require__(916);
// EXTERNAL MODULE: ./src/api/models.ts
var models = __webpack_require__(770);
;// ./src/components/enhancementPanel.ts
// --- IMPORTS ---





/**
 * Returns true when the enhancement model UI is in manual text-input mode.
 */
function isEnhancementManualMode() {
    const manualContainer = document.getElementById("nig-enhancement-model-container-manual");
    return Boolean(manualContainer && manualContainer.style.display !== "none");
}
// --- PUBLIC FUNCTIONS ---
/**
 * Toggles the enhancement settings UI based on whether enhancement is enabled
 */
function toggleEnhancementSettings(enabled) {
    const enhancementSettings = document.getElementById("nig-enhancement-settings");
    if (enhancementSettings) {
        if (enabled) {
            enhancementSettings.classList.remove("disabled");
            // Re-enable inputs in tab order (finding #20)
            enhancementSettings
                .querySelectorAll("input, select, textarea, button")
                .forEach((el) => {
                el.removeAttribute("tabindex");
                el.setAttribute("aria-disabled", "false");
            });
        }
        else {
            enhancementSettings.classList.add("disabled");
            // Remove inputs from tab order (finding #20: disabled inputs were still focusable)
            enhancementSettings
                .querySelectorAll("input, select, textarea, button")
                .forEach((el) => {
                el.setAttribute("tabindex", "-1");
                el.setAttribute("aria-disabled", "true");
            });
        }
    }
}
/**
 * Updates the enhancement UI based on provider and configuration
 */
function updateEnhancementUI(provider, config) {
    const enhancementEnabled = config.enhancementEnabled;
    const hasEndpoint = config.enhancementBaseUrl && config.enhancementBaseUrl.trim().length > 0;
    const hasModel = config.enhancementModel && config.enhancementModel.trim().length > 0;
    const isConfigured = hasEndpoint && hasModel;
    const shouldUseProviderEnh = shouldUseProviderEnhancement(provider, config);
    const providerPriorityInfo = document.getElementById("nig-provider-priority-info");
    const statusIndicator = document.getElementById("nig-status-indicator");
    const statusText = document.getElementById("nig-status-text");
    const overrideProviderBtn = document.getElementById("nig-override-provider");
    if (enhancementEnabled &&
        shouldUseProviderEnh &&
        !config.enhancementOverrideProvider) {
        providerPriorityInfo.style.display = "block";
        statusIndicator.className = "nig-status-indicator provider-active";
        statusText.textContent = "Provider Enhancement Active";
        if (overrideProviderBtn) {
            overrideProviderBtn.style.display = "inline-block";
        }
    }
    else {
        providerPriorityInfo.style.display = "none";
        if (enhancementEnabled && isConfigured) {
            statusIndicator.className = "nig-status-indicator external-active";
            statusText.textContent = "External AI Enhancement Active";
        }
        else if (enhancementEnabled) {
            statusIndicator.className = "nig-status-indicator disabled";
            statusText.textContent = "Enhancement Enabled (No Endpoint)";
        }
        else {
            statusIndicator.className = "nig-status-indicator disabled";
            statusText.textContent = "Enhancement Disabled";
        }
        if (overrideProviderBtn) {
            overrideProviderBtn.style.display = "none";
        }
    }
}
/**
 * Handles enhancement template selection and updates UI accordingly
 */
/**
 * Load and normalize user presets from config.
 * Ensures backward compatibility with potential legacy shapes.
 */
function getNormalizedUserPresets(config) {
    const raw = config.enhancementUserPresets;
    const normalized = {};
    try {
        if (!raw) {
            return normalized;
        }
        // If already an object map of id -> preset
        if (typeof raw === "object" && !Array.isArray(raw)) {
            Object.entries(raw).forEach(([id, value]) => {
                if (value && typeof value.template === "string") {
                    const presetId = value.id || id;
                    normalized[presetId] = {
                        id: presetId,
                        name: value.name || presetId,
                        description: typeof value.description === "string" ? value.description : "",
                        template: value.template,
                        createdAt: value.createdAt || null,
                        updatedAt: value.updatedAt || null,
                        version: value.version || 1,
                    };
                }
            });
            return normalized;
        }
        // If legacy array: [{ name, template, ... }]
        if (Array.isArray(raw)) {
            raw.forEach((p, index) => {
                if (p && typeof p.template === "string") {
                    const safeName = p.name && typeof p.name === "string"
                        ? p.name.trim()
                        : `Preset ${index + 1}`;
                    const id = p.id ||
                        safeName
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-_]/g, "") ||
                        `preset-${index + 1}`;
                    if (!normalized[id]) {
                        normalized[id] = {
                            id,
                            name: safeName,
                            description: typeof p.description === "string" ? p.description : "",
                            template: p.template,
                            createdAt: p.createdAt || null,
                            updatedAt: p.updatedAt || null,
                            version: 1,
                        };
                    }
                }
            });
            return normalized;
        }
    }
    catch (e) {
        console.error("[NIG] Failed to normalize enhancementUserPresets, clearing corrupted data", e);
    }
    return normalized;
}
/**
 * Persist normalized user presets back to storage.
 */
async function saveUserPresetsToStorage(userPresetsMap) {
    try {
        await storage/* setConfigValue */.yJ("enhancementUserPresets", userPresetsMap || {});
    }
    catch (e) {
        console.error("[NIG] Failed to save enhancementUserPresets", e);
        (0,uiUtils/* showToast */.P0)("Failed to save enhancement preset. See console for details.", "error");
    }
}
/**
 * Populate the Enhancement Template select with grouped user + default presets,
 * ensuring "User Presets" group appears above "Default Presets".
 */
function populateEnhancementTemplateSelect(templateSelect, userPresetsMap, selectedKey) {
    const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
    // Clear existing options while preserving optgroup structure from template
    templateSelect.innerHTML = "";
    // User Presets group
    const userOptgroup = document.createElement("optgroup");
    userOptgroup.label = "User Presets";
    userOptgroup.dataset.group = "user-presets";
    const userPresetEntries = Object.values(userPresetsMap || {});
    if (userPresetEntries.length === 0) {
        const emptyOption = document.createElement("option");
        emptyOption.disabled = true;
        emptyOption.textContent = "No user presets saved yet";
        userOptgroup.appendChild(emptyOption);
    }
    else {
        userPresetEntries.forEach((preset) => {
            const option = document.createElement("option");
            option.value = `user:${preset.id}`;
            option.textContent = preset.name || preset.id;
            option.title = preset.description || preset.template || "";
            userOptgroup.appendChild(option);
        });
    }
    // Default Presets group (top 5 only per DEFAULTS)
    const defaultOptgroup = document.createElement("optgroup");
    defaultOptgroup.label = "Default Presets";
    defaultOptgroup.dataset.group = "default-presets";
    Object.entries(defaultPresets).forEach(([key, preset]) => {
        if (!preset || typeof preset.template !== "string") {
            return;
        }
        const option = document.createElement("option");
        option.value = key;
        option.textContent = `${preset.name} - ${preset.description}`;
        option.title = preset.template;
        defaultOptgroup.appendChild(option);
    });
    // Append groups in required order
    templateSelect.appendChild(userOptgroup);
    templateSelect.appendChild(defaultOptgroup);
    // Custom one-off entry at bottom (not part of any optgroup)
    const customOption = document.createElement("option");
    customOption.value = "custom";
    customOption.textContent = "Custom (one-off)";
    templateSelect.appendChild(customOption);
    // Resolve selection
    if (selectedKey &&
        templateSelect.querySelector(`option[value="${selectedKey}"]`)) {
        templateSelect.value = selectedKey;
    }
    else if (selectedKey && defaultPresets[selectedKey]) {
        templateSelect.value = selectedKey;
    }
    else if (selectedKey === "custom") {
        templateSelect.value = "custom";
    }
    else {
        // Fallback to standard if available
        if (defaultPresets.standard) {
            templateSelect.value = "standard";
        }
        else {
            templateSelect.value = "custom";
        }
    }
}
/**
 * Handle initial enhancement template selection, including user presets.
 */
async function handleEnhancementTemplateSelection(config) {
    const templateSelect = document.getElementById("nig-enhancement-template-select");
    const templateTextarea = document.getElementById("nig-enhancement-template");
    if (!templateSelect || !templateTextarea) {
        return;
    }
    const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
    const userPresets = getNormalizedUserPresets(config);
    const storedSelected = config.enhancementTemplateSelected;
    const storedTemplate = typeof config.enhancementTemplate === "string"
        ? config.enhancementTemplate
        : "";
    // Try to resolve selection:
    // - user:<id> for user presets
    // - default preset keys
    // - 'custom'
    let resolvedKey = null;
    if (storedSelected && typeof storedSelected === "string") {
        if (storedSelected === "custom") {
            resolvedKey = "custom";
        }
        else if (storedSelected.startsWith("user:")) {
            const id = storedSelected.replace(/^user:/, "");
            if (userPresets[id]) {
                resolvedKey = `user:${id}`;
            }
        }
        else if (defaultPresets[storedSelected]) {
            resolvedKey = storedSelected;
        }
    }
    // If no direct match, attempt to infer from stored template content
    if (!resolvedKey && storedTemplate) {
        // Check user presets
        for (const preset of Object.values(userPresets)) {
            if (preset.template === storedTemplate) {
                resolvedKey = `user:${preset.id}`;
                break;
            }
        }
        // Check default presets if still not resolved
        if (!resolvedKey) {
            for (const [key, preset] of Object.entries(defaultPresets)) {
                if (preset &&
                    typeof preset === "object" &&
                    preset.template === storedTemplate) {
                    resolvedKey = key;
                    break;
                }
            }
        }
        // Fallback: treat as custom if we have content
        if (!resolvedKey) {
            resolvedKey = "custom";
        }
    }
    // Final fallback to standard if nothing else
    if (!resolvedKey) {
        resolvedKey = defaultPresets.standard ? "standard" : "custom";
    }
    // Populate select with grouped options
    populateEnhancementTemplateSelect(templateSelect, userPresets, resolvedKey);
    // Populate textarea and readonly/editable state
    if (resolvedKey === "custom") {
        templateTextarea.value = storedTemplate || "";
        templateTextarea.disabled = false;
    }
    else if (resolvedKey.startsWith("user:")) {
        const id = resolvedKey.replace(/^user:/, "");
        const preset = userPresets[id];
        if (preset) {
            templateTextarea.value = preset.template;
            templateTextarea.disabled = true;
        }
        else {
            // Missing user preset -> fallback to custom with storedTemplate
            templateTextarea.value = storedTemplate || "";
            templateTextarea.disabled = false;
            templateSelect.value = "custom";
        }
    }
    else {
        const preset = defaultPresets[resolvedKey];
        if (preset) {
            templateTextarea.value = preset.template;
            templateTextarea.disabled = true;
        }
        else {
            templateTextarea.value = storedTemplate || "";
            templateTextarea.disabled = false;
            templateSelect.value = "custom";
        }
    }
}
/**
 * Populates enhancement settings in the form
 */
async function populateEnhancementSettings(config) {
    // Handle enhancement template selection
    await handleEnhancementTemplateSelection(config);
    toggleEnhancementSettings(config.enhancementEnabled);
    updateEnhancementUI(config.selectedProvider, config);
    // Enhancement model: select (dynamic fetch) vs manual text-input mode
    const selectContainer = document.getElementById("nig-enhancement-model-container-select");
    const manualContainer = document.getElementById("nig-enhancement-model-container-manual");
    const modelManual = document.getElementById("nig-enhancement-model-manual");
    // Always seed the manual input with the saved model so switching modes is lossless
    if (modelManual) {
        modelManual.value = config.enhancementModel || "";
    }
    if (config.enhancementModelManualInput) {
        if (selectContainer) {
            selectContainer.style.display = "none";
        }
        if (manualContainer) {
            manualContainer.style.display = "block";
        }
    }
    else {
        if (selectContainer) {
            selectContainer.style.display = "block";
        }
        if (manualContainer) {
            manualContainer.style.display = "none";
        }
        await models/* loadEnhancementModels */.jG(config.enhancementModel, config.enhancementBaseUrl, config.enhancementApiKey);
    }
}
/**
 * Saves enhancement configuration to storage
 */
async function saveEnhancementConfig() {
    await storage/* setConfigValue */.yJ("enhancementEnabled", document.getElementById("nig-enhancement-enabled").checked);
    await storage/* setConfigValue */.yJ("enhancementApiKey", document.getElementById("nig-enhancement-api-key").value.trim());
    await storage/* setConfigValue */.yJ("enhancementBaseUrl", document.getElementById("nig-enhancement-base-url").value.trim());
    const isManualMode = isEnhancementManualMode();
    const enhancementModelValue = isManualMode
        ? document.getElementById("nig-enhancement-model-manual").value.trim()
        : document.getElementById("nig-enhancement-model").value.trim();
    await storage/* setConfigValue */.yJ("enhancementModel", enhancementModelValue);
    await storage/* setConfigValue */.yJ("enhancementModelManualInput", isManualMode);
    await storage/* setConfigValue */.yJ("enhancementTemplate", document.getElementById("nig-enhancement-template").value.trim());
    await storage/* setConfigValue */.yJ("enhancementTemplateSelected", document.getElementById("nig-enhancement-template-select").value);
    await storage/* setConfigValue */.yJ("enhancementOverrideProvider", false); // Reset override on save
}
/**
 * Sets up enhancement event listeners
 */
function setupEnhancementEventListeners(panelElement) {
    const enhancementEnabled = panelElement.querySelector("#nig-enhancement-enabled");
    const overrideProviderBtn = panelElement.querySelector("#nig-override-provider");
    const templateSelect = panelElement.querySelector("#nig-enhancement-template-select");
    const templateResetBtn = panelElement.querySelector("#nig-template-reset");
    const templateSavePresetBtn = panelElement.querySelector("#nig-template-save-preset");
    const templateDeletePresetBtn = panelElement.querySelector("#nig-template-delete-preset");
    const templateExampleBtn = panelElement.querySelector("#nig-template-example");
    const enhancementFetchBtn = panelElement.querySelector("#nig-enhancement-fetch-models");
    const enhancementSwitchToManual = panelElement.querySelector("#nig-enhancement-switch-to-manual");
    const enhancementSwitchToSelect = panelElement.querySelector("#nig-enhancement-switch-to-select");
    // Enhancement Template Selection Handler
    templateSelect.addEventListener("change", async (e) => {
        const selectedValue = e.target.value;
        const templateTextarea = panelElement.querySelector("#nig-enhancement-template");
        const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
        const config = await storage/* getConfig */.zj();
        const userPresets = getNormalizedUserPresets(config);
        if (selectedValue === "custom") {
            // Custom one-off: textarea editable, not bound to a named preset.
            templateTextarea.disabled = false;
            await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
        }
        else if (selectedValue.startsWith("user:")) {
            const id = selectedValue.replace(/^user:/, "");
            const preset = userPresets[id];
            if (preset) {
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", `user:${id}`);
            }
            else {
                // Missing user preset -> treat as custom to avoid data loss.
                templateTextarea.disabled = false;
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
            }
        }
        else {
            // Default preset
            const preset = defaultPresets[selectedValue];
            if (preset) {
                templateTextarea.value = preset.template;
                templateTextarea.disabled = true;
                await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", selectedValue);
            }
            else {
                // Unknown key: fallback to custom
                templateTextarea.disabled = false;
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
            }
        }
    });
    // Save as Preset Button
    if (templateSavePresetBtn) {
        templateSavePresetBtn.addEventListener("click", async () => {
            try {
                const templateTextarea = panelElement.querySelector("#nig-enhancement-template");
                const templateSelectEl = panelElement.querySelector("#nig-enhancement-template-select");
                const rawText = (templateTextarea.value || "").trim();
                if (!rawText) {
                    (0,uiUtils/* showToast */.P0)("Cannot save an empty enhancement preset.", "error");
                    return;
                }
                const name = await (0,uiUtils/* showPrompt */.q9)("Enter a name for this enhancement preset:", "", "Save Enhancement Preset");
                if (!name) {
                    return;
                }
                const trimmedName = name.trim();
                if (!trimmedName) {
                    (0,uiUtils/* showToast */.P0)("Preset name cannot be empty.", "error");
                    return;
                }
                const config = await storage/* getConfig */.zj();
                const existing = getNormalizedUserPresets(config);
                // Generate stable id from name
                const baseId = trimmedName
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-_]/g, "")
                    .substring(0, 64) || "preset";
                let id = baseId;
                let suffix = 1;
                while (existing[id] && existing[id].name !== trimmedName) {
                    id = `${baseId}-${suffix++}`;
                }
                const nowIso = new Date().toISOString();
                existing[id] = {
                    id,
                    name: trimmedName,
                    description: "",
                    template: rawText,
                    createdAt: existing[id]?.createdAt || nowIso,
                    updatedAt: nowIso,
                    version: 1,
                };
                await saveUserPresetsToStorage(existing);
                // Refresh select with new user preset list
                populateEnhancementTemplateSelect(templateSelectEl, existing, `user:${id}`);
                // Lock textarea for the saved preset
                templateTextarea.value = rawText;
                templateTextarea.disabled = true;
                await storage/* setConfigValue */.yJ("enhancementTemplate", rawText);
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", `user:${id}`);
                (0,uiUtils/* showToast */.P0)(`Enhancement preset "${trimmedName}" saved under User Presets.`, "success");
            }
            catch (e) {
                console.error("[NIG] Failed to save enhancement preset", e);
                (0,uiUtils/* showToast */.P0)("Failed to save enhancement preset. Please check the console for details.", "error");
            }
        });
    }
    // Delete selected user preset
    if (templateDeletePresetBtn) {
        templateDeletePresetBtn.addEventListener("click", async () => {
            try {
                const templateSelectEl = panelElement.querySelector("#nig-enhancement-template-select");
                const templateTextarea = panelElement.querySelector("#nig-enhancement-template");
                const selected = templateSelectEl ? templateSelectEl.value : "";
                if (!selected || !selected.startsWith("user:")) {
                    (0,uiUtils/* showToast */.P0)('Please select a User Preset from the "User Presets" group to delete.', "error");
                    return;
                }
                const id = selected.replace(/^user:/, "");
                const config = await storage/* getConfig */.zj();
                const existing = getNormalizedUserPresets(config);
                if (!existing[id]) {
                    (0,uiUtils/* showToast */.P0)("The selected user preset no longer exists or is invalid.", "error");
                    return;
                }
                const confirmMessage = `Delete user preset "${existing[id].name || id}"? This action cannot be undone.`;
                if (!(await (0,uiUtils/* showConfirm */.GQ)(confirmMessage, "Delete User Preset"))) {
                    return;
                }
                // Remove preset and persist
                delete existing[id];
                await saveUserPresetsToStorage(existing);
                // Rebuild the select; default to "standard" if available or "custom"
                const fallbackKey = defaults/* DEFAULTS */.z.enhancementPresets?.standard
                    ? "standard"
                    : "custom";
                populateEnhancementTemplateSelect(templateSelectEl, existing, fallbackKey);
                // If we deleted the active preset, update textarea and selection accordingly
                if (selected === config.enhancementTemplateSelected) {
                    if (fallbackKey === "custom") {
                        templateTextarea.value = (config.enhancementTemplate || "").trim();
                        templateTextarea.disabled = false;
                        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
                    }
                    else {
                        const fallbackPreset = defaults/* DEFAULTS */.z.enhancementPresets[fallbackKey];
                        templateTextarea.value = fallbackPreset?.template || "";
                        templateTextarea.disabled = Boolean(fallbackPreset);
                        if (fallbackPreset) {
                            await storage/* setConfigValue */.yJ("enhancementTemplate", fallbackPreset.template);
                        }
                        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", fallbackKey);
                    }
                }
                (0,uiUtils/* showToast */.P0)("User preset deleted.", "success");
            }
            catch (e) {
                console.error("[NIG] Failed to delete enhancement user preset", e);
                (0,uiUtils/* showToast */.P0)("Failed to delete user preset. Please check the console for details.", "error");
            }
        });
    }
    // Reset to Preset Button
    templateResetBtn.addEventListener("click", async () => {
        const selectedValue = templateSelect.value;
        const templateTextarea = panelElement.querySelector("#nig-enhancement-template");
        const defaultPresets = defaults/* DEFAULTS */.z.enhancementPresets || {};
        const config = await storage/* getConfig */.zj();
        const userPresets = getNormalizedUserPresets(config);
        if (selectedValue !== "custom") {
            if (selectedValue.startsWith("user:")) {
                const id = selectedValue.replace(/^user:/, "");
                const preset = userPresets[id];
                if (preset) {
                    templateTextarea.value = preset.template;
                    templateTextarea.disabled = true;
                    await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
                    await storage/* setConfigValue */.yJ("enhancementTemplateSelected", `user:${id}`);
                }
            }
            else {
                const preset = defaultPresets[selectedValue];
                if (preset) {
                    templateTextarea.value = preset.template;
                    templateTextarea.disabled = true;
                    await storage/* setConfigValue */.yJ("enhancementTemplate", preset.template);
                    await storage/* setConfigValue */.yJ("enhancementTemplateSelected", selectedValue);
                }
            }
        }
        else {
            // If "custom" is selected, reset should restore stored custom text if any.
            const cfg = await storage/* getConfig */.zj();
            const customTemplate = typeof cfg.enhancementTemplate === "string"
                ? cfg.enhancementTemplate
                : "";
            templateTextarea.value = customTemplate;
            templateTextarea.disabled = false;
            await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
        }
    });
    // Load Example Button
    templateExampleBtn.addEventListener("click", async () => {
        const exampleTemplate = 'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:';
        const templateTextarea = panelElement.querySelector("#nig-enhancement-template");
        const templateSelect = panelElement.querySelector("#nig-enhancement-template-select");
        // Treat example as an explicit template choice: store it and mark as custom.
        templateTextarea.value = exampleTemplate;
        templateTextarea.disabled = false;
        if (templateSelect) {
            templateSelect.value = "custom";
        }
        await storage/* setConfigValue */.yJ("enhancementTemplate", exampleTemplate);
        await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
    });
    // Enhancement enabled toggle
    enhancementEnabled.addEventListener("change", async (e) => {
        const newState = e.target.checked;
        const config = await storage/* getConfig */.zj();
        config.enhancementEnabled = newState;
        await storage/* setConfigValue */.yJ("enhancementEnabled", newState);
        toggleEnhancementSettings(newState);
        const provider = document.getElementById("nig-provider").value;
        updateEnhancementUI(provider, config);
    });
    // Override provider enhancement
    overrideProviderBtn.addEventListener("click", async () => {
        const provider = document.getElementById("nig-provider").value;
        await storage/* setConfigValue */.yJ("enhancementOverrideProvider", true);
        const config = await storage/* getConfig */.zj();
        updateEnhancementUI(provider, config);
    });
    // Enhancement model fetch (dynamic discovery) and select/manual mode toggling
    if (enhancementFetchBtn) {
        enhancementFetchBtn.addEventListener("click", () => {
            const baseUrl = document
                .getElementById("nig-enhancement-base-url")
                .value.trim();
            const apiKey = document
                .getElementById("nig-enhancement-api-key")
                .value.trim();
            models/* fetchEnhancementModels */.xE(baseUrl, apiKey);
        });
    }
    if (enhancementSwitchToManual) {
        enhancementSwitchToManual.addEventListener("click", (e) => {
            e.preventDefault();
            const selectContainer = document.getElementById("nig-enhancement-model-container-select");
            const manualContainer = document.getElementById("nig-enhancement-model-container-manual");
            const select = document.getElementById("nig-enhancement-model");
            const manual = document.getElementById("nig-enhancement-model-manual");
            // Preserve the current selection when switching to manual input
            if (select && manual && !manual.value.trim()) {
                const currentVal = select.value.trim();
                if (currentVal) {
                    manual.value = currentVal;
                }
            }
            if (selectContainer) {
                selectContainer.style.display = "none";
            }
            if (manualContainer) {
                manualContainer.style.display = "block";
            }
        });
    }
    if (enhancementSwitchToSelect) {
        enhancementSwitchToSelect.addEventListener("click", (e) => {
            e.preventDefault();
            const selectContainer = document.getElementById("nig-enhancement-model-container-select");
            const manualContainer = document.getElementById("nig-enhancement-model-container-manual");
            if (selectContainer) {
                selectContainer.style.display = "block";
            }
            if (manualContainer) {
                manualContainer.style.display = "none";
            }
        });
    }
    // Track manual edits to enhancement template:
    // Always persist latest raw text for resilience.
    const templateTextareaForInput = panelElement.querySelector("#nig-enhancement-template");
    const templateSelectForInput = panelElement.querySelector("#nig-enhancement-template-select");
    if (templateTextareaForInput && templateSelectForInput) {
        templateTextareaForInput.addEventListener("input", async () => {
            const value = templateTextareaForInput.value;
            const currentSelect = templateSelectForInput.value;
            await storage/* setConfigValue */.yJ("enhancementTemplate", value);
            // Only mark as custom when explicitly in custom mode
            if (currentSelect === "custom") {
                await storage/* setConfigValue */.yJ("enhancementTemplateSelected", "custom");
            }
        });
    }
}

;// ./src/config/styles.ts
const PROMPT_CATEGORIES = [
    {
        name: "None",
        description: "No additional styling will be added to your prompt.",
        subStyles: [],
    },
    {
        name: "Anime",
        description: "Blends Japanese animation with global twists. Sub-styles often mix eras, genres, or crossovers for dynamic outputs.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Anime style, ...").',
            },
            {
                name: "Studio Ghibli-Inspired",
                description: "Whimsical, nature-focused fantasy with soft lines and emotional depth.",
                value: "Studio Ghibli style, ",
            },
            {
                name: "Cyberpunk Anime",
                description: "Neon-lit dystopias with high-tech mechs and gritty urban vibes.",
                value: "Cyberpunk anime style, ",
            },
            {
                name: "Semi-Realistic Anime",
                description: "Blends lifelike proportions with expressive anime eyes and shading.",
                value: "Semi-realistic anime style, ",
            },
            {
                name: "Mecha",
                description: "Giant robots and mechanical suits in epic battles.",
                value: "Mecha anime style, ",
            },
            {
                name: "Dynamic Action",
                description: "High-energy movements with power effects and intense expressions.",
                value: "Dynamic action anime style, ",
            },
            {
                name: "Soft Romantic",
                description: "Emotional interactions with gentle colors and sparkling accents.",
                value: "Soft romantic anime style, ",
            },
            {
                name: "Dark Fantasy Anime",
                description: "Grim, horror-tinged worlds with demons and shadows.",
                value: "Dark fantasy anime style, ",
            },
            {
                name: "Retro 80s Anime",
                description: "Vintage cel-shaded look with bold lines and synth vibes.",
                value: "80s retro anime style, ",
            },
            {
                name: "Portal Fantasy",
                description: "World-crossing elements with magical adaptations and RPG motifs.",
                value: "Portal fantasy anime style, ",
            },
            {
                name: "Slice-of-Life",
                description: "Everyday moments with relatable characters and cozy vibes.",
                value: "Slice-of-life anime style, ",
            },
            {
                name: "Serialized Narrative",
                description: "Panel-like compositions for ongoing story flows.",
                value: "Serialized narrative anime style, ",
            },
            {
                name: "Group Dynamic",
                description: "Interactions among multiple characters with balanced focus.",
                value: "Group dynamic anime style, ",
            },
        ],
    },
    {
        name: "Realism/Photorealism",
        description: "Excels in portraits and scenes mimicking photography, with sub-styles varying by subject or technique.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Realism/Photorealism style, ...").',
            },
            {
                name: "Hyperrealism",
                description: "Ultra-detailed, almost tangible textures and lighting.",
                value: "Hyperrealistic, ",
            },
            {
                name: "Cinematic Realism",
                description: "Film-like depth with dramatic angles and color grading.",
                value: "Cinematic realism, ",
            },
            {
                name: "Portrait Photorealism",
                description: "Human faces with natural skin, eyes, and expressions.",
                value: "Portrait photorealism, ",
            },
            {
                name: "Architectural Realism",
                description: "Precise building renders with environmental details.",
                value: "Architectural realism, ",
            },
            {
                name: "Nature Photorealism",
                description: "Verdant landscapes with dew and foliage intricacies.",
                value: "Nature photorealism, ",
            },
            {
                name: "Close-Up Detail",
                description: "Intimate views highlighting textures and fine elements.",
                value: "Close-up realistic style, ",
            },
            {
                name: "Historical Realism",
                description: "Period-accurate clothing and settings with grit.",
                value: "Historical realism, ",
            },
            {
                name: "Urban Realism",
                description: "Bustling city life with crowds and neon realism.",
                value: "Urban realism, ",
            },
            {
                name: "Stylized Realism",
                description: "Subtle artistic tweaks on photoreal bases.",
                value: "Stylized realism, ",
            },
            {
                name: "Documentary Style",
                description: "Raw, unpolished scenes like news photography.",
                value: "Documentary photo style, ",
            },
            {
                name: "Object Focus Realism",
                description: "Clear, highlighted items with neutral lighting.",
                value: "Object-focused realism, ",
            },
            {
                name: "Wildlife Realism",
                description: "Animals in habitats with fur and feather fidelity.",
                value: "Wildlife realism, ",
            },
            {
                name: "Detailed Portrait",
                description: "Lifelike faces with expressive features.",
                value: "Detailed portrait realism, ",
            },
            {
                name: "Environmental Immersion",
                description: "Rich settings enveloping subjects.",
                value: "Environmental immersion realism, ",
            },
        ],
    },
    {
        name: "Fantasy",
        description: "Epic worlds of magic and myth, with sub-styles spanning tones from whimsical to grim.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Fantasy style, ...").',
            },
            {
                name: "High Fantasy",
                description: "Medieval realms with elves, dragons, and quests.",
                value: "High fantasy art, ",
            },
            {
                name: "Dark Fantasy",
                description: "Grimdark horror with undead and moral ambiguity.",
                value: "Dark fantasy art, ",
            },
            {
                name: "Urban Fantasy",
                description: "Magic in modern cities, like hidden witches.",
                value: "Urban fantasy art, ",
            },
            {
                name: "Steampunk Fantasy",
                description: "Victorian tech with gears and airships.",
                value: "Steampunk fantasy style, ",
            },
            {
                name: "Fairy Tale",
                description: "Whimsical tales with enchanted woods and creatures.",
                value: "Fairy tale illustration style, ",
            },
            {
                name: "Heroic Adventure",
                description: "Bold explorers with raw magic and ancient relics.",
                value: "Heroic adventure fantasy art, ",
            },
            {
                name: "Creature Emphasis",
                description: "Fantastical beings in natural or enchanted environments.",
                value: "Creature-focused fantasy art, ",
            },
            {
                name: "Ethereal Grace",
                description: "Elegant figures in luminous, forested settings.",
                value: "Ethereal grace fantasy style, ",
            },
            {
                name: "Rugged Craftsmanship",
                description: "Stout builders in forged, underground realms.",
                value: "Rugged craftsmanship fantasy style, ",
            },
            {
                name: "Gothic Fantasy",
                description: "Haunted castles with vampires and storms.",
                value: "Gothic fantasy art, ",
            },
            {
                name: "Beast Majesty",
                description: "Powerful scaled creatures in dramatic poses.",
                value: "Majestic beast fantasy art, ",
            },
            {
                name: "Celestial Fantasy",
                description: "Starry realms with gods and floating islands.",
                value: "Celestial fantasy art, ",
            },
            {
                name: "Oriental Myth",
                description: "Asian folklore elements with harmonious nature.",
                value: "Oriental myth fantasy style, ",
            },
            {
                name: "Treasure Hunt Vibe",
                description: "Exploratory scenes with hidden wonders.",
                value: "Treasure hunt fantasy art, ",
            },
        ],
    },
    {
        name: "Sci-Fi",
        description: "Futuristic visions from gritty cyber worlds to cosmic explorations.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Sci-Fi style, ...").',
            },
            {
                name: "Cyberpunk",
                description: "Neon dystopias with hackers and megacorps.",
                value: "Cyberpunk style, ",
            },
            {
                name: "Retro-Futurism",
                description: "1950s optimism with ray guns and chrome.",
                value: "Retro-futurism, ",
            },
            {
                name: "Biopunk",
                description: "Organic tech with genetic mutations.",
                value: "Biopunk sci-fi style, ",
            },
            {
                name: "Interstellar Epic",
                description: "Vast cosmic tales with diverse species and ships.",
                value: "Interstellar epic sci-fi art, ",
            },
            {
                name: "Mechanical Suit",
                description: "Armored machines in high-tech conflicts.",
                value: "Mechanical suit sci-fi style, ",
            },
            {
                name: "Post-Human",
                description: "Cyborgs and AI in evolved societies.",
                value: "Post-human sci-fi art, ",
            },
            {
                name: "Hard Sci-Fi",
                description: "Physics-based realism with tech schematics.",
                value: "Hard sci-fi illustration, ",
            },
            {
                name: "Dieselpunk",
                description: "1930s grit with riveted machines.",
                value: "Dieselpunk style, ",
            },
            {
                name: "Astro-Mythology",
                description: "Space gods and cosmic myths.",
                value: "Astro-mythology art, ",
            },
            {
                name: "Eco-Sci-Fi",
                description: "Post-apocalypse with bio-domes.",
                value: "Eco-sci-fi art, ",
            },
            {
                name: "Survival Wasteland",
                description: "Harsh, ruined landscapes with resilient figures.",
                value: "Survival wasteland sci-fi style, ",
            },
            {
                name: "Cosmic Discovery",
                description: "Unknown worlds with exploratory tech.",
                value: "Cosmic discovery sci-fi art, ",
            },
        ],
    },
    {
        name: "Retro/Vintage",
        description: "Nostalgic aesthetics from bygone eras, revived with AI flair.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Retro/Vintage style, ...").',
            },
            {
                name: "Art Deco",
                description: "Geometric luxury with gold and symmetry.",
                value: "Art Deco style, ",
            },
            {
                name: "Art Nouveau",
                description: "Flowing organic lines and floral motifs.",
                value: "Art Nouveau style, ",
            },
            {
                name: "Vintage Poster",
                description: "Bold typography and illustrative ads.",
                value: "Vintage poster style, ",
            },
            {
                name: "Chromolithography",
                description: "Vibrant, printed color layers from 1900s.",
                value: "Chromolithography, ",
            },
            {
                name: "Baroque",
                description: "Ornate drama with rich drapery.",
                value: "Baroque painting style, ",
            },
            {
                name: "Ukiyo-e",
                description: "Japanese woodblock prints with flat colors.",
                value: "Ukiyo-e style, ",
            },
            {
                name: "1950s Retro",
                description: "Atomic age optimism with pastels.",
                value: "1950s retro style, ",
            },
            {
                name: "Playful Figure",
                description: "Charming, stylized poses with vintage flair.",
                value: "Playful vintage figure style, ",
            },
            {
                name: "Edwardian",
                description: "Lacy elegance with soft pastels.",
                value: "Edwardian era style, ",
            },
            {
                name: "Mid-Century Modern",
                description: "Clean lines and bold geometrics.",
                value: "Mid-century modern style, ",
            },
            {
                name: "Ink Scroll",
                description: "Brush-like lines evoking ancient manuscripts.",
                value: "Ink scroll vintage style, ",
            },
        ],
    },
    {
        name: "Surrealism",
        description: "Dreamlike distortions challenging reality, inspired by masters.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Surrealism style, ...").',
            },
            {
                name: "Fluid Distortion",
                description: "Melting forms and impossible blends.",
                value: "Fluid distortion surrealism, ",
            },
            {
                name: "Paradoxical Objects",
                description: "Everyday items in illogical arrangements.",
                value: "Paradoxical object surrealism, ",
            },
            {
                name: "Ernst Collage Surreal",
                description: "Layered fragments for uncanny narratives.",
                value: "Ernst collage surrealism, ",
            },
            {
                name: "Kahlo Autobiographical",
                description: "Personal symbolism with thorny motifs.",
                value: "Frida Kahlo style surrealism, ",
            },
            {
                name: "Biomorphic Surreal",
                description: "Organic, creature-like hybrids.",
                value: "Biomorphic surrealism, ",
            },
            {
                name: "Dreamlike Landscapes",
                description: "Floating islands and inverted gravity.",
                value: "Dreamlike surreal landscape, ",
            },
            {
                name: "Freudian Symbolic",
                description: "Subconscious icons like eyes and stairs.",
                value: "Freudian symbolic surrealism, ",
            },
            {
                name: "Pop Surrealism",
                description: "Whimsical grotesquery with candy colors.",
                value: "Pop surrealism, lowbrow art, ",
            },
            {
                name: "Hyper-Surreal",
                description: "Exaggerated distortions in vivid detail.",
                value: "Hyper-surrealism, ",
            },
            {
                name: "Eco-Surreal",
                description: "Nature twisted with human elements.",
                value: "Eco-surrealism, ",
            },
            {
                name: "Mechanical Surreal",
                description: "Machines fused with flesh.",
                value: "Mechanical surrealism, ",
            },
            {
                name: "Inner Vision",
                description: "Symbolic inner thoughts with blended realities.",
                value: "Inner vision surrealism, ",
            },
        ],
    },
    {
        name: "Cartoon/Illustration",
        description: "Exaggerated, narrative-driven visuals for fun and storytelling.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Cartoon/Illustration style, ...").',
            },
            {
                name: "Pixar 3D",
                description: "Polished, expressive CG with emotional arcs.",
                value: "Pixar 3D animation style, ",
            },
            {
                name: "Disney Classic",
                description: "Hand-drawn whimsy with fluid animation.",
                value: "Classic Disney animation style, ",
            },
            {
                name: "DreamWorks",
                description: "Edgy humor with detailed backgrounds.",
                value: "DreamWorks animation style, ",
            },
            {
                name: "Adventure Time",
                description: "Surreal candy lands with bold shapes.",
                value: "Adventure Time cartoon style, ",
            },
            {
                name: "Simpsons",
                description: "Yellow-skinned satire with clean outlines.",
                value: "The Simpsons cartoon style, ",
            },
            {
                name: "Rick and Morty",
                description: "Sci-fi absurdity with warped perspectives.",
                value: "Rick and Morty cartoon style, ",
            },
            {
                name: "Narrative Panel",
                description: "Sequential art with shaded storytelling.",
                value: "Narrative panel illustration style, ",
            },
            {
                name: "Whimsical Illustration",
                description: "Gentle, colorful drawings for light-hearted scenes.",
                value: "Whimsical illustration style, ",
            },
            {
                name: "Webtoon",
                description: "Vertical scroll with vibrant digital ink.",
                value: "Webtoon style, ",
            },
            {
                name: "Manhua Flow",
                description: "Dynamic lines and vibrant digital shading.",
                value: "Manhua flow illustration style, ",
            },
            {
                name: "Cover Art Focus",
                description: "Striking compositions for thematic highlights.",
                value: "Cover art illustration, ",
            },
        ],
    },
    {
        name: "Traditional Painting",
        description: "Emulates historical mediums like oils and watercolors for timeless appeal.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Traditional Painting style, ...").',
            },
            {
                name: "Impressionism",
                description: "Loose brushstrokes capturing light moments.",
                value: "Impressionist painting, ",
            },
            {
                name: "Renaissance",
                description: "Balanced compositions with chiaroscuro.",
                value: "Renaissance painting style, ",
            },
            {
                name: "Oil Painting",
                description: "Rich, layered textures with glazing.",
                value: "Oil painting, ",
            },
            {
                name: "Watercolor",
                description: "Translucent washes for ethereal softness.",
                value: "Watercolor painting, ",
            },
            {
                name: "Baroque",
                description: "Dramatic tenebrism and opulent details.",
                value: "Baroque painting, ",
            },
            {
                name: "Romanticism",
                description: "Emotional storms and heroic figures.",
                value: "Romanticism painting, ",
            },
            {
                name: "Pointillism",
                description: "Dot-based color mixing for vibrancy.",
                value: "Pointillism style, ",
            },
            {
                name: "Fresco",
                description: "Mural-like with aged plaster effects.",
                value: "Fresco painting style, ",
            },
            {
                name: "Encaustic",
                description: "Waxy, heated layers for luminous depth.",
                value: "Encaustic painting, ",
            },
            {
                name: "Acrylic",
                description: "Bold, matte finishes with quick drying.",
                value: "Acrylic painting, ",
            },
            {
                name: "Gouache",
                description: "Opaque vibrancy like matte poster paint.",
                value: "Gouache painting, ",
            },
            {
                name: "Sumi-e",
                description: "Minimalist ink washes for Zen simplicity.",
                value: "Sumi-e ink wash painting, ",
            },
            {
                name: "Oriental Brushwork",
                description: "Minimalist inks for balanced compositions.",
                value: "Oriental brushwork style, ",
            },
            {
                name: "Era Line Art",
                description: "Detailed etchings for historical depth.",
                value: "Era line art traditional, ",
            },
        ],
    },
    {
        name: "Digital Art",
        description: "Modern, tech-infused creations from pixels to vectors.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Digital Art style, ...").',
            },
            {
                name: "Vector Illustration",
                description: "Scalable, flat colors with clean paths.",
                value: "Vector illustration, ",
            },
            {
                name: "Blended Landscape",
                description: "Layered digital environments for immersive backdrops.",
                value: "Blended digital landscape, ",
            },
            {
                name: "Neon Glow",
                description: "Vibrant outlines with electric luminescence.",
                value: "Neon glow digital art, ",
            },
            {
                name: "Holographic",
                description: "Shimmering, 3D projections with refractions.",
                value: "Holographic style, ",
            },
            {
                name: "World-Building Sketch",
                description: "Conceptual layers for expansive scenes.",
                value: "World-building digital sketch, ",
            },
            {
                name: "Community Render",
                description: "Polished digital interpretations of characters.",
                value: "Community render digital style, ",
            },
        ],
    },
    {
        name: "Wuxia/Xianxia",
        description: "Eastern-inspired martial and spiritual themes with energy flows, ancient motifs, and harmonious or intense atmospheres.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Wuxia/Xianxia style, ...").',
            },
            {
                name: "Qi Energy Flow",
                description: "Subtle auras and internal power visualizations.",
                value: "Qi energy flow style, ",
            },
            {
                name: "Martial Grace",
                description: "Fluid poses and disciplined movements.",
                value: "Martial grace style, ",
            },
            {
                name: "Spiritual Realm",
                description: "Misty, elevated worlds with ethereal elements.",
                value: "Spiritual realm style, ",
            },
            {
                name: "Ancient Sect Aesthetic",
                description: "Traditional architecture and robed figures.",
                value: "Ancient sect aesthetic, ",
            },
            {
                name: "Demonic Shadow",
                description: "Darkened energies and mysterious silhouettes.",
                value: "Demonic shadow style, ",
            },
            {
                name: "Dynasty Elegance",
                description: "Silk textures and jade accents in historical tones.",
                value: "Dynasty elegance style, ",
            },
        ],
    },
    {
        name: "Romance",
        description: "Tender or passionate human connections with soft lighting, expressions, and atmospheric details.",
        subStyles: [
            {
                name: "None",
                value: "none",
                description: 'Use only the main style name as a prefix (e.g., "Romance style, ...").',
            },
            {
                name: "Gentle Intimacy",
                description: "Close, affectionate moments with warm hues.",
                value: "Gentle intimacy romance style, ",
            },
            {
                name: "Urban Affection",
                description: "Modern settings with subtle romantic gestures.",
                value: "Urban affection style, ",
            },
            {
                name: "Enchanted Bond",
                description: "Magical elements enhancing emotional ties.",
                value: "Enchanted bond romance style, ",
            },
            {
                name: "Tension Build",
                description: "Subtle conflicts leading to connection.",
                value: "Tension build romance style, ",
            },
            {
                name: "Blushing Softness",
                description: "Delicate emotions with pastel accents.",
                value: "Blushing softness style, ",
            },
            {
                name: "Melancholic Yearning",
                description: "Poignant separations with evocative moods.",
                value: "Melancholic yearning romance art, ",
            },
        ],
    },
];

;// ./src/config/configManager.ts
// --- IMPORTS ---








// --- INTERNAL HELPERS ---
/**
 * Normalize imported configuration for compatibility between legacy and current schemas.
 * Goals:
 * - Safely consume older exports (5.x / early 6.x) and newer variants
 * - Start from DEFAULTS as baseline
 * - Overlay imported configuration while:
 *      - Preserving valid known fields (including presets, negative prompts, enhancements)
 *      - Preserving unknown fields for forward compatibility
 *      - Avoiding invalid type overwrites
 * - Apply targeted fixes for:
 *      - Nested payloads (e.g. { config: { ... }, meta: { ... } })
 *      - Legacy/renamed keys
 *      - String vs number coercions for numeric settings
 * - Preserve sensitive values (API keys, tokens) when present and valid
 * @param {object} importedConfigRaw
 * @returns {object} normalized configuration object
 */
function normalizeImportedConfig(importedConfigRaw = {}) {
    try {
        let importedConfig = importedConfigRaw;
        // --- Support nested payloads: { config: { ... }, meta: { ... } } ---
        if (importedConfig &&
            typeof importedConfig === "object" &&
            !Array.isArray(importedConfig)) {
            if (importedConfig.config &&
                typeof importedConfig.config === "object" &&
                !Array.isArray(importedConfig.config)) {
                importedConfig = importedConfig.config;
            }
        }
        // Guard against non-object payloads after unwrapping
        if (!importedConfig ||
            typeof importedConfig !== "object" ||
            Array.isArray(importedConfig)) {
            logger/* logError */.vV("CONFIG_IMPORT", "Invalid configuration format after normalization; using DEFAULTS", {
                importedType: typeof importedConfig,
            });
            return { ...defaults/* DEFAULTS */.z };
        }
        // Start from defaults (shallow clone - structure is flat enough for our use)
        const normalized = { ...defaults/* DEFAULTS */.z };
        // --- Overlay imported config with cautious merging ---
        // We:
        //  - Apply values for known keys when types are compatible or coercible
        //  - Keep unknown keys as-is for forward compatibility
        //  - Avoid breaking core structure with obviously invalid types
        const _coerceNumber = (value) => {
            if (typeof value === "number") {
                return value;
            }
            if (typeof value === "string" && value.trim() !== "") {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : undefined;
            }
            return undefined;
        };
        const _isBoolean = (value) => typeof value === "boolean";
        const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
        // First copy all keys from importedConfig, then selectively clean/fix known ones.
        Object.assign(normalized, importedConfig);
        // --- Backward compatibility and field normalization ---
        // Detect legacy enhancement template selection:
        // If enhancementTemplateSelected missing but enhancementTemplate present:
        if (!("enhancementTemplateSelected" in importedConfig)) {
            const importedTemplate = importedConfig.enhancementTemplate;
            let matchedKey = null;
            if (importedTemplate &&
                typeof importedTemplate === "string" &&
                defaults/* DEFAULTS */.z.enhancementPresets) {
                for (const [key, preset] of Object.entries(defaults/* DEFAULTS */.z.enhancementPresets)) {
                    if (preset &&
                        typeof preset === "object" &&
                        preset.template === importedTemplate) {
                        matchedKey = key;
                        break;
                    }
                }
            }
            if (matchedKey) {
                normalized.enhancementTemplateSelected = matchedKey;
            }
            else {
                // Default to custom while preserving enhancementTemplate content
                normalized.enhancementTemplateSelected = "custom";
            }
        }
        else {
            // Validate enhancementTemplateSelected if present
            const sel = normalized.enhancementTemplateSelected;
            const presets = defaults/* DEFAULTS */.z.enhancementPresets || {};
            if (!sel || (sel !== "custom" && !presets[sel])) {
                normalized.enhancementTemplateSelected =
                    defaults/* DEFAULTS */.z.enhancementTemplateSelected || "standard";
            }
        }
        // Ensure enhancement-related new tuning fields are populated when missing/invalid
        const ensureNumber = (value, fallback) => typeof value === "number" && !isNaN(value) && value >= 0
            ? value
            : fallback;
        const ensureLogLevel = (value, fallback) => {
            const allowed = ["debug", "info", "warn", "error"];
            return allowed.includes(value) ? value : fallback;
        };
        // --- Migrate legacy enhancement config to OpenAI-compatible ---
        // Remove dead keys that no longer exist in DEFAULTS.
        delete normalized.enhancementProvider;
        delete normalized.enhancementModelsFallback;
        // Clear legacy provider-prefixed model names — they won't work with OpenAI-compatible endpoints.
        const legacyModel = normalized.enhancementModel;
        if (typeof legacyModel === "string" &&
            legacyModel.startsWith("models/")) {
            normalized.enhancementModel = defaults/* DEFAULTS */.z.enhancementModel;
        }
        // Ensure enhancementBaseUrl field exists for OpenAI-compatible enhancement.
        if (typeof normalized.enhancementBaseUrl !== "string") {
            normalized.enhancementBaseUrl = defaults/* DEFAULTS */.z.enhancementBaseUrl;
        }
        // enhancementMaxRetriesPerModel
        normalized.enhancementMaxRetriesPerModel = ensureNumber(importedConfig.enhancementMaxRetriesPerModel, defaults/* DEFAULTS */.z.enhancementMaxRetriesPerModel);
        // enhancementRetryDelay
        normalized.enhancementRetryDelay = ensureNumber(importedConfig.enhancementRetryDelay, defaults/* DEFAULTS */.z.enhancementRetryDelay);
        // enhancementModelsFallback normalization removed — legacy fallback list
        // is stripped above during migration. OpenAI-compatible enhancement uses a single model.
        // enhancementLogLevel
        normalized.enhancementLogLevel = ensureLogLevel(importedConfig.enhancementLogLevel, defaults/* DEFAULTS */.z.enhancementLogLevel);
        // enhancementAlwaysFallback
        if (typeof importedConfig.enhancementAlwaysFallback === "boolean") {
            normalized.enhancementAlwaysFallback =
                importedConfig.enhancementAlwaysFallback;
        }
        else {
            normalized.enhancementAlwaysFallback = defaults/* DEFAULTS */.z.enhancementAlwaysFallback;
        }
        // enhancementPresets: if missing or invalid, fill from defaults
        if (!importedConfig.enhancementPresets ||
            typeof importedConfig.enhancementPresets !== "object") {
            normalized.enhancementPresets = defaults/* DEFAULTS */.z.enhancementPresets;
        }
        // --- Enhancement Template Selection & Legacy Preset Handling ---
        /**
         * Resolve a possibly legacy or invalid enhancement template key
         * to a safe, supported key.
         *
         * Rules:
         * - Allow 'standard', 'safety', 'artistic', 'technical', 'character', 'custom'
         * - Map legacy/removed defaults:
         *     - 'clean' -> 'safety'
         *     - 'environment' -> 'standard'
         *     - 'composition' -> 'technical'
         * - For any other unknown/non-string value, fall back to DEFAULTS.enhancementTemplateSelected or 'standard'
         */
        const resolveEnhancementTemplateKey = (rawKey) => {
            const validKeys = [
                "standard",
                "safety",
                "artistic",
                "technical",
                "character",
                "custom",
            ];
            if (typeof rawKey === "string" && rawKey.trim().length > 0) {
                const key = rawKey.trim();
                if (validKeys.includes(key)) {
                    return key;
                }
                switch (key) {
                    case "clean":
                        return "safety";
                    case "environment":
                        return "standard";
                    case "composition":
                        return "technical";
                    default:
                        break;
                }
            }
            return defaults/* DEFAULTS */.z.enhancementTemplateSelected || "standard";
        };
        // Ensure enhancementTemplateSelected is normalized using resolver
        normalized.enhancementTemplateSelected = resolveEnhancementTemplateKey(normalized.enhancementTemplateSelected ||
            importedConfig.enhancementTemplateSelected);
        // Pollinations legacy public model aliases now resolve to the current
        // source-backed public default, while preserving any non-legacy model name.
        if (typeof normalized.pollinationsModel !== "string" ||
            !normalized.pollinationsModel.trim()) {
            normalized.pollinationsModel = defaults/* DEFAULTS */.z.pollinationsModel;
        }
        else if (["flux", "turbo"].includes(normalized.pollinationsModel.trim())) {
            normalized.pollinationsModel = defaults/* DEFAULTS */.z.pollinationsModel;
        }
        // historyDays: default only when missing/invalid
        if (!("historyDays" in importedConfig)) {
            normalized.historyDays = defaults/* DEFAULTS */.z.historyDays ?? 30;
        }
        else {
            const parsedDays = parseInt(importedConfig.historyDays, 10);
            if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
                normalized.historyDays = defaults/* DEFAULTS */.z.historyDays ?? 30;
            }
            else {
                normalized.historyDays = parsedDays;
            }
        }
        // --- Sensitive / critical fields preservation ---
        // Direct provider API keys / tokens
        if (isNonEmptyString(importedConfig.aiHordeApiKey)) {
            normalized.aiHordeApiKey = importedConfig.aiHordeApiKey;
        }
        if (isNonEmptyString(importedConfig.pollinationsToken)) {
            normalized.pollinationsToken = importedConfig.pollinationsToken;
        }
        if (isNonEmptyString(importedConfig.enhancementApiKey)) {
            normalized.enhancementApiKey = importedConfig.enhancementApiKey;
        }
        // OpenAI-compatible profiles: ensure structure and preserve apiKey-like fields
        if (importedConfig.openAICompatProfiles &&
            typeof importedConfig.openAICompatProfiles === "object") {
            const normalizedProfiles = {};
            for (const [url, profile] of Object.entries(importedConfig.openAICompatProfiles)) {
                if (profile && typeof profile === "object") {
                    const cloned = { ...profile };
                    if (isNonEmptyString(profile.apiKey)) {
                        cloned.apiKey = profile.apiKey;
                    }
                    normalizedProfiles[url] = cloned;
                }
            }
            normalized.openAICompatProfiles = normalizedProfiles;
        }
        else if (defaults/* DEFAULTS */.z.openAICompatProfiles) {
            normalized.openAICompatProfiles = defaults/* DEFAULTS */.z.openAICompatProfiles;
        }
        // Preserve active profile URL if valid string, otherwise use default
        if (isNonEmptyString(importedConfig.openAICompatActiveProfileUrl)) {
            normalized.openAICompatActiveProfileUrl =
                importedConfig.openAICompatActiveProfileUrl;
        }
        else {
            normalized.openAICompatActiveProfileUrl =
                defaults/* DEFAULTS */.z.openAICompatActiveProfileUrl;
        }
        // Preserve openAICompatModelManualInput boolean
        if (typeof importedConfig.openAICompatModelManualInput === "boolean") {
            normalized.openAICompatModelManualInput =
                importedConfig.openAICompatModelManualInput;
        }
        else if (typeof normalized.openAICompatModelManualInput !== "boolean") {
            normalized.openAICompatModelManualInput =
                defaults/* DEFAULTS */.z.openAICompatModelManualInput;
        }
        // Preserve enhancementModelManualInput boolean (dropdown vs manual model input)
        if (typeof importedConfig.enhancementModelManualInput === "boolean") {
            normalized.enhancementModelManualInput =
                importedConfig.enhancementModelManualInput;
        }
        else if (typeof normalized.enhancementModelManualInput !== "boolean") {
            normalized.enhancementModelManualInput =
                defaults/* DEFAULTS */.z.enhancementModelManualInput;
        }
        // Ensure we do not overwrite valid sensitive values with empty defaults
        // If normalized has empty string but imported had non-empty, restore imported
        const sensitiveKeys = [
            "aiHordeApiKey",
            "pollinationsToken",
            "enhancementApiKey",
        ];
        for (const key of sensitiveKeys) {
            if (isNonEmptyString(importedConfig[key]) &&
                !isNonEmptyString(normalized[key])) {
                normalized[key] = importedConfig[key];
            }
        }
        return normalized;
    }
    catch (error) {
        logger/* logError */.vV("CONFIG_IMPORT", "Failed to normalize imported config", {
            error: error.message,
        });
        // On failure, fall back to DEFAULTS merged with raw imported config to avoid total breakage.
        try {
            const safeImported = importedConfigRaw &&
                typeof importedConfigRaw === "object" &&
                !Array.isArray(importedConfigRaw)
                ? importedConfigRaw
                : {};
            return { ...defaults/* DEFAULTS */.z, ...safeImported };
        }
        catch {
            return { ...defaults/* DEFAULTS */.z };
        }
    }
}
// --- PUBLIC FUNCTIONS ---
/**
 * Updates which provider settings are visible based on selected provider
 */
function updateVisibleSettings() {
    const provider = document.getElementById("nig-provider").value;
    document
        .querySelectorAll(".nig-provider-settings")
        .forEach((el) => (el.style.display = "none"));
    const settingsEl = document.getElementById(`nig-provider-${provider}`);
    if (settingsEl) {
        settingsEl.style.display = "block";
    }
}
/**
 * Updates sub-styles dropdown based on main style selection
 */
function updateSubStyles(mainStyleName) {
    const subStyleSelect = document.getElementById("nig-sub-style");
    const mainStyleDesc = document.getElementById("nig-main-style-desc");
    const subStyleDesc = document.getElementById("nig-sub-style-desc");
    const selectedCategory = PROMPT_CATEGORIES.find((cat) => cat.name === mainStyleName);
    mainStyleDesc.textContent = selectedCategory
        ? selectedCategory.description
        : "";
    subStyleSelect.innerHTML = "";
    if (selectedCategory && selectedCategory.subStyles.length > 0) {
        subStyleSelect.disabled = false;
        selectedCategory.subStyles.forEach((sub) => {
            const option = document.createElement("option");
            option.value = sub.value;
            option.textContent = sub.name;
            subStyleSelect.appendChild(option);
        });
        subStyleSelect.dispatchEvent(new Event("change"));
    }
    else {
        subStyleSelect.disabled = true;
        subStyleDesc.textContent = "";
    }
}
/**
 * Populates the configuration form with current settings
 */
async function populateConfigForm() {
    const config = await storage/* getConfig */.zj();
    // Provider selection
    document.getElementById("nig-provider").value = config.selectedProvider;
    // Style settings
    const mainStyleSelect = document.getElementById("nig-main-style");
    mainStyleSelect.innerHTML = "";
    PROMPT_CATEGORIES.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        mainStyleSelect.appendChild(option);
    });
    mainStyleSelect.value = config.mainPromptStyle;
    updateSubStyles(config.mainPromptStyle);
    document.getElementById("nig-sub-style").value = config.subPromptStyle;
    document.getElementById("nig-sub-style").dispatchEvent(new Event("change"));
    // Custom style settings
    const customStyleEnable = document.getElementById("nig-custom-style-enable");
    const customStyleText = document.getElementById("nig-custom-style-text");
    customStyleEnable.checked = config.customStyleEnabled;
    customStyleText.value = config.customStyleText;
    customStyleText.disabled = !config.customStyleEnabled;
    // Enhancement settings
    document.getElementById("nig-enhancement-enabled").checked =
        config.enhancementEnabled;
    document.getElementById("nig-enhancement-base-url").value =
        config.enhancementBaseUrl || "";
    document.getElementById("nig-enhancement-api-key").value =
        config.enhancementApiKey || "";
    document.getElementById("nig-enhancement-model-manual").value =
        config.enhancementModel || "";
    // Enhancement template selection will be handled by enhancementPanel.js
    // Negative prompt settings
    document.getElementById("nig-enable-neg-prompt").checked =
        config.enableNegPrompt;
    document.getElementById("nig-global-neg-prompt").value =
        config.globalNegPrompt;
    // Provider-specific settings will be handled by models.js
    // This will be called after the provider forms are populated
    // History days setting
    const historyDays = await storage/* getHistoryDays */.Iy();
    document.getElementById("nig-history-clean-days").value = historyDays;
    updateVisibleSettings();
}
/**
 * Populates provider-specific form sections
 */
async function populateProviderForms(config) {
    // Import and call the populateProviderForms from models.js
    const { populateProviderForms: populateProviderFormsModels } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 770));
    await populateProviderFormsModels(config);
}
/**
 * Saves configuration from form to storage
 */
async function saveConfig() {
    // Style configuration
    await storage/* setConfigValue */.yJ("mainPromptStyle", document.getElementById("nig-main-style").value);
    await storage/* setConfigValue */.yJ("subPromptStyle", document.getElementById("nig-sub-style").value);
    await storage/* setConfigValue */.yJ("customStyleEnabled", document.getElementById("nig-custom-style-enable").checked);
    await storage/* setConfigValue */.yJ("customStyleText", document.getElementById("nig-custom-style-text").value.trim());
    // Enhancement configuration (will be handled by enhancementPanel.js)
    await storage/* setConfigValue */.yJ("enhancementEnabled", document.getElementById("nig-enhancement-enabled").checked);
    await storage/* setConfigValue */.yJ("enhancementBaseUrl", document.getElementById("nig-enhancement-base-url").value.trim());
    await storage/* setConfigValue */.yJ("enhancementApiKey", document.getElementById("nig-enhancement-api-key").value.trim());
    const enhancementManualContainer = document.getElementById("nig-enhancement-model-container-manual");
    const enhancementIsManualMode = Boolean(enhancementManualContainer &&
        enhancementManualContainer.style.display !== "none");
    await storage/* setConfigValue */.yJ("enhancementModel", enhancementIsManualMode
        ? document.getElementById("nig-enhancement-model-manual").value.trim()
        : document.getElementById("nig-enhancement-model").value.trim());
    await storage/* setConfigValue */.yJ("enhancementTemplate", document.getElementById("nig-enhancement-template").value.trim());
    await storage/* setConfigValue */.yJ("enhancementTemplateSelected", document.getElementById("nig-enhancement-template-select").value);
    // Negative prompt configuration
    await storage/* setConfigValue */.yJ("enableNegPrompt", document.getElementById("nig-enable-neg-prompt").checked);
    await storage/* setConfigValue */.yJ("globalNegPrompt", document.getElementById("nig-global-neg-prompt").value.trim());
    // Provider selection
    await storage/* setConfigValue */.yJ("selectedProvider", document.getElementById("nig-provider").value);
    // Provider-specific configurations will be saved by their respective modules
    // (models.js for Pollinations, AI Horde, and OpenAI compatible)
    // Alert will be handled by the main saveConfig function in configPanel.js
}
/**
 * Exports configuration to a JSON file
 */
async function exportConfig() {
    // Export the current normalized configuration.
    // storage.getConfig() already merges stored values over DEFAULTS to produce a flat config.
    const config = await storage/* getConfig */.zj();
    const configData = JSON.stringify(config, null, 2);
    const filename = `wtr-lab-image-generator-config-${new Date().toISOString().split("T")[0]}.json`;
    file/* downloadFile */.P(filename, configData, "application/json");
}
/**
 * Imports configuration from a JSON file
 */
async function handleImportFile(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
        return;
    }
    try {
        const text = await selectedFile.text();
        const importedConfig = JSON.parse(text);
        if (!importedConfig ||
            typeof importedConfig !== "object" ||
            Array.isArray(importedConfig)) {
            throw new Error("Invalid configuration format: root must be an object.");
        }
        if (await (0,uiUtils/* showConfirm */.GQ)("This will overwrite all current settings. Continue?", "Import Configuration")) {
            const normalizedConfig = normalizeImportedConfig(importedConfig);
            try {
                // Persist all normalized keys to storage
                await Promise.all(Object.keys(normalizedConfig).map((key) => storage/* setConfigValue */.yJ(key, normalizedConfig[key])));
                // Retrieve the fully merged config (storage over DEFAULTS)
                const updatedConfig = await storage/* getConfig */.zj();
                // --- Reactive UI synchronization (no panel reopen required) ---
                // 1) Core config + styling + history
                try {
                    await populateConfigForm();
                }
                catch (uiError) {
                    logger/* logError */.vV("CONFIG_IMPORT", "Failed to update core configuration form after import", {
                        error: uiError?.message || uiError,
                    });
                }
                // 2) Provider-specific sections (Pollinations, AI Horde, OpenAICompat)
                try {
                    await (0,models.populateProviderForms)(updatedConfig);
                }
                catch (uiError) {
                    logger/* logError */.vV("CONFIG_IMPORT", "Failed to update provider configuration forms after import", {
                        error: uiError?.message || uiError,
                    });
                }
                // 3) Enhancement panel (enhancement settings)
                try {
                    if (typeof populateEnhancementSettings === "function") {
                        await populateEnhancementSettings(updatedConfig);
                    }
                }
                catch (uiError) {
                    logger/* logError */.vV("CONFIG_IMPORT", "Failed to update enhancement settings after import", {
                        error: uiError?.message || uiError,
                    });
                }
                // 4) Enhancement UI state in styling tab (provider-aware)
                try {
                    if (typeof updateEnhancementUI === "function") {
                        const provider = updatedConfig.selectedProvider || defaults/* DEFAULTS */.z.selectedProvider;
                        updateEnhancementUI(provider, updatedConfig);
                    }
                }
                catch (uiError) {
                    logger/* logError */.vV("CONFIG_IMPORT", "Failed to update enhancement UI state after import", {
                        error: uiError?.message || uiError,
                    });
                }
                (0,uiUtils/* showToast */.P0)("Configuration imported successfully! All visible settings have been updated.", "success");
            }
            catch (persistError) {
                // If persisting or UI sync fails in a critical way, surface a clear error
                logger/* logError */.vV("CONFIG_IMPORT", "Failed during configuration import application", {
                    error: persistError?.message || persistError,
                });
                (0,uiUtils/* showToast */.P0)("Configuration import failed while applying settings. " +
                    "Your previous configuration is still in effect. " +
                    `Details: ${persistError?.message || persistError}`, "error");
            }
        }
    }
    catch (error) {
        // Robust error handling for:
        // - Invalid JSON
        // - Non-object / malformed structures
        // - Unexpected runtime errors
        logger/* logError */.vV("CONFIG_IMPORT", "Failed to import configuration", {
            error: error?.message || error,
        });
        (0,uiUtils/* showToast */.P0)(`Failed to import configuration: ${error?.message || error}`, "error");
    }
    finally {
        // Always clear file input to allow re-import attempts
        event.target.value = "";
    }
}

;// ./src/components/historyManager.ts
// --- IMPORTS ---


// --- PUBLIC FUNCTIONS ---
// Track whether the history data has changed since last render to avoid
// full re-render on every tab visit (finding #23).
let lastRenderHash = "";
/**
 * Populates the history tab with the user's generation history
 */
async function populateHistoryTab() {
    const historyList = document.getElementById("nig-history-list");
    // Use the new getFilteredHistory function to respect the configured days setting
    const history = await storage/* getFilteredHistory */.A5();
    // Compute a simple hash to detect whether data has changed since last render.
    // This avoids full re-render on every tab visit when data hasn't changed.
    const currentHash = `${history.length}:${history.length > 0 ? history[0]?.date : ""}`;
    if (currentHash === lastRenderHash && historyList.children.length > 0) {
        return; // Data unchanged, skip re-render
    }
    lastRenderHash = currentHash;
    historyList.innerHTML = "";
    if (history.length === 0) {
        historyList.innerHTML = "<li>No history yet.</li>";
        return;
    }
    history.forEach((item) => {
        const li = document.createElement("li");
        li.className = "nig-history-item";
        const safePrompt = typeof item.prompt === "string"
            ? item.prompt
            : item && typeof item === "object" && typeof item.prompt === "string"
                ? item.prompt
                : "";
        const providerInfo = item && item.provider ? `<strong>${(0,uiUtils/* escapeHtml */.ZD)(item.provider)}</strong>` : "";
        const modelInfo = item && item.model ? `(${(0,uiUtils/* escapeHtml */.ZD)(item.model)})` : "";
        const metaText = new Date(item.date).toLocaleString();
        const metaHtml = `<div class="nig-history-meta"><small>${metaText} - ${providerInfo} ${modelInfo}</small></div>`;
        // Prompt display: up to 2 lines, full available width, ellipsis beyond 2 lines.
        // Use escapeHtml for XSS safety (finding #28).
        const promptHtml = safePrompt
            ? `<div class="nig-history-prompt" title="${(0,uiUtils/* escapeHtml */.ZD)(safePrompt)}">${(0,uiUtils/* escapeHtml */.ZD)(safePrompt)}</div>`
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
            Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 237)).then((module) => {
                if (typeof module.show === "function") {
                    module.show([item.url], safePrompt || "No prompt available", item.provider, item.model);
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
async function cleanHistory() {
    const daysInput = document.getElementById("nig-history-clean-days").value;
    const days = parseInt(daysInput);
    // Validate the input
    if (isNaN(days) || days < 1 || days > 365) {
        (0,uiUtils/* showToast */.P0)("Please enter a valid number of days (1-365).", "error");
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
            await storage/* setHistoryDays */.qH(days);
            // Create progress callback for link validation
            const progressCallback = (progress) => {
                cleanButton.innerHTML = `<span class="material-symbols-outlined">cleaning_services</span> Cleaning... (${progress.completed}/${progress.total} links checked)`;
            };
            // Use the enhanced cleanHistoryEnhanced function
            const result = await storage/* cleanHistoryEnhanced */.qg(progressCallback);
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
            (0,uiUtils/* showToast */.P0)(message, "success", 8000);
            await populateHistoryTab();
        }
        catch (error) {
            console.error("Failed to clean history:", error);
            (0,uiUtils/* showToast */.P0)("Failed to clean history. Please try again.", "error");
        }
        finally {
            // Restore button state - restore the complete original structure
            cleanButton.disabled = false;
            cleanButton.innerHTML = originalContent;
        }
    }
}
/**
 * Auto-saves history days setting when the input changes
 */
async function handleHistoryDaysChange(event) {
    const days = parseInt(event.target.value);
    if (!isNaN(days) && days >= 1 && days <= 365) {
        try {
            await storage/* setHistoryDays */.qH(days);
            // History days saved; no console output to respect logging toggle
            // Refresh the history tab to reflect the new setting
            const panelElement = document.getElementById("nig-config-panel");
            if (panelElement &&
                panelElement
                    .querySelector('.nig-tab[data-tab="history"]')
                    .classList.contains("active")) {
                await populateHistoryTab();
            }
        }
        catch (error) {
            console.error("Failed to auto-save history days setting:", error);
        }
    }
}

;// ./src/components/configPanelEvents.ts
// --- IMPORTS ---









/**
 * Initialize show/hide toggles for all password-like API key fields.
 * This is UI-only and does not affect storage, validation, or submission behavior.
 */
function initializePasswordVisibilityToggles(panelElement) {
    try {
        const toggles = panelElement.querySelectorAll(".nig-password-toggle");
        if (!toggles || toggles.length === 0) {
            // Graceful no-op: ensure keys remain hidden by default.
            return;
        }
        toggles.forEach((toggleBtn) => {
            // Avoid double-binding if panel is re-initialized.
            if (toggleBtn.dataset.nigToggleBound === "true") {
                return;
            }
            toggleBtn.dataset.nigToggleBound = "true";
            toggleBtn.addEventListener("click", (event) => {
                try {
                    event.preventDefault();
                    event.stopPropagation();
                    const targetId = toggleBtn.getAttribute("data-target");
                    if (!targetId) {
                        return;
                    }
                    const input = panelElement.querySelector(`#${CSS.escape(targetId)}`);
                    if (!input) {
                        return;
                    }
                    const isCurrentlyHidden = input.type === "password";
                    input.type = isCurrentlyHidden ? "text" : "password";
                    const icon = toggleBtn.querySelector(".material-symbols-outlined");
                    if (icon) {
                        icon.textContent = isCurrentlyHidden
                            ? "visibility"
                            : "visibility_off";
                    }
                    toggleBtn.setAttribute("aria-pressed", isCurrentlyHidden ? "true" : "false");
                    toggleBtn.setAttribute("aria-label", isCurrentlyHidden ? "Hide API key" : "Show API key");
                }
                catch (err) {
                    // Safety: log but do not break other behaviors.
                    try {
                        logger/* logError */.vV("UI", "Failed to toggle API key visibility", {
                            error: err.message,
                        });
                    }
                    catch (_) {
                        // Swallow if logger itself is unavailable in this context.
                    }
                }
            });
        });
    }
    catch (error) {
        // If anything unexpected happens, API keys remain masked by default.
        try {
            logger/* logError */.vV("UI", "Failed to initialize API key visibility toggles", {
                error: error.message,
            });
        }
        catch (_) {
            // Swallow secondary errors.
        }
    }
}
// --- PUBLIC FUNCTIONS ---
/**
 * Sets up all the tab functionality event listeners with ARIA keyboard navigation.
 * Implements the WAI-ARIA Tabs pattern: ArrowLeft/ArrowRight to move between
 * tabs, Home/End for first/last, and activation on click or Enter/Space.
 */
function setupTabEventListeners(panelElement) {
    // Initialize password visibility toggles once panel DOM is ready
    initializePasswordVisibilityToggles(panelElement);
    const tabs = Array.from(panelElement.querySelectorAll(".nig-tab"));
    function activateTab(tab) {
        panelElement
            .querySelectorAll(".nig-tab, .nig-tab-content")
            .forEach((el) => {
            el.classList.remove("active");
            if (el.classList.contains("nig-tab")) {
                el.setAttribute("aria-selected", "false");
                el.setAttribute("tabindex", "-1");
            }
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
        tab.focus();
        panelElement
            .querySelector(`#${tab.getAttribute("aria-controls")}`)
            .classList.add("active");
    }
    tabs.forEach((tab) => {
        tab.addEventListener("click", async () => {
            activateTab(tab);
            if (tab.dataset.tab === "history") {
                await populateHistoryTab();
                panelElement.querySelector("#nig-save-btn").style.display = "none";
            }
            else {
                panelElement.querySelector("#nig-save-btn").style.display = "block";
            }
        });
        // Keyboard navigation per WAI-ARIA Tabs pattern
        tab.addEventListener("keydown", async (e) => {
            const currentIndex = tabs.indexOf(tab);
            let newIndex = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                newIndex = (currentIndex + 1) % tabs.length;
            }
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }
            else if (e.key === "Home") {
                e.preventDefault();
                newIndex = 0;
            }
            else if (e.key === "End") {
                e.preventDefault();
                newIndex = tabs.length - 1;
            }
            else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                newIndex = currentIndex;
            }
            if (newIndex !== null) {
                const targetTab = tabs[newIndex];
                activateTab(targetTab);
                if (targetTab.dataset.tab === "history") {
                    await populateHistoryTab();
                    panelElement.querySelector("#nig-save-btn").style.display = "none";
                }
                else {
                    panelElement.querySelector("#nig-save-btn").style.display = "block";
                }
            }
        });
    });
}
/**
 * Sets up provider settings event listeners
 */
function setupProviderEventListeners(panelElement) {
    // Provider selection change
    panelElement
        .querySelector("#nig-provider")
        .addEventListener("change", (_e) => {
        updateVisibleSettings();
    });
}
/**
 * Sets up OpenAI Compatible functionality event listeners
 */
function setupOpenAIEventListeners(panelElement) {
    // OpenAI Compatible fetch models
    panelElement
        .querySelector("#nig-openai-compat-fetch-models")
        .addEventListener("click", () => {
        models/* fetchOpenAICompatModels */.VM();
    });
    // OpenAI Compatible profile selection
    panelElement
        .querySelector("#nig-openai-compat-profile-select")
        .addEventListener("change", models/* loadSelectedOpenAIProfile */.tH);
    // OpenAI Compatible delete profile
    panelElement
        .querySelector("#nig-openai-compat-delete-profile")
        .addEventListener("click", models/* deleteSelectedOpenAIProfile */.CB);
    // Switch to manual input mode
    panelElement
        .querySelector("#nig-openai-compat-switch-to-manual")
        .addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("nig-openai-model-container-select").style.display = "none";
        document.getElementById("nig-openai-model-container-manual").style.display = "block";
    });
    // Switch back to select mode
    panelElement
        .querySelector("#nig-openai-compat-switch-to-select")
        .addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("nig-openai-model-container-select").style.display = "block";
        document.getElementById("nig-openai-model-container-manual").style.display = "none";
    });
}
/**
 * Sets up utility function event listeners
 */
function setupUtilityEventListeners(panelElement) {
    // Export configuration
    panelElement
        .querySelector("#nig-export-btn")
        .addEventListener("click", exportConfig);
    // Import configuration
    panelElement
        .querySelector("#nig-import-file")
        .addEventListener("change", handleImportFile);
    // History cleanup
    panelElement
        .querySelector("#nig-history-clean-btn")
        .addEventListener("click", cleanHistory);
    // Auto-save history days setting when input changes
    panelElement
        .querySelector("#nig-history-clean-days")
        .addEventListener("change", handleHistoryDaysChange);
    // Clear cache
    panelElement
        .querySelector("#nig-clear-cache-btn")
        .addEventListener("click", () => cache/* clearCachedModels */.WN());
}
/**
 * Sets up logging functionality event listeners
 */
function setupLoggingEventListeners(panelElement) {
    // Toggle console logging and enhancement logs
    panelElement
        .querySelector("#nig-toggle-logging-btn")
        .addEventListener("click", async () => {
        const currentState = await storage/* getConfigValue */.Ct("loggingEnabled");
        const newState = !currentState;
        await storage/* setConfigValue */.yJ("loggingEnabled", newState);
        await logger/* updateLoggingStatus */.RJ();
        await logger/* loadEnhancementLogHistory */.xx();
        (0,uiUtils/* showToast */.P0)(`Debug Console & Enhancement Logs are now ${newState ? "ENABLED" : "DISABLED"}.`, "info");
    });
    // View enhancement logs
    panelElement
        .querySelector("#nig-view-enhancement-logs-btn")
        .addEventListener("click", async () => {
        const logs = await logger/* getEnhancementLogHistory */.$f();
        if (logs.length === 0) {
            (0,uiUtils/* showToast */.P0)("No enhancement logs found. Enhancement logging is disabled or no enhancement operations have been performed yet.", "info");
            return;
        }
        // Create logs modal
        const logModal = document.createElement("div");
        logModal.className = "nig-modal-overlay";
        logModal.innerHTML = `
            <div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-logs-title">
                <button type="button" class="nig-close-btn" aria-label="Close logs dialog">&times;</button>
                <h2 id="nig-logs-title">Enhancement Operation Logs</h2>
                <p>Detailed logs of prompt enhancement operations with timestamps and performance data.</p>
                <div style="max-height: 400px; overflow-y: auto; background: var(--nig-color-bg-tertiary); border-radius: var(--nig-radius-md); padding: var(--nig-space-lg); margin: var(--nig-space-lg) 0;">
                    <div id="nig-enhancement-logs-display"></div>
                </div>
            </div>
        `;
        document.body.appendChild(logModal);
        const logsDisplay = logModal.querySelector("#nig-enhancement-logs-display");
        logs.slice(0, 50).forEach((log) => {
            // Format the log entry similar to the original formatLogEntry function
            const time = new Date(log.timestamp || log.time).toLocaleString();
            const levelColors = {
                ERROR: "#ef4444",
                WARN: "#f59e0b",
                INFO: "#6366f1",
                DEBUG: "#8b5cf6",
            };
            const color = levelColors[log.level?.toUpperCase()] || "#6366f1";
            const logEntry = document.createElement("div");
            logEntry.style.cssText = `
                padding: var(--nig-space-sm) 0;
                border-bottom: 1px solid var(--nig-color-border);
                font-family: 'Fira Code', monospace;
                font-size: var(--nig-font-size-xs);
            `;
            logEntry.innerHTML = `
                <div style="display: flex; align-items: center; gap: var(--nig-space-sm); margin-bottom: var(--nig-space-xs);">
                    <span style="color: ${color}; font-weight: 600;">[${(0,uiUtils/* escapeHtml */.ZD)(log.level?.toUpperCase() || "INFO")}]</span>
                    <span style="color: var(--nig-color-text-muted); font-size: var(--nig-font-size-xs);">${(0,uiUtils/* escapeHtml */.ZD)(time)}</span>
                    <span style="color: var(--nig-color-accent-primary); font-weight: 500;">[${(0,uiUtils/* escapeHtml */.ZD)(log.category || "LOG")}]</span>
                </div>
                <div style="color: var(--nig-color-text-primary); margin-bottom: var(--nig-space-xs);">${(0,uiUtils/* escapeHtml */.ZD)(log.message || "No message")}</div>
                ${log.data ? `<pre style="color: var(--nig-color-text-secondary); font-size: var(--nig-font-size-xs); background: var(--nig-color-bg-primary); padding: var(--nig-space-sm); border-radius: var(--nig-radius-sm); margin: 0; overflow-x: auto;">${(0,uiUtils/* escapeHtml */.ZD)(JSON.stringify(log.data, null, 2))}</pre>` : ""}
            `;
            logsDisplay.appendChild(logEntry);
        });
        logModal
            .querySelector(".nig-close-btn")
            .addEventListener("click", () => logModal.remove());
    });
    // Clear enhancement logs
    panelElement
        .querySelector("#nig-clear-enhancement-logs-btn")
        .addEventListener("click", async () => {
        const logs = await logger/* getEnhancementLogHistory */.$f();
        if (logs.length === 0) {
            (0,uiUtils/* showToast */.P0)("No enhancement logs to clear.", "info");
            return;
        }
        const shouldClear = await (0,uiUtils/* showConfirm */.GQ)(`Are you sure you want to clear all ${logs.length} enhancement logs? This action cannot be undone.`, "Clear Enhancement Logs");
        if (shouldClear) {
            logger/* clearEnhancementLogs */.X();
            (0,uiUtils/* showToast */.P0)("All enhancement logs have been cleared.", "success");
        }
    });
}
/**
 * Sets up style functionality event listeners
 */
function setupStyleEventListeners(panelElement) {
    // Main style change
    panelElement
        .querySelector("#nig-main-style")
        .addEventListener("change", (e) => {
        updateSubStyles(e.target.value);
    });
    // Sub style change
    panelElement
        .querySelector("#nig-sub-style")
        .addEventListener("change", () => {
        const subStyle = panelElement.querySelector("#nig-sub-style").value;
        const subStyleDesc = document.getElementById("nig-sub-style-desc");
        const selectedCategory = PROMPT_CATEGORIES.find((cat) => cat.name === panelElement.querySelector("#nig-main-style").value);
        const selectedSubStyle = selectedCategory
            ? selectedCategory.subStyles.find((sub) => sub.value === subStyle)
            : null;
        subStyleDesc.textContent = selectedSubStyle
            ? selectedSubStyle.description
            : "";
    });
}
/**
 * Sets up custom style toggle event listeners
 */
function setupCustomStyleEventListeners(panelElement) {
    const customStyleEnable = panelElement.querySelector("#nig-custom-style-enable");
    const customStyleText = panelElement.querySelector("#nig-custom-style-text");
    customStyleEnable.addEventListener("change", () => {
        customStyleText.disabled = !customStyleEnable.checked;
    });
}
/**
 * Sets up provider change listener for enhancement UI
 */
function setupProviderEnhancementListener(panelElement) {
    panelElement
        .querySelector("#nig-provider")
        .addEventListener("change", async (e) => {
        const newProvider = e.target.value;
        const config = await storage/* getConfig */.zj();
        updateEnhancementUI(newProvider, config);
    });
}

;// ./src/version.ts
// src/version.ts
// Runtime version information for the userscript UI.
// Auto-synced by scripts/update-versions.js — do not edit manually.
const VERSION_INFO = {
    SEMANTIC: "6.3.1",
    DISPLAY: "v6.3.1",
    BUILD_ENV: "production",
    BUILD_DATE: "2026-07-03",
    GREASYFORK: "6.3.1",
    NPM: "6.3.1",
    BADGE: "6.3.1",
    CHANGELOG: "6.3.1",
};
const VERSION = VERSION_INFO.SEMANTIC;
if (typeof window !== "undefined") {
    window.WTR_VERSION = VERSION;
    window.WTR_VERSION_INFO = VERSION_INFO;
}

;// ./src/components/configPanelTemplate.ts
// --- PUBLIC FUNCTIONS ---

/**
 * Gets the complete HTML template for the configuration panel
 */
function getConfigPanelHTML() {
    return `
        <div class="nig-modal-content" role="dialog" aria-modal="true" aria-labelledby="nig-config-title">
            <button type="button" class="nig-close-btn" aria-label="Close configuration dialog">&times;</button>
            <h2 id="nig-config-title">
                Image Generator Configuration
                <span
                    class="nig-version-badge"
                    title="Build ${VERSION_INFO.BUILD_DATE} (${VERSION_INFO.BUILD_ENV})"
                    aria-label="Version ${VERSION_INFO.DISPLAY}, built ${VERSION_INFO.BUILD_DATE} (${VERSION_INFO.BUILD_ENV})"
                >${VERSION_INFO.DISPLAY}</span>
            </h2>
            <div class="nig-tabs" role="tablist" aria-label="Configuration sections">
                <button type="button" class="nig-tab active" data-tab="config" role="tab" id="nig-tab-config" aria-selected="true" aria-controls="nig-config-tab" tabindex="0">Configuration</button>
                <button type="button" class="nig-tab" data-tab="styling" role="tab" id="nig-tab-styling" aria-selected="false" aria-controls="nig-styling-tab" tabindex="-1">Prompt Styling</button>
                <button type="button" class="nig-tab" data-tab="history" role="tab" id="nig-tab-history" aria-selected="false" aria-controls="nig-history-tab" tabindex="-1">History</button>
                <button type="button" class="nig-tab" data-tab="utilities" role="tab" id="nig-tab-utilities" aria-selected="false" aria-controls="nig-utilities-tab" tabindex="-1">Utilities</button>
            </div>
            <div id="nig-config-tab" class="nig-tab-content active" role="tabpanel" aria-labelledby="nig-tab-config" tabindex="0">
                <div class="nig-config-grid">
                    <div class="nig-config-section">
                        <div class="nig-form-group">
                            <label for="nig-provider">Image Provider</label>
                            <select id="nig-provider">
                                <option value="Pollinations">Pollinations.ai (Free, Simple)</option>
                                <option value="AIHorde">AI Horde (Free, Advanced)</option>
                                <option value="OpenAICompat">OpenAI Compatible (Custom)</option>
                            </select>
                        </div>
                    </div>

                    <div class="nig-provider-container">
                        <div id="nig-provider-Pollinations" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://raw.githubusercontent.com/pollinations/pollinations/eea264f608e9393e69631eea5e00e9ecf6e1836e/shared/assets/logo.svg" alt="Pollinations" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> Pollinations.ai Settings</h3>
                                <p>Fast, simple image generation with advanced model options</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-model">Model</label>
                                <select id="nig-pollinations-model">
                                    <option>Loading models...</option>
                                </select>
                            </div>
                            <div class="nig-form-group nig-form-group-inline">
                                <label>Dimensions (Width × Height)</label>
                                <div>
                                    <label for="nig-pollinations-width">Width</label>
                                    <input type="number" id="nig-pollinations-width" min="64" max="2048" step="64">
                                </div>
                                <div>
                                    <label for="nig-pollinations-height">Height</label>
                                    <input type="number" id="nig-pollinations-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-seed">Seed (optional)</label>
                                <input type="text" id="nig-pollinations-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Options</label>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-pollinations-enhance">Enhance Prompt</label>
                                    <label><input type="checkbox" id="nig-pollinations-safe">Safe Mode (NSFW Filter)</label>
                                    <label><input type="checkbox" id="nig-pollinations-nologo">No Logo (Registered Users)</label>
                                    <label><input type="checkbox" id="nig-pollinations-private">Private (Won't appear in feed)</label>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-pollinations-token">API Token (Optional)</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-pollinations-token" placeholder="Enter token for premium models">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-pollinations-token"
                                        aria-label="Show API token"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                                <small class="nig-hint">Get a token from <a href="https://enter.pollinations.ai" target="_blank" class="nig-api-prompt-link">enter.pollinations.ai</a> for higher rate limits and access to restricted models.</small>
                            </div>
                        </div>

                        <div id="nig-provider-AIHorde" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://stablehorde.net/assets/img/logo.png" alt="AI Horde" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> AI Horde Settings</h3>
                                <p>Community-powered generation with extensive customization</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-api-key">AI Horde API Key</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-horde-api-key" placeholder="Defaults to '0000000000'">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-horde-api-key"
                                        aria-label="Show AI Horde API key"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                                <small>Use anonymous key or get your own from <a href="https://aihorde.net/" target="_blank" class="nig-api-prompt-link">AI Horde</a> for higher priority.</small>
                            </div>
                            <div class="nig-provider-controls">
                                <div class="nig-form-group">
                                    <label for="nig-horde-model">Model</label>
                                    <select id="nig-horde-model">
                                        <option>Loading models...</option>
                                    </select>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-sampler">Sampler</label>
                                    <select id="nig-horde-sampler">
                                        <option value="k_dpmpp_2m">DPM++ 2M</option>
                                        <option value="k_euler_a">Euler A</option>
                                        <option value="k_euler">Euler</option>
                                        <option value="k_lms">LMS</option>
                                        <option value="k_heun">Heun</option>
                                        <option value="k_dpm_2">DPM 2</option>
                                        <option value="k_dpm_2_a">DPM 2 A</option>
                                        <option value="k_dpmpp_2s_a">DPM++ 2S A</option>
                                        <option value="k_dpmpp_sde">DPM++ SDE</option>
                                    </select>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-steps">Steps</label>
                                    <input type="number" id="nig-horde-steps" min="10" max="50" step="1">
                                    <small class="nig-hint">More steps = more detail, but slower.</small>
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-cfg">CFG Scale</label>
                                    <input type="number" id="nig-horde-cfg" min="1" max="20" step="0.5">
                                    <small class="nig-hint">How strictly to follow the prompt.</small>
                                </div>
                            </div>
                            <div class="nig-form-grid">
                                <div class="nig-form-group">
                                    <label for="nig-horde-width">Width</label>
                                    <input type="number" id="nig-horde-width" min="64" max="2048" step="64">
                                </div>
                                <div class="nig-form-group">
                                    <label for="nig-horde-height">Height</label>
                                    <input type="number" id="nig-horde-height" min="64" max="2048" step="64">
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-horde-seed">Seed (optional)</label>
                                <input type="text" id="nig-horde-seed" placeholder="Leave blank for random">
                            </div>
                            <div class="nig-form-group">
                                <label>Post-Processing</label>
                                <small class="nig-hint">Improves faces. Use only if generating people.</small>
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" name="nig-horde-post" value="GFPGAN">GFPGAN</label>
                                    <label><input type="checkbox" name="nig-horde-post" value="CodeFormers">CodeFormers</label>
                                </div>
                            </div>
                        </div>

                        <div id="nig-provider-OpenAICompat" class="nig-provider-settings">
                            <div class="nig-provider-header">
                                <h3><img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg" alt="OpenAI" style="height: 20px; width: 20px; vertical-align: middle; margin-right: 8px;"> OpenAI Compatible Settings</h3>
                                <p>Connect to any OpenAI-compatible API endpoint</p>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-profile-select">Saved Profiles</label>
                                <div class="nig-form-group-inline">
                                    <select id="nig-openai-compat-profile-select"></select>
                                    <button id="nig-openai-compat-delete-profile" class="nig-delete-btn">Delete</button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-base-url">Base URL</label>
                                <input type="text" id="nig-openai-compat-base-url" placeholder="e.g., https://api.example.com/v1">
                                <small class="nig-hint">For a list of free public providers, check out the <a href="https://github.com/zukixa/cool-ai-stuff" target="_blank" class="nig-api-prompt-link">cool-ai-stuff</a> repository.</small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-api-key">API Key</label>
                                <div class="nig-password-wrapper">
                                    <input type="password" id="nig-openai-compat-api-key">
                                    <button
                                        type="button"
                                        class="nig-password-toggle"
                                        data-target="nig-openai-compat-api-key"
                                        aria-label="Show OpenAI compatible API key"
                                        aria-pressed="false"
                                    >
                                        <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-openai-compat-model">Model</label>
                                <div id="nig-openai-model-container-select">
                                    <div class="nig-form-group-inline">
                                        <select id="nig-openai-compat-model" style="width: 100%;">
                                            <option>Enter URL/Key and fetch...</option>
                                        </select>
                                        <button id="nig-openai-compat-fetch-models" class="nig-fetch-models-btn">Fetch</button>
                                    </div>
                                    <small class=" nig-hint">If fetching fails or your model isn't listed, <a href="#" id="nig-openai-compat-switch-to-manual" class="nig-api-prompt-link">switch to manual input</a>.</small>
                                </div>
                                <div id="nig-openai-model-container-manual" style="display: none;">
                                    <input type="text" id="nig-openai-compat-model-manual" placeholder="e.g., gpt-image-1">
                                    <small class=" nig-hint">Manually enter the model name. <a href="#" id="nig-openai-compat-switch-to-select" class="nig-api-prompt-link">Switch back to fetched list</a>.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-styling-tab" class="nig-tab-content" role="tabpanel" aria-labelledby="nig-tab-styling" tabindex="0">
                <div class="nig-styling-container">
                    <div class="nig-styling-intro">
                        <p>Select a style to automatically add it to the beginning of every prompt. This helps maintain a consistent look across all providers.</p>
                    </div>

                    <div class="nig-style-grid">
                        <div class="nig-style-section">
                            <div class="nig-form-group">
                                <label for="nig-main-style">Main Style</label>
                                <select id="nig-main-style"></select>
                                <small id="nig-main-style-desc" class="nig-hint"></small>
                            </div>
                            <div class="nig-form-group">
                                <label for="nig-sub-style">Sub-Style</label>
                                <select id="nig-sub-style"></select>
                                <small id="nig-sub-style-desc" class="nig-hint"></small>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>
                                    <span class="material-symbols-outlined">auto_awesome</span>
                                    AI Prompt Enhancement
                                    <span class="nig-enhancement-status" id="nig-enhancement-status">
                                        <span class="nig-status-indicator" id="nig-status-indicator"></span>
                                        <span id="nig-status-text">Enhancement Disabled</span>
                                    </span>
                                </h4>
                            </div>

                            <div class="nig-enhancement-content">
                                <div class="nig-form-group">
                                    <div class="nig-checkbox-group">
                                        <label><input type="checkbox" id="nig-enhancement-enabled">Enable AI Prompt Enhancement</label>
                                    </div>
                                    <small class="nig-hint">Uses AI to automatically enhance prompts for better results. Provider enhancement takes priority when available.</small>
                                </div>

                                <div class="nig-provider-priority-info" id="nig-provider-priority-info" style="display: none;">
                                    <div class="nig-priority-header">
                                        <span class="material-symbols-outlined">priority_high</span>
                                        Provider Enhancement Active
                                    </div>
                                    <p id="nig-priority-message">Pollinations AI enhancement is enabled and will be used instead of external AI enhancement.</p>
                                    <button class="nig-override-btn" id="nig-override-provider">Force Use External AI</button>
                                </div>

                                <div class="nig-enhancement-settings disabled" id="nig-enhancement-settings">
                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-base-url">Enhancement Endpoint URL</label>
                                        <input type="text" id="nig-enhancement-base-url" placeholder="e.g., https://api.openai.com/v1 or http://127.0.0.1:11434/v1">
                                        <small class="nig-hint">Any OpenAI-compatible /chat/completions endpoint. Works with cloud (OpenAI, OpenRouter) and local (Ollama, LM Studio, vLLM) providers.</small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-api-key">Enhancement API Key (Optional)</label>
                                        <div class="nig-password-wrapper">
                                            <input type="password" id="nig-enhancement-api-key" placeholder="Leave empty for local no-auth servers">
                                            <button
                                                type="button"
                                                class="nig-password-toggle"
                                                data-target="nig-enhancement-api-key"
                                                aria-label="Show enhancement API key"
                                                aria-pressed="false"
                                            >
                                                <span class="material-symbols-outlined" aria-hidden="true">visibility_off</span>
                                            </button>
                                        </div>
                                        <small class="nig-hint">Bearer token for cloud providers. Omit for local servers without authentication.</small>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-model">Enhancement Model</label>
                                        <div id="nig-enhancement-model-container-select">
                                            <div class="nig-form-group-inline">
                                                <select id="nig-enhancement-model" style="width: 100%;">
                                                    <option value="">Enter endpoint URL and fetch...</option>
                                                </select>
                                                <button id="nig-enhancement-fetch-models" class="nig-fetch-models-btn">Fetch</button>
                                            </div>
                                            <small class="nig-hint">Model name accepted by the /chat/completions endpoint. If fetching fails or your model isn't listed, <a href="#" id="nig-enhancement-switch-to-manual" class="nig-api-prompt-link">switch to manual input</a>.</small>
                                        </div>
                                        <div id="nig-enhancement-model-container-manual" style="display: none;">
                                            <input type="text" id="nig-enhancement-model-manual" placeholder="e.g., gpt-4o-mini, llama3.1, qwen2.5-instruct">
                                            <small class="nig-hint">Manually enter the model name accepted by the /chat/completions endpoint. <a href="#" id="nig-enhancement-switch-to-select" class="nig-api-prompt-link">Switch back to fetched list</a>.</small>
                                        </div>
                                    </div>

                                    <div class="nig-form-group">
                                        <label for="nig-enhancement-template">Custom Enhancement Prompt</label>
                                        <div class="nig-enhancement-template-section">
                                            <div class="nig-form-group">
                                                <label for="nig-enhancement-template-select">Enhancement Template</label>
                                                <select id="nig-enhancement-template-select">
                                                    <optgroup label="User Presets" data-group="user-presets"></optgroup>
                                                    <optgroup label="Default Presets" data-group="default-presets">
                                                        <option value="standard">Standard Enhancement - General-purpose, balanced enhancement</option>
                                                        <option value="safety">Safety Enhancement - Safe, policy-aligned enhancement</option>
                                                        <option value="artistic">Artistic Enhancement - Emphasizes creative visual style</option>
                                                        <option value="technical">Technical Enhancement - Emphasizes realism and technical detail</option>
                                                        <option value="character">Character Enhancement - Focuses on character detail and personality</option>
                                                    </optgroup>
                                                    <option value="custom">Custom (one-off)</option>
                                                </select>
                                                <small class="nig-hint">
                                                    Select from your saved presets or the curated defaults.
                                                    "Custom (one-off)" uses the current text without saving as a preset.
                                                    Legacy preset selections remain supported and are mapped safely.
                                                </small>
                                            </div>
                                            <textarea id="nig-enhancement-template" rows="3" placeholder="Enter enhancement instructions to save as a preset or use ad-hoc."></textarea>
                                            <div class="nig-form-group-inline">
                                                <button class="nig-template-btn" id="nig-template-save-preset">Save as Preset</button>
                                                <button class="nig-template-btn nig-btn-danger" id="nig-template-delete-preset">Delete Selected User Preset</button>
                                                <button class="nig-template-btn" id="nig-template-reset">Reset to Selected Preset</button>
                                                <button class="nig-template-btn" id="nig-template-example">Load Example</button>
                                            </div>
                                            <small class="nig-hint">
                                                Saved presets appear under "User Presets" and persist via Tampermonkey storage.
                                                Default presets remain under "Default Presets" and are stable across updates.
                                                Use "Delete Selected User Preset" to remove a user-defined preset (only works for entries under User Presets).
                                            </small>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Custom Style</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-custom-style-enable">Enable Custom Style</label>
                                </div>
                                <small class="nig-hint">Overrides the Main/Sub-style dropdowns with your own text.</small>
                                <textarea id="nig-custom-style-text" placeholder="e.g., In the style of Van Gogh, oil painting, ..."></textarea>
                            </div>
                        </div>

                        <div class="nig-style-section">
                            <div class="nig-section-header">
                                <h4>Negative Prompting (Global)</h4>
                            </div>
                            <div class="nig-form-group">
                                <div class="nig-checkbox-group">
                                    <label><input type="checkbox" id="nig-enable-neg-prompt">Enable Negative Prompting</label>
                                </div>
                                <small class="nig-hint">This negative prompt will be applied to all providers when enabled.</small>
                                <textarea id="nig-global-neg-prompt" placeholder="e.g., ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="nig-history-tab" class="nig-tab-content" role="tabpanel" aria-labelledby="nig-tab-history" tabindex="0">
                <div class="nig-history-container">
                    <div class="nig-history-cleanup">
                        <div class="nig-cleanup-info">
                            <h4>History Management</h4>
                            <p>Clean up old history entries to free up space and improve performance.</p>
                        </div>
                        <div class="nig-cleanup-controls">
                            <label>Delete history older than</label>
                            <input type="number" id="nig-history-clean-days" min="1" max="365" value="30">
                            <label>days</label>
                            <button id="nig-history-clean-btn" class="nig-history-cleanup-btn">
                                <span class="material-symbols-outlined">cleaning_services</span>
                                Clean
                            </button>
                        </div>
                    </div>
                    <ul id="nig-history-list" class="nig-history-list"></ul>
                </div>
            </div>

            <div id="nig-utilities-tab" class="nig-tab-content" role="tabpanel" aria-labelledby="nig-tab-utilities" tabindex="0">
                <div class="nig-utilities-grid">
                    <div class="nig-utility-card">
                        <h4>Import/Export Settings</h4>
                        <p>Backup and restore your configuration settings for seamless setup across different sessions or devices.</p>
                        <div class="nig-form-group">
                            <button id="nig-export-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-primary);">
                                <span class="material-symbols-outlined">download</span>
                                Download Configuration
                            </button>
                            <small class="nig-hint">Downloads the current configuration as a JSON file.</small>
                        </div>
                        <div class="nig-form-group">
                            <label for="nig-import-file">Import Configuration</label>
                            <input type="file" id="nig-import-file" accept=".json" style="border: 2px dashed var(--nig-color-border); background: var(--nig-color-bg-primary);">
                            <small class=" nig-hint">Uploading a JSON file will overwrite all current settings.</small>
                        </div>
                    </div>

                    <div class="nig-utility-card">
                        <h4>Cache Management</h4>
                        <p>Clear cached model lists and force fresh data fetching for accurate, up-to-date information.</p>
                        <button id="nig-clear-cache-btn" class="nig-save-btn" style="background-color: var(--nig-color-accent-error);">
                            <span class="material-symbols-outlined">clear_all</span>
                            Clear Cached Models
                        </button>
                        <small class="nig-hint">Removes all cached model lists forcing a fresh fetch.</small>
                    </div>

                    <div class="nig-utility-card">
                        <div class="nig-card-header">
                            <div class="nig-card-title">
                                <h4>Debug Console & Logs</h4>
                                <p>Enable detailed console logging and view enhancement operation logs to troubleshoot issues and monitor system behavior during development.</p>
                            </div>
                        </div>

                        <div class="nig-card-actions">
                            <button id="nig-toggle-logging-btn" class="nig-btn-primary">
                                <span class="material-symbols-outlined">bug_report</span>
                                Toggle Console Logging & Enhancement Logs
                            </button>
                        </div>

                        <div class="nig-card-secondary-actions">
                            <button id="nig-view-enhancement-logs-btn" class="nig-btn-secondary">
                                <span class="material-symbols-outlined">list</span>
                                View Enhancement Logs
                            </button>
                            <button id="nig-clear-enhancement-logs-btn" class="nig-btn-secondary nig-btn-error">
                                <span class="material-symbols-outlined">clear_all</span>
                                Clear Logs
                            </button>
                        </div>

                        <div class="nig-card-footer">
                            <small class="nig-hint">Toggles detailed console logging and provides access to enhancement operation logs.</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="nig-button-footer">
                <button id="nig-save-btn" class="nig-save-btn">Save Configuration</button>
            </div>
        </div>
    `;
}
/**
 * Creates the panel element with the template
 */
function createPanelElement() {
    const panelElement = document.createElement("div");
    panelElement.id = "nig-config-panel";
    panelElement.className = "nig-modal-overlay";
    panelElement.style.display = "none";
    panelElement.innerHTML = getConfigPanelHTML();
    return panelElement;
}

;// ./src/components/configPanel.ts
// --- IMPORTS ---








// --- MODULE STATE ---
let panelElement = null;
let initializeCallbacks = {};
let panelA11yCleanup = null;
// --- EXPORTED FUNCTIONS ---
/**
 * Creates the config panel DOM element and attaches all its internal event listeners.
 */
function configPanel_create() {
    if (panelElement) {
        return;
    }
    // Create the panel using the template module
    panelElement = createPanelElement();
    document.body.appendChild(panelElement);
    // --- ATTACH ALL EVENT LISTENERS ---
    // Basic panel functionality
    panelElement
        .querySelector(".nig-close-btn")
        .addEventListener("click", () => {
        if (panelA11yCleanup) {
            panelA11yCleanup();
            panelA11yCleanup = null;
        }
        panelElement.style.display = "none";
    });
    panelElement
        .querySelector("#nig-save-btn")
        .addEventListener("click", configPanel_saveConfig);
    // Set up all event listener groups
    setupTabEventListeners(panelElement);
    setupProviderEventListeners(panelElement);
    setupOpenAIEventListeners(panelElement);
    setupUtilityEventListeners(panelElement);
    setupLoggingEventListeners(panelElement);
    setupStyleEventListeners(panelElement);
    setupCustomStyleEventListeners(panelElement);
    setupProviderEnhancementListener(panelElement);
    // Set up enhancement event listeners
    setupEnhancementEventListeners(panelElement);
}
/**
 * Shows the config panel, populating it with the latest data from storage.
 */
async function configPanel_show() {
    if (!panelElement) {
        configPanel_create();
    }
    // Reset to the main config tab
    panelElement
        .querySelectorAll(".nig-tab, .nig-tab-content")
        .forEach((el) => el.classList.remove("active"));
    panelElement
        .querySelector('.nig-tab[data-tab="config"]')
        .classList.add("active");
    panelElement.querySelector("#nig-config-tab").classList.add("active");
    panelElement.querySelector("#nig-save-btn").style.display = "block";
    // Reveal the modal immediately so it stays visible even if form population
    // below throws (e.g. a provider model fetch failure). Previously the panel
    // was only displayed after all async population completed, so any thrown
    // error left the modal permanently hidden.
    panelElement.style.display = "flex";
    // Populate all form sections. Wrapped so a failure in any section does not
    // hide the modal — the user still gets a visible (possibly partially
    // populated) panel instead of a silently broken open action.
    try {
        const config = await storage/* getConfig */.zj();
        // Populate basic configuration
        await populateConfigForm();
        // Populate provider-specific forms
        await (0,models.populateProviderForms)(config);
        // Populate enhancement settings
        await populateEnhancementSettings(config);
    }
    catch (error) {
        logger/* logError */.vV("CONFIG_PANEL", "Failed to populate configuration panel", {
            error: error.message,
        });
        (0,uiUtils/* showToast */.P0)("Some settings could not be loaded. Check the console for details.", "error");
    }
    // Set up modal accessibility (focus trap, Escape, scroll lock, focus management).
    // Guard against the user closing the panel while async population was running:
    // if the panel is no longer visible, skip a11y setup so we don't lock scroll
    // with no visible modal to close.
    if (panelElement.style.display === "none") {
        return;
    }
    if (panelA11yCleanup) {
        panelA11yCleanup();
    }
    panelA11yCleanup = (0,uiUtils/* setupModalA11y */.nI)(panelElement, {
        labelledBy: "nig-config-title",
        closeOnEscape: true,
        onClose: () => {
            panelElement.style.display = "none";
            if (panelA11yCleanup) {
                panelA11yCleanup();
                panelA11yCleanup = null;
            }
        },
    });
}
/**
 * Initializes the config panel with callbacks from the main application.
 */
function initialize(callbacks = {}) {
    initializeCallbacks = callbacks;
}
/**
 * Enhanced save configuration that coordinates saving across all modules
 */
async function configPanel_saveConfig() {
    // Save basic configuration
    await saveConfig();
    // Save enhancement configuration
    await saveEnhancementConfig();
    // Save provider-specific configurations
    await (0,models/* saveProviderConfigs */.Yl)();
    // Trigger any initialization callbacks
    if (initializeCallbacks.onConfigSaved) {
        initializeCallbacks.onConfigSaved();
    }
    (0,uiUtils/* showToast */.P0)("Configuration saved!", "success");
}

;// ./src/index.ts
// Import styles

// Import utility modules




// Import API modules




// Import Component modules






(function () {
    "use strict";
    // --- STATE MANAGEMENT ---
    const generationQueue = [];
    const completedQueue = [];
    const errorQueue = [];
    let isGenerating = false;
    let currentGenerationStatusText = "";
    let enhancementInFlightCount = 0;
    let isErrorModalVisible = false;
    let currentSelection = "";
    let generateBtn;
    // --- CORE LOGIC ---
    function handleGenerationSuccess(displayUrls, prompt, provider, model, persistentUrls = null) {
        logger/* logInfo */.fH("GENERATION", "Generation completed successfully", {
            provider,
            model,
            promptLength: prompt.length,
            promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
            imagesGenerated: displayUrls.length,
            hasPersistentUrls: Boolean(persistentUrls),
        });
        completedQueue.push({ imageUrls: displayUrls, prompt, provider, model });
        // Defensive guard: only honor persistentUrls when every entry is a data:
        // URL (actual image content). This prevents non-image API endpoints from
        // overriding valid display URLs in history — the root cause of the
        // Pollinations history 404 bug where the POST endpoint URL was stored
        // instead of the generated image.
        const safePersistentUrls = persistentUrls &&
            persistentUrls.every((u) => typeof u === "string" && u.startsWith("data:"))
            ? persistentUrls
            : null;
        const historyUrls = safePersistentUrls || displayUrls;
        historyUrls.forEach((url) => storage/* addToHistory */.Pc({
            date: new Date().toISOString(),
            prompt,
            url,
            provider,
            model,
        }));
        isGenerating = false;
        updateSystemStatus();
        processQueue();
    }
    function handleGenerationFailure(errorMessage, prompt = "Unknown", provider, providerProfileUrl = null, errorMetadata = null) {
        logger/* logError */.vV("GENERATION", `Generation Failed`, {
            prompt,
            provider,
            errorMessage,
            errorMetadata,
        });
        // If error metadata is provided (e.g., from OpenAI provider), use it to enhance error parsing
        const friendlyError = parseErrorMessage(errorMessage, provider, providerProfileUrl);
        // If metadata provides explicit error type and retryability, use that
        if (errorMetadata) {
            if (errorMetadata.errorType) {
                friendlyError.errorType = errorMetadata.errorType;
            }
            if (typeof errorMetadata.isNonRetryable === "boolean") {
                friendlyError.retryable = !errorMetadata.isNonRetryable;
                friendlyError.isNonRetryable = errorMetadata.isNonRetryable;
            }
        }
        errorQueue.push({
            reason: friendlyError,
            prompt,
            provider,
            providerProfileUrl,
        });
        showNextError();
        // Don't auto-continue queue - wait for user action
        statusWidget_update("error", "Generation Failed.");
        isGenerating = false;
        // Update status but don't auto-process queue
        updateSystemStatus();
        logger/* logInfo */.fH("GENERATION", "Generation failed - waiting for user action", {
            errorQueueLength: errorQueue.length,
            generationQueueLength: generationQueue.length,
            willWaitForUser: true,
            errorType: friendlyError.errorType || "unknown",
            isNonRetryable: friendlyError.isNonRetryable || false,
        });
    }
    function showNextError() {
        if (isErrorModalVisible || errorQueue.length === 0) {
            return;
        }
        const errorToShow = errorQueue.shift();
        isErrorModalVisible = true;
        show(errorToShow);
        logger/* logInfo */.fH("ERROR", "Showing error modal to user", {
            errorReason: errorToShow.reason.message,
            provider: errorToShow.provider,
            remainingErrorQueue: errorQueue.length,
        });
        // The error modal will hide itself, we don't need to manage its closing state here
    }
    function handleErrorModalDismiss() {
        logger/* logInfo */.fH("ERROR", "Error modal dismissed by user", {
            errorQueueLength: errorQueue.length,
            generationQueueLength: generationQueue.length,
            isGenerating,
        });
        isErrorModalVisible = false;
        updateSystemStatus();
        // Resume queue processing if there are more items
        if (generationQueue.length > 0 && !isGenerating) {
            logger/* logInfo */.fH("ERROR", "Resuming queue processing after error modal dismissal");
            processQueue();
        }
        else {
            logger/* logInfo */.fH("ERROR", "No more items to process, queue paused");
        }
    }
    function retryGeneration(basePositivePrompt, provider, providerProfileUrl = null) {
        const queueEntry = {
            basePositivePrompt,
            provider,
            providerProfileUrl,
        };
        generationQueue.unshift(queueEntry);
        logger/* logInfo */.fH("GENERATION", "Added retry generation to queue (LIFO - Priority)", {
            provider,
            basePositivePromptLength: basePositivePrompt.length,
            queueLength: generationQueue.length,
            queuePosition: 1,
            basePositivePromptPreview: basePositivePrompt.substring(0, 100) +
                (basePositivePrompt.length > 100 ? "..." : ""),
        });
        isGenerating = false;
        hide();
        isErrorModalVisible = false;
        updateSystemStatus();
        processQueue();
        showNextError(); // Check if there are other errors in the queue
    }
    function addToGenerationQueue(basePositivePrompt, provider, providerProfileUrl = null) {
        generationQueue.push({
            basePositivePrompt,
            provider,
            providerProfileUrl,
        });
        logger/* logInfo */.fH("GENERATION", "Added generation to queue (FIFO)", {
            provider,
            basePositivePromptLength: basePositivePrompt.length,
            queueLength: generationQueue.length,
            queuePosition: generationQueue.length,
            basePositivePromptPreview: basePositivePrompt.substring(0, 100) +
                (basePositivePrompt.length > 100 ? "..." : ""),
        });
        updateSystemStatus();
        if (!isGenerating) {
            processQueue();
        }
    }
    function cancelGeneration() {
        logger/* logInfo */.fH("GENERATION", "User cancelled generation", {
            generationQueueLength: generationQueue.length,
            isGenerating,
            enhancementInFlightCount,
        });
        generationQueue.length = 0;
        abortAll();
        isGenerating = false;
        enhancementInFlightCount = 0;
        currentGenerationStatusText = "";
        updateSystemStatus();
    }
    function updateSystemStatus() {
        logger/* logDebug */.MD("SYSTEM", "Updating system status", {
            completedQueueLength: completedQueue.length,
            isGenerating,
            generationQueueLength: generationQueue.length,
            currentStatusText: currentGenerationStatusText,
        });
        if (completedQueue.length > 0) {
            const text = completedQueue.length === 1
                ? "1 Image Ready!"
                : `${completedQueue.length} Images Ready!`;
            statusWidget_update("success", `${text} Click to view.`, () => {
                const result = completedQueue.shift();
                if (result) {
                    // Ensure viewer sees the exact main prompt string sent to provider:
                    // - For AI Horde: positive-only prompt.
                    // - For others: fully concatenated prompt with inline negative when applicable.
                    imageViewer.show(result.imageUrls, result.prompt, result.provider, result.model);
                }
                updateSystemStatus();
            });
        }
        else if (isGenerating || generationQueue.length > 0) {
            // Only show queue indicator if there are items actually waiting (generationQueue.length > 0)
            // This prevents showing "Queue: 1" when only the current item is being processed
            const queueText = generationQueue.length > 0 ? ` (Queue: ${generationQueue.length})` : "";
            statusWidget_update("loading", `${currentGenerationStatusText}${queueText}`, null, cancelGeneration);
        }
        else {
            statusWidget_update("hidden", "");
        }
    }
    async function processQueue() {
        if (isGenerating || generationQueue.length === 0) {
            logger/* logDebug */.MD("QUEUE", "Queue processing skipped", {
                reason: isGenerating ? "Currently generating" : "Queue is empty",
                isGenerating,
                queueLength: generationQueue.length,
            });
            return;
        }
        isGenerating = true;
        const request = generationQueue.shift();
        currentGenerationStatusText = "Requesting...";
        const provider = request.provider;
        const basePositivePrompt = request.basePositivePrompt;
        const apiPrompt = getApiReadyPrompt(basePositivePrompt, "queue_dispatch");
        const displayPrompt = basePositivePrompt;
        logger/* logInfo */.fH("QUEUE", "Starting queue processing", {
            provider,
            basePositivePromptLength: basePositivePrompt.length,
            basePositivePromptPreview: basePositivePrompt.substring(0, 100) +
                (basePositivePrompt.length > 100 ? "..." : ""),
            remainingQueueLength: generationQueue.length,
            currentStatus: currentGenerationStatusText,
        });
        updateSystemStatus();
        const callbacks = {
            onSuccess: handleGenerationSuccess,
            onFailure: handleGenerationFailure,
            onAuthFailure: (msg, p) => {
                logger/* logInfo */.fH("AUTH", "Authentication required", {
                    provider: p,
                    message: msg,
                });
                pollinationsAuthPrompt_show(msg, p, retryGeneration);
                isGenerating = false;
                // Don't auto-resume - wait for user action
                statusWidget_update("error", "Authentication needed.");
                updateSystemStatus();
                logger/* logInfo */.fH("AUTH", "Queue paused due to authentication requirement", {
                    generationQueueLength: generationQueue.length,
                    willWaitForUser: true,
                });
            },
            updateStatus: (text) => {
                currentGenerationStatusText = text;
                logger/* logDebug */.MD("SYSTEM", "Status updated by provider", {
                    provider: request.provider,
                    newStatusText: text,
                    isGenerating,
                    generationQueueLength: generationQueue.length,
                });
                updateSystemStatus();
            },
        };
        // Provider-specific final/negative prompt handling
        switch (provider) {
            case "AIHorde": {
                // For AI Horde:
                // - apiPrompt is strictly the positive prompt (StyledPrompt or EnhancedPrompt)
                // - api/aiHorde.ts appends negative prompts with AI Horde's documented
                //   ### separator when the global negative prompt is enabled.
                logger/* logInfo */.fH("QUEUE", "Using AI Horde prompt construction path", {
                    provider: "AIHorde",
                    positivePromptLength: apiPrompt.length,
                    positivePromptPreview: apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
                });
                logger/* logDebug */.MD("QUEUE", "Dispatching to AIHorde provider with positive-only prompt", {
                    provider: "AIHorde",
                    prompt: apiPrompt.substring(0, 200) +
                        (apiPrompt.length > 200 ? "..." : ""),
                });
                aiHorde_generate(apiPrompt, callbacks);
                break;
            }
            case "Pollinations":
            case "OpenAICompat": {
                // Provider modules now own provider-specific negative prompt handling:
                // - Pollinations sends negative_prompt as a query parameter.
                // - OpenAI-compatible retains inline negative prompting.
                const useCase = provider === "Pollinations"
                    ? "pollinations_negative_prompt_query"
                    : "openai_compat_inline_negative";
                logger/* logInfo */.fH("QUEUE", "Using non-AI Horde prompt construction path", {
                    provider,
                    basePositivePromptLength: apiPrompt.length,
                    basePositivePromptPreview: apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
                });
                if (provider === "Pollinations") {
                    logger/* logDebug */.MD("QUEUE", "Dispatching to Pollinations provider", {
                        prompt: apiPrompt.substring(0, 200) +
                            (apiPrompt.length > 200 ? "..." : ""),
                        path: useCase,
                    });
                    generate(apiPrompt, callbacks);
                }
                else {
                    logger/* logDebug */.MD("QUEUE", "Dispatching to OpenAICompat provider", {
                        prompt: apiPrompt.substring(0, 200) +
                            (apiPrompt.length > 200 ? "..." : ""),
                        providerProfileUrl: request.providerProfileUrl,
                        path: useCase,
                    });
                    openAI_generate(apiPrompt, request.providerProfileUrl, callbacks);
                }
                break;
            }
            default:
                handleGenerationFailure(`Unknown provider: ${provider}`, displayPrompt, "System");
        }
    }
    // --- EVENT HANDLERS & UI TRIGGERS ---
    async function onGenerateClick() {
        generateBtn.style.display = "none";
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        if (!currentSelection) {
            logger/* logWarn */.JE("GENERATION", "No text selected for generation");
            return;
        }
        logger/* logInfo */.fH("GENERATION", "User initiated image generation", {
            selectionLength: currentSelection.length,
            selectionPreview: currentSelection.substring(0, 100) +
                (currentSelection.length > 100 ? "..." : ""),
        });
        const config = await storage/* getConfig */.zj();
        let finalPrompt = currentSelection;
        let prefix = "";
        // StyledPrompt = StylePrefix + SelectedText
        if (config.customStyleEnabled && config.customStyleText) {
            prefix = config.customStyleText.trim();
            if (prefix && !prefix.endsWith(", ")) {
                prefix += ", ";
            }
        }
        else if (config.mainPromptStyle !== "None") {
            prefix =
                config.subPromptStyle && config.subPromptStyle !== "none"
                    ? config.subPromptStyle
                    : `${config.mainPromptStyle} style, `;
        }
        finalPrompt = prefix + finalPrompt;
        // If AI Enhancement is enabled and used, it operates on StyledPrompt and becomes EnhancedPrompt.
        if (config.enhancementEnabled) {
            const shouldUseProviderEnh = shouldUseProviderEnhancement(config.selectedProvider, config);
            const hasEndpoint = (config.enhancementBaseUrl || "").trim().length > 0;
            const hasModel = (config.enhancementModel || "").trim().length > 0;
            const shouldUseExternalEnhancement = (!shouldUseProviderEnh || config.enhancementOverrideProvider) &&
                hasEndpoint &&
                hasModel;
            if (shouldUseExternalEnhancement) {
                enhancementInFlightCount++;
                const tokenBeforeEnhancement = getCancelToken();
                const startQueueText = enhancementInFlightCount > 1
                    ? ` (Queue: ${enhancementInFlightCount})`
                    : "";
                statusWidget_update("loading", `Enhancing prompt...${startQueueText}`);
                try {
                    // Clean prompt for enhancement API call
                    // IMPORTANT: Enhancement must ONLY see the positive prompt (style + user text), never global negatives
                    const cleanPromptForEnhancement = getApiReadyPrompt(finalPrompt, "enhancement_positive_only");
                    finalPrompt = await enhancePrompt(cleanPromptForEnhancement, config);
                    enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
                    if (getCancelToken() !== tokenBeforeEnhancement) {
                        return;
                    }
                    const successQueueText = enhancementInFlightCount > 0
                        ? ` (Queue: ${enhancementInFlightCount})`
                        : "";
                    statusWidget_update("success", `Prompt enhanced!${successQueueText}`);
                    setTimeout(() => updateSystemStatus(), 2000);
                }
                catch (error) {
                    enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
                    if (getCancelToken() !== tokenBeforeEnhancement) {
                        return;
                    }
                    const errorQueueText = enhancementInFlightCount > 0
                        ? ` (Queue: ${enhancementInFlightCount})`
                        : "";
                    // External enhancement failure is expected to gracefully fall back.
                    // Log as non-critical ENHANCEMENT info so it respects the logging toggle.
                    logger/* logInfo */.fH("ENHANCEMENT", "External AI enhancement failed, falling back to original", { error: error.message });
                    statusWidget_update("error", `Enhancement failed, using original prompt${errorQueueText}`);
                    setTimeout(() => updateSystemStatus(), 3000);
                }
            }
        }
        // NOTE (Objective 4):
        // Global negative prompt is applied ONLY at provider dispatch time for providers that explicitly support it.
        // Do NOT concatenate globalNegPrompt into finalPrompt here.
        logger/* logInfo */.fH("GENERATION", "Prompt preparation completed, adding to queue", {
            provider: config.selectedProvider,
            basePositivePromptLength: finalPrompt.length,
            basePositivePromptPreview: finalPrompt.substring(0, 200) +
                (finalPrompt.length > 200 ? "..." : ""),
            queueSystem: "FIFO",
        });
        // finalPrompt is now StyledPrompt or EnhancedPrompt (positive-only).
        // Provider-specific negative behavior is applied later at dispatch/API modules.
        addToGenerationQueue(finalPrompt, config.selectedProvider, config.openAICompatActiveProfileUrl);
    }
    function handleSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            if (generateBtn) {
                generateBtn.style.display = "none";
            }
            return;
        }
        const selectedText = selection.toString().trim();
        if (selectedText.length > 5) {
            currentSelection = selectedText;
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();
            if (rects.length === 0) {
                generateBtn.style.display = "none";
                return;
            }
            const firstRect = rects[0];
            generateBtn.style.display = "inline-flex";
            const buttonHeight = generateBtn.offsetHeight || 30;
            let topPosition = window.scrollY + firstRect.top - buttonHeight - 5;
            if (topPosition < window.scrollY) {
                const lastRect = rects[rects.length - 1];
                topPosition = window.scrollY + lastRect.bottom + 5;
            }
            generateBtn.style.top = `${topPosition}px`;
            generateBtn.style.left = `${window.scrollX + firstRect.left}px`;
        }
        else {
            if (generateBtn) {
                generateBtn.style.display = "none";
            }
        }
    }
    // --- INITIALIZATION ---
    async function init() {
        await logger/* updateLoggingStatus */.RJ();
        // Clean old history entries on startup to maintain data integrity
        try {
            const removedCount = await storage/* cleanOldHistory */.j5();
            if (removedCount > 0) {
                logger/* logInfo */.fH("INIT", `Cleaned ${removedCount} old history entries on startup`);
            }
        }
        catch (error) {
            logger/* logError */.vV("INIT", "Failed to clean old history entries on startup", { error: error.message });
        }
        // Create the main UI button
        const materialSymbolsLink = document.createElement("link");
        materialSymbolsLink.rel = "stylesheet";
        materialSymbolsLink.href =
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
        document.head.appendChild(materialSymbolsLink);
        generateBtn = document.createElement("button");
        generateBtn.className = "nig-button";
        generateBtn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg><span>Generate Image</span>';
        generateBtn.setAttribute("aria-label", "Generate image from selected text");
        generateBtn.addEventListener("click", onGenerateClick);
        document.body.appendChild(generateBtn);
        // Create and initialize all components
        create();
        imageViewer/* create */.v();
        errorModal_create();
        configPanel_create();
        // Inject an "AI Image" launcher directly into the site's bottom reader
        // navigation bar (the Read / Display / Speech / Settings / More tab
        // strip) instead of a standalone floating widget. This keeps the entry
        // point inside the host UI where it belongs. The site is a SPA that
        // re-renders the nav on route changes, so a MutationObserver re-injects
        // the tab whenever the nav reappears without it.
        function injectSettingsTab() {
            const nav = document.querySelector("nav.bottom-reader-nav");
            if (!nav || nav.querySelector(".nig-reader-tab")) {
                return;
            }
            // Locate the tab strip via the "More" tab so the launcher inserts
            // beside the site's own Settings tab. Falls back to the first
            // button's parent (the tab strip) if labels differ.
            const buttons = nav.querySelectorAll("button");
            let moreTab = null;
            for (const btn of buttons) {
                if (/^more$/i.test(btn.textContent.trim())) {
                    moreTab = btn;
                    break;
                }
            }
            const tabBar = (moreTab ?? nav.querySelector("button"))?.parentElement;
            if (!tabBar) {
                return;
            }
            const tab = document.createElement("button");
            tab.type = "button";
            tab.className =
                "nig-reader-tab relative flex-1 flex flex-col items-center justify-center pt-1.5 pb-2 gap-0.5 transition-colors border-l border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/30";
            tab.title = "Image Generator Settings";
            tab.setAttribute("aria-label", "Open Image Generator settings");
            tab.innerHTML =
                '<span class="absolute top-0 inset-x-0 h-0.5 transition-colors bg-transparent"></span>' +
                    '<span class="[&>svg]:w-4 [&>svg]:h-4">' +
                    '<svg class="icon inline-flex shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>' +
                    "</span>" +
                    '<span class="text-[10px] font-medium leading-none">AI Image</span>';
            tab.addEventListener("click", () => configPanel_show());
            // Insert before the "More" tab so the launcher sits beside Settings.
            if (moreTab) {
                tabBar.insertBefore(tab, moreTab);
            }
            else {
                tabBar.appendChild(tab);
            }
        }
        let tabInjectScheduled = false;
        const tabObserver = new MutationObserver(() => {
            if (tabInjectScheduled) {
                return;
            }
            tabInjectScheduled = true;
            requestAnimationFrame(() => {
                tabInjectScheduled = false;
                injectSettingsTab();
            });
        });
        tabObserver.observe(document.body, { childList: true, subtree: true });
        injectSettingsTab();
        errorModal_init({
            onRetry: retryGeneration,
            onDismiss: handleErrorModalDismiss,
        });
        // Register global event listeners
        document.addEventListener("mouseup", handleSelection);
        document.addEventListener("selectionchange", handleSelection);
        GM_registerMenuCommand("Image Generator Settings", configPanel_show);
        logger/* logInfo */.fH("INIT", "WTR LAB Novel Image Generator initialized successfully", {
            config: await storage/* getConfig */.zj(),
        });
    }
    init();
})();

/******/ })()
;