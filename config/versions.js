// config/versions.js
// Centralized version management for WTR LAB Novel Image Generator
// Authoritative version source per PROJECT_WORKSPACE_GUIDE.md

const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * Resolve the base semantic version from environment or default package.json version.
 * This function:
 * - Prefers WTR_VERSION if valid semver
 * - Falls back to package.json version if valid
 * - Throws a clear error if neither is valid
 */
function resolveSemanticVersion() {
  const envVersion = process.env.WTR_VERSION || process.env.APP_VERSION;

  if (envVersion && SEMVER_REGEX.test(envVersion)) {
    return envVersion;
  }

  // Lazy load to avoid issues when this file is bundled
  // Only evaluated in Node build tooling environments.
  let pkgVersion = null;
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const pkg = require("../package.json");
    if (pkg && typeof pkg.version === "string" && SEMVER_REGEX.test(pkg.version)) {
      pkgVersion = pkg.version;
    }
  } catch (error) {
    // Swallow and handle below with a clear error
  }

  if (!pkgVersion) {
    throw new Error(
      "[versions] Unable to resolve a valid semantic version. " +
        "Set WTR_VERSION or ensure package.json contains a valid semver version."
    );
  }

  return pkgVersion;
}

/**
 * Build metadata with environment overrides.
 * - WTR_BUILD_ENV / NODE_ENV
 * - WTR_BUILD_DATE
 */
function createVersionInfo() {
  const semantic = resolveSemanticVersion();

  const buildEnv =
    process.env.WTR_BUILD_ENV ||
    process.env.BUILD_ENV ||
    process.env.NODE_ENV ||
    "production";

  const buildDate =
    process.env.WTR_BUILD_DATE ||
    process.env.BUILD_DATE ||
    new Date().toISOString().split("T")[0];

  return {
    SEMANTIC: semantic,
    DISPLAY: `v${semantic}`,
    BUILD_ENV: buildEnv,
    BUILD_DATE: buildDate,
    GREASYFORK: semantic,
    NPM: semantic,
    BADGE: semantic,
    CHANGELOG: semantic,
  };
}

const VERSION_INFO = createVersionInfo();

/**
 * Small helper API for build scripts and, if desired, runtime.
 * Note: When consumed in bundled browser code, process.env use should be
 * inlined during build; do not rely on requiring package.json there.
 */
class VersionManager {
  constructor(info) {
    this.info = info;
  }

  getSemanticVersion() {
    return this.info.SEMANTIC;
  }

  getDisplayVersion() {
    return this.info.DISPLAY;
  }

  getBuildMetadata() {
    return {
      buildDate: this.info.BUILD_DATE,
      buildEnv: this.info.BUILD_ENV,
    };
  }

  getBadgeVersion() {
    return this.info.BADGE;
  }

  getGreasyForkVersion() {
    return this.info.GREASYFORK;
  }

  asBanner() {
    return `WTR LAB Novel Image Generator ${this.getDisplayVersion()} | ` +
      `Env: ${this.info.BUILD_ENV} | Built: ${this.info.BUILD_DATE}`;
  }
}

const versionManager = new VersionManager(VERSION_INFO);

module.exports = {
  VERSION_INFO,
  versionManager,
};