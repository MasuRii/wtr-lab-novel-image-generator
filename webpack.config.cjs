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
const {
  PACKAGE_NAME,
  getDevHeaders,
  getGreasyForkHeaders,
  getPerformanceHeaders,
} = require("./userscript.metadata.cjs");

/**
 * Development / proxy configuration
 * - Used implicitly by `webpack serve` (npm run dev)
 * - Not part of production `npm run build` artifacts
 */
const devConfig = {
  name: "dev",
  mode: "development",
  entry: "./src/index.ts",
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
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new UserscriptPlugin({
      headers: getDevHeaders,
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
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${PACKAGE_NAME}.user.js`,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
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
      headers: getPerformanceHeaders,
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
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    // No version in filename so each build overwrites previous GreasyFork artifact.
    filename: `${PACKAGE_NAME}.greasyfork.user.js`,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
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
      // GreasyFork: no updateURL / downloadURL
      headers: getGreasyForkHeaders,
      proxyScript: false,
    }),
  ],
};

module.exports = [performanceConfig, greasyforkConfig, devConfig];
