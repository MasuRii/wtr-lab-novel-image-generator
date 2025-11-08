const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");
const pkg = require("./package.json");

const isDev = process.env.NODE_ENV === "development";

// The friendly name of the script
const scriptName = "WTR LAB Novel Image Generator";

module.exports = {
  mode: isDev ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${pkg.name}.user.js`,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 8080,
    // Allow connections from Tampermonkey
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // --- CHANGE #1: REVERT TO HTTP ---
    // Run webpack-dev-server in HTTP mode to avoid mixed content issues with proxy script
    server: "http",
    // Disable hot module replacement for browsers with WebSocket issues
    hot: false,
    // --- END OF CHANGE #1 ---
    client: {
      // --- CHANGE #2: UPDATE THIS LINE ---
      // Connect to the WebSocket server using HTTP protocol
      // Disable HMR for browsers that have WebSocket connection issues (like LibreWolf)
      webSocketURL: "ws://localhost:8080/ws",
      overlay: false, // Disable error overlay for WebSocket issues
      logging: "none", // Reduce webpack-dev-server logging noise
      // --- END OF CHANGE #2 ---
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
        name: isDev ? `${scriptName} [DEV]` : scriptName,
        version: isDev ? `${pkg.version}-build.[buildTime]` : pkg.version,
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
        downloadURL:
          "https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.user.js",
        updateURL:
          "https://update.greasyfork.org/scripts/553073/WTR%20LAB%20Novel%20Image%20Generator.meta.js",
      },
      // This is the magic for development!
      // It creates a proxy script that loads the main script from your dev server.
      // This means you get live updates without reinstalling the script.
      proxyScript: {
        baseUrl: "http://localhost:8080",
        filename: "[basename].proxy.user.js",
        enable: isDev,
      },
    }),
  ],
};
