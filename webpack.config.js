/**
 * Multi-build Webpack configuration for WTR LAB Novel Image Generator.
 *
 * This file now exports an array of configurations:
 * - Common performance build (minified, production)
 * - GreasyFork-compliant build (readable, no update/download URLs)
 * - Development/proxy build for local testing
 *
 * It aligns with PROJECT_WORKSPACE_GUIDE.md while preserving backward compatibility:
 * - `npm run build` uses the performance + GreasyFork builds via multi-config.
 * - Entries and filenames are derived from central version info where relevant.
 */

const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");
const pkg = require("./package.json");
const { VERSION_INFO } = require("./config/versions.js");

// Resolve base metadata with safe fallbacks
const SCRIPT_NAME = "WTR LAB Novel Image Generator";
const PACKAGE_NAME = pkg.name || "wtr-lab-novel-image-generator";
const SEMVER = VERSION_INFO && VERSION_INFO.SEMANTIC ? VERSION_INFO.SEMANTIC : (pkg.version || "0.0.0");

// Shared Userscript metadata fields (non-conflicting)
const COMMON_META = {
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
  namespace: "http://tampermonkey.net/",
  match: "https://wtr-lab.com/en/novel/*/*/*",
  icon: "https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com",
  connect: "*",
  grant: [
    "GM_setValue",
    "GM_getValue",
    "GM_xmlhttpRequest",
    "GM_registerMenuCommand",
  ],
};

/**
 * Development / proxy configuration
 * - Used implicitly by `webpack serve` (npm run dev)
 * - Not part of production `npm run build` artifacts
 */
const devConfig = {
  name: "dev",
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${PACKAGE_NAME}.dev.user.js`,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8080,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    server: "http",
    hot: false,
    client: {
      webSocketURL: "ws://localhost:8080/ws",
      overlay: false,
      logging: "none",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        ...COMMON_META,
        name: `${SCRIPT_NAME} [DEV]`,
        version: `${SEMVER}-dev.[buildTime]`,
      },
      proxyScript: {
        baseUrl: "http://localhost:8080",
        filename: "[basename].proxy.user.js",
        enable: true,
      },
    }),
  ],
};

/**
 * Performance-optimized production build
 * - Minified, update/download URLs allowed.
 * - Backward compatible filename: wtr-lab-novel-image-generator.user.js
 */
const performanceConfig = {
  name: "performance",
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${PACKAGE_NAME}.user.js`,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    usedExports: true,
    concatenateModules: true,
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        ...COMMON_META,
        name: SCRIPT_NAME,
        version: SEMVER,
        downloadURL:
          "https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.user.js",
        updateURL:
          "https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.meta.js",
      },
      proxyScript: false,
    }),
  ],
};

/**
 * GreasyFork-compliant build
 * - Readable output
 * - No update/download URLs in metadata
 * - No minification (optimize while keeping readability)
 */
const greasyforkConfig = {
  name: "greasyfork",
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    // No version in filename so each build overwrites previous GreasyFork artifact.
    filename: `${PACKAGE_NAME}.greasyfork.user.js`,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: false,
    usedExports: true,
    concatenateModules: true,
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        ...COMMON_META,
        name: SCRIPT_NAME,
        version: SEMVER,
        // GreasyFork: no updateURL / downloadURL
      },
      proxyScript: false,
    }),
  ],
};

module.exports = [performanceConfig, greasyforkConfig, devConfig];
