// scripts/update-versions.js
// Centralized version propagation helper for WTR LAB Novel Image Generator
// Uses config/versions.js as the single source of truth.
//
// Responsibilities:
// - Keep package.json version in sync with VERSION_INFO.SEMANTIC
// - Update README.md and GreasyForkREADME.md version badges/titles/footer
// - Provide introspection helpers (version, banner, header)
// - Fail fast with clear errors for CI and local workflows

const fs = require("fs");
const path = require("path");
const { VERSION_INFO } = require("../config/versions.js");

function ensureVersionInfo() {
  if (!VERSION_INFO || !VERSION_INFO.SEMANTIC) {
    const message =
      "[version:update] VERSION_INFO.SEMANTIC is missing or invalid. " +
      "Ensure config/versions.js is correctly configured or WTR_VERSION is set.";
    console.error(message);
    throw new Error(message);
  }
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`[version:update] Failed to read ${filePath}: ${error.message}`);
    throw error;
  }
}

function writeFileSafe(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
  } catch (error) {
    console.error(`[version:update] Failed to write ${filePath}: ${error.message}`);
    throw error;
  }
}

function readJson(filePath) {
  const raw = readFileSafe(filePath);
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[version:update] Failed to parse JSON in ${filePath}: ${error.message}`);
    throw error;
  }
}

function writeJson(filePath, data) {
  writeFileSafe(filePath, JSON.stringify(data, null, 2) + "\n");
}

// --- package.json sync ---

function updatePackageJsonVersion() {
  const packagePath = path.join(process.cwd(), "package.json");
  const pkg = readJson(packagePath);

  if (pkg.version !== VERSION_INFO.SEMANTIC) {
    pkg.version = VERSION_INFO.SEMANTIC;
    writeJson(packagePath, pkg);
    console.log(`[version:update] Updated package.json version -> ${pkg.version}`);
  } else {
    console.log("[version:update] package.json version already up-to-date.");
  }
}

// --- README.md sync ---

function updateReadme() {
  const readmePath = path.join(process.cwd(), "README.md");
  let content = readFileSafe(readmePath);

  const semantic = VERSION_INFO.SEMANTIC;
  const display = VERSION_INFO.DISPLAY || `v${semantic}`;
  const buildDate = VERSION_INFO.BUILD_DATE;

  // 1) Update main title version e.g. "(v6.0.4)" -> "(vX.Y.Z)"
  content = content.replace(
    /(#\s*🚀\s*WTR LAB Novel Image Generator[^\n]*?\()(v?\d+\.\d+\.\d+)(\))/,
    `$1${display}$3`
  );

  // 2) Update ONLY the Version badge in header (do not touch historical "Latest:" lines)
  content = content.replace(
    /(Version\]\(https:\/\/img\.shields\.io\/badge\/version-)(\d+\.\d+\.\d+)(-blue\.svg\)\])/,
    `$1${semantic}$3`
  );

  // 3) Update the footer-style "Last Updated / Current Version" line if present.
  // Example:
  // _Last Updated: November 08, 2025_ | _Current Version: 6.0.2_ (Known Issues)
  content = content.replace(
    /(_Last Updated:\s*)([^_]+)(_ \|\s*_Current Version:\s*)(\d+\.\d+\.\d+)([^_]*)/,
    `$1${buildDate}$3${semantic}$5`
  );

  writeFileSafe(readmePath, content);
  console.log("[version:update] Updated README.md badge and footer metadata.");
}

// --- GreasyForkREADME.md sync ---

function updateGreasyForkReadme() {
  const gfPath = path.join(process.cwd(), "GreasyForkREADME.md");
  let content;
  try {
    content = readFileSafe(gfPath);
  } catch (error) {
    // File is optional; do not hard-fail CI if missing.
    console.warn("[version:update] GreasyForkREADME.md not found; skipping.");
    return;
  }

  const semantic = VERSION_INFO.GREASYFORK || VERSION_INFO.SEMANTIC;
  const buildDate = VERSION_INFO.BUILD_DATE;

  // 1) Update ONLY the GreasyFork badge version (top metadata)
  content = content.replace(
    /(Version\]\(https:\/\/img\.shields\.io\/badge\/version-)(\d+\.\d+\.\d+)(-blue\.svg\)\])/,
    `$1${semantic}$3`
  );

  // 2) Update footer-style "Last Updated / Current Version" line if present.
  // Example:
  // _Last Updated: November 08, 2025_ | _Current Version: 6.0.4_
  // This targets only that structured footer, not historical "**Latest: vX.Y.Z**" entries.
  content = content.replace(
    /(_Last Updated:\s*)([^_]+)(_ \|\s*_Current Version:\s*)(\d+\.\d+\.\d+)([^_]*)/,
    `$1${buildDate}$3${semantic}$5`
  );

  writeFileSafe(gfPath, content);
  console.log("[version:update] Updated GreasyForkREADME.md badge and footer metadata.");
}

// --- Aggregate updater ---

function runUpdateAll() {
  ensureVersionInfo();
  updatePackageJsonVersion();
  updateReadme();
  updateGreasyForkReadme();
}

// --- CLI helpers ---

function printVersion() {
  console.log(JSON.stringify(VERSION_INFO, null, 2));
}

function printBanner() {
  console.log(
    `WTR LAB Novel Image Generator ${VERSION_INFO.DISPLAY || `v${VERSION_INFO.SEMANTIC}`} | ` +
      `Build: ${VERSION_INFO.BUILD_DATE} | Env: ${VERSION_INFO.BUILD_ENV}`
  );
}

function printHeader() {
  console.log(
    `// WTR LAB Novel Image Generator\n` +
      `// Version: ${VERSION_INFO.DISPLAY || `v${VERSION_INFO.SEMANTIC}`}\n` +
      `// Build Date: ${VERSION_INFO.BUILD_DATE}\n` +
      `// Environment: ${VERSION_INFO.BUILD_ENV}\n`
  );
}

function main() {
  const cmd = process.argv[2] || "update";

  try {
    switch (cmd) {
      case "update":
        runUpdateAll();
        break;
      case "version":
        ensureVersionInfo();
        printVersion();
        break;
      case "banner":
        ensureVersionInfo();
        printBanner();
        break;
      case "header":
        ensureVersionInfo();
        printHeader();
        break;
      default:
        console.error(
          `[version:update] Unknown command "${cmd}". ` +
            'Use one of: "update", "version", "banner", "header".'
        );
        process.exitCode = 1;
    }
  } catch (error) {
    console.error("[version:update] Unhandled error:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}