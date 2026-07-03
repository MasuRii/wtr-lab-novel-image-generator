# WTR LAB Novel Image Generator

[![Version](https://img.shields.io/badge/version-6.3.1-blue.svg?style=for-the-badge)](https://github.com/MasuRii/wtr-lab-novel-image-generator/blob/main/CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/MasuRii/wtr-lab-novel-image-generator/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Built with Webpack](https://img.shields.io/badge/Built%20with-Webpack-8DD6F9?logo=webpack&logoColor=white&style=for-the-badge)](https://webpack.js.org/)
[![Greasy Fork](https://img.shields.io/badge/Install-Greasy%20Fork-green.svg?style=for-the-badge)](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator)
[![GitHub Issues](https://img.shields.io/github/issues/MasuRii/wtr-lab-novel-image-generator?style=for-the-badge)](https://github.com/MasuRii/wtr-lab-novel-image-generator/issues)
[![GitHub Stars](https://img.shields.io/github/stars/MasuRii/wtr-lab-novel-image-generator?style=for-the-badge)](https://github.com/MasuRii/wtr-lab-novel-image-generator/stargazers)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y01PSSVR)

A modern userscript that turns your novel reading into a visual experience. Select text on `wtr-lab.com` and generate AI-powered images via multiple providers with a clean UI, prompt enhancement, history, and powerful configuration options.

[![Demo GIF](https://pixvid.org/images/2025/11/01/kAPg7.gif)](https://pixvid.org/image/kAPg7)

## Features

- **Multi-Provider Support** — generate images using Pollinations, AI Horde, and any OpenAI-compatible API.
- **AI Prompt Enhancement** — uses any OpenAI-compatible API to automatically improve your selected text for better image results, with a smart queue and custom templates.
- **Rich Configuration** — an extensive settings panel to manage API keys, models, prompt styles, and more, with import/export functionality.
- **Native UI Integration** — an "AI Image" launcher is injected directly into the site's bottom reader navigation bar (alongside Read / Display / Speech / Settings / More) and re-injected automatically on SPA route changes, so settings are always one tap away.
- **Unified Image Viewer** — a clean, mobile-friendly viewer to inspect, download, and manage your image generation history.
- **Dark-Theme-Aware Styling** — the generate button, status widget, and toasts adapt to the site's light/dark theme and mirror the host card surfaces instead of clashing with them.
- **Modular Architecture** — a professional, webpack-based structure ensures stability, maintainability, and makes it easy to add new features.
- **Mobile-First Design** — the entire interface is optimized for a seamless experience on both desktop and mobile devices.

## Installation

1. Install a userscript manager. [Tampermonkey](https://www.tampermonkey.net/) is highly recommended.
   - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2. Install the script from [Greasy Fork](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator) or download the latest `.user.js` from the [`dist/` directory](https://github.com/MasuRii/wtr-lab-novel-image-generator).
3. Navigate to any novel on `https://wtr-lab.com` and you're ready to go.

## Usage

1. While reading a chapter, **highlight any descriptive text** with your mouse or finger.
2. The **"Generate Image"** button (a palette icon) will appear near your selection. Click it.
3. Watch the status widget for progress updates, including prompt enhancement and image generation.
4. Once complete, open the image viewer to see, download, or manage your creations.
5. To customize settings, either tap the **"AI Image"** tab in the site's bottom reader navigation bar, or open the Tampermonkey menu and click **"Image Generator Settings"**.

### Prompt Styling

Choose from comprehensive art style categories to guide the AI:

- **Anime Styles**: 10+ sub-styles for various anime aesthetics.
- **Fantasy Styles**: Magical and mythical art approaches.
- **Realism Styles**: Photorealistic and realistic rendering.
- **Custom Templates**: Create and save your own personalized enhancement styles.

### Provider Settings

- **API Configuration**: Set up keys and endpoints for each provider.
- **Model Selection**: Choose specific models for each service.
- **Generation Parameters**: Fine-tune quality, speed, and style settings.
- **Fallback Logic**: Configure automatic provider switching on failure.

### AI Enhancement

- **Enhancement API**: Set up your OpenAI-compatible endpoint (cloud or local) for prompt enhancement.
- **Enhancement Templates**: Create and save custom enhancement styles.

### History & Maintenance

- **Generation History**: View all generated images with their metadata.
- **Export/Import**: Backup and restore your settings and history.
- **Cleanup Tools**: Manage local storage and remove old entries.

### Provider Comparison

| Provider | Current local behavior | Best For |
|----------|------------------------|----------|
| **Pollinations** | POSTs to the `gen.pollinations.ai` generation endpoint, defaults to `zimage` (legacy `sana`/`turbo` auto-mapped), verifies the `x-model-used` response header to reject silent model fallback, and stores results as persistent `data:` URLs. | Quick experiments and free usage |
| **AI Horde** | Starts async jobs, polls `/generate/check/{id}` until done, then fetches `/generate/status/{id}` once; negative prompts use AI Horde's `###` separator. | Community-powered free generation |
| **OpenAI Comp.** | Posts to `/images/generations` and omits `response_format` entirely (unsupported by GPT image models). | Custom or premium OpenAI-compatible APIs |

## Support

- [GitHub Issues](https://github.com/MasuRii/wtr-lab-novel-image-generator/issues)
- [Greasy Fork Feedback](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator/feedback)

## License

MIT. See [LICENSE](https://github.com/MasuRii/wtr-lab-novel-image-generator/blob/main/LICENSE).
