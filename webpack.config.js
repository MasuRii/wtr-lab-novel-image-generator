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
        baseUrl: "http://127.0.0.1:8080",
        filename: "[basename].proxy.user.js",
        enable: isDev,
      },
    }),
  ],
};
