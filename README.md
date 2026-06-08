# 🚀 WTR LAB Novel Image Generator 🖼️

[![Demo GIF](https://pixvid.org/images/2025/11/01/kAPg7.gif)](https://pixvid.org/image/kAPg7)

[![Version](https://img.shields.io/badge/version-6.1.1-blue.svg)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-green.svg)](https://tampermonkey.net/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-Modular-purple.svg)]()

WTR LAB Novel Image Generator is a modern userscript that turns your novel reading into a visual experience. Select text on `wtr-lab.com` and generate AI-powered images via multiple providers with a clean UI, prompt enhancement, history, and powerful configuration options.

## ✨ Key Features

*   **🔄 Multi-Provider Support**: Generate images using Pollinations, AI Horde, Google Imagen/Gemini image models, and any OpenAI-compatible API.
*   **🚀 AI Prompt Enhancement**: Uses Google Gemini to automatically improve your selected text for better image results, with a smart queue and custom templates.
*   **🎛️ Rich Configuration**: An extensive settings panel to manage API keys, models, prompt styles, and more, with import/export functionality.
*   **🖼️ Unified Image Viewer**: A clean, mobile-friendly viewer to inspect, download, and manage your image generation history.
*   **🧱 Modular Architecture**: A professional, webpack-based structure ensures stability, maintainability, and makes it easy to add new features.
*   **📱 Mobile-First Design**: The entire interface is optimized for a seamless experience on both desktop and mobile devices.

## 📥 Installation

1.  **Install a Userscript Manager**: [Tampermonkey](https://www.tampermonkey.net/) is highly recommended.
    *   [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    *   [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
    *   [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2.  **Install the Script**:
    *   **Recommended**: Install directly from the **[➡️ GreasyFork Page](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator)**.
    *   **Alternative**: Download the latest release from the `dist/` directory and manually import it into Tampermonkey.

3.  **Start Creating!** 🎉 Navigate to any novel on `https://wtr-lab.com`, and you're ready to go.

## 📚 Usage

1.  While reading a chapter, **highlight any descriptive text** with your mouse or finger.
2.  The **"🎨 Generate Image"** button will appear. Click it.
3.  Watch the status widget for progress updates, including prompt enhancement and image generation.
4.  Once complete, open the image viewer to see, download, or manage your creations.
5.  To customize settings, open the Tampermonkey menu and click **"Image Generator Settings"**.

<details>
<summary><b>⚙️ Click to see In-Depth Configuration Details</b></summary>

The configuration panel gives you full control over the script.

### 🎨 Prompt Styling
Choose from comprehensive art style categories to guide the AI:
- **Anime Styles**: 10+ sub-styles for various anime aesthetics.
- **Fantasy Styles**: Magical and mythical art approaches.
- **Realism Styles**: Photorealistic and realistic rendering.
- **Custom Templates**: Create and save your own personalized enhancement styles.

### ⚙️ Provider Settings
- **API Configuration**: Set up keys and endpoints for each provider.
- **Model Selection**: Choose specific models for each service.
- **Generation Parameters**: Fine-tune quality, speed, and style settings.
- **Fallback Logic**: Configure automatic provider switching on failure.

### 🔄 AI Enhancement
- **Gemini Integration**: Set up your Google Gemini API key for prompt enhancement.
- **Enhancement Templates**: Create and save custom enhancement styles.
- **Preview Mode**: Compare the original text vs. the enhanced prompt before generating.

### 📊 History & Maintenance
- **Generation History**: View all generated images with their metadata.
- **Export/Import**: Backup and restore your settings and history.
- **Cleanup Tools**: Manage local storage and remove old entries.

</details>

## 📊 Provider Comparison

| Provider | Current local behavior | Best For |
| --- | --- | --- |
| **Pollinations** | Public generation defaults to `sana`, sends negative prompts with `negative_prompt`, and uses `nofeed=true` for privacy. | Quick experiments and free usage |
| **AI Horde** | Starts async jobs, polls `/generate/check/{id}` until done, then fetches `/generate/status/{id}` once; negative prompts use AI Horde's `###` separator. | Community-powered free generation |
| **Google Imagen/Gemini** | Imagen models use `:predict`; Gemini image models use current `v1` `:generateContent` with `generationConfig.responseFormat.image`. | Premium Google image generation |
| **OpenAI Comp.** | Posts to `/images/generations`; DALL-E keeps `response_format: "b64_json"`, while GPT image models omit unsupported `response_format`. | Custom or premium OpenAI-compatible APIs |

Provider behavior in this table reflects the local TypeScript implementations and the 2026-06-08 compatibility review captured in `CHANGELOG.md`.

## 🏗️ For Developers & Contributors

We welcome contributions! Whether it's reporting a bug, suggesting a feature, or writing code, your help is appreciated.

### 🤝 How to Contribute
1.  **Report Issues**: Find a bug? [Open an issue](https://github.com/MasuRii/wtr-lab-novel-image-generator/issues) with clear reproduction steps.
2.  **Suggest Features**: Have a great idea? We'd love to hear it!
3.  **Submit Pull Requests**: Fork the repo, create a feature branch, and submit a PR.

### 🛠️ Development Setup

The project is built using a modern, modular TypeScript structure with Webpack. Runtime source changes belong under `src/**/*.ts`; installable userscript artifacts are generated under `dist/`.

```bash
# Install dependencies from the lockfile
npm ci

# Run the API compatibility harness without real provider keys or network calls
npm run test:api:red

# Run the standard repository gate: typecheck, ESLint, and build
npm run validate

# Run development server with hot-reloading when browser testing
npm run dev
```

ESLint is the required source-quality gate for this workspace. Prettier/style commands may exist for local cleanup, but they are not required for workspace standard validation.

### 🏛️ Architecture Overview

The codebase is cleanly organized for maintainability and scalability.

```
src/
├── api/          # AI provider integrations (AI Horde, Gemini, Google, etc.)
├── components/   # UI components (Config Panel, Image Viewer, Status Widget)
├── config/       # Default settings, models, and shared styles
├── core/         # Core application logic, event handling, and bootstrapping
├── styles/       # Global and component-specific CSS
└── utils/        # Helper functions (logging, storage, prompt processing)
```

## 🔗 Quick Links

-   **📜 Changelog**: [CHANGELOG.md](CHANGELOG.md)
-   **🧩 GreasyFork**: [Script Page](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator)
-   **🗂️ Source & Issues**: [GitHub Repository](https://github.com/MasuRii/wtr-lab-novel-image-generator)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for novel enthusiasts who believe in the power of visual storytelling._