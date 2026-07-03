// src/version.ts
// Runtime version information for the userscript UI.
// Auto-synced by scripts/update-versions.js — do not edit manually.

interface RuntimeVersionInfo {
  SEMANTIC: string;
  DISPLAY: string;
  BUILD_ENV: string;
  BUILD_DATE: string;
  GREASYFORK: string;
  NPM: string;
  BADGE: string;
  CHANGELOG: string;
}

export const VERSION_INFO: RuntimeVersionInfo = {
  SEMANTIC: "6.3.0",
  DISPLAY: "v6.3.0",
  BUILD_ENV: "production",
  BUILD_DATE: "2026-07-03",
  GREASYFORK: "6.3.0",
  NPM: "6.3.0",
  BADGE: "6.3.0",
  CHANGELOG: "6.3.0",
};

export const VERSION = VERSION_INFO.SEMANTIC;

if (typeof window !== "undefined") {
  window.WTR_VERSION = VERSION;
  window.WTR_VERSION_INFO = VERSION_INFO;
}
