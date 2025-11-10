# 🚀 WTR LAB Novel Image Generator

[![ezgif.com animated gif maker](https://pixvid.org/images/2025/11/01/kAPg7.gif)](https://pixvid.org/image/kAPg7)

[![Version](https://img.shields.io/badge/version-6.0.5-blue.svg)](Changelog.md) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-green.svg)](https://tampermonkey.net/) [![Status](https://img.shields.io/badge/status-active-success.svg)]() [![Modular Architecture](https://img.shields.io/badge/Architecture-Modular-purple.svg)]()

## ✨ Overview

WTR LAB Novel Image Generator is a modern userscript that turns your WTR-LAB novel reading into a visual experience. Select text on `wtr-lab.com` and generate AI-powered images via multiple providers with a clean UI, modular architecture, prompt enhancement, history, and powerful configuration options.

## ✨ Key Features

- 🔄 **Multi-provider support**: Pollinations, AI Horde, OpenAI-compatible, Google Imagen
- 🚀 **AI Prompt Enhancement**: Via Gemini with smart queue behavior and immediate status updates
- 🎛️ **Rich configuration panel**: Import/export, backward-compatible normalization, and provider-specific settings
- 🧱 **Fully modular architecture**: Maintainable, stable, and extensible codebase
- 🖼️ **Unified image viewer**: History, cleanup tools, mobile-friendly layout, and professional UI
- 📱 **Mobile-first design**: Optimized for desktop and mobile reading experiences
- 🔒 **Privacy-focused**: Local storage with exportable logs and configuration
- 🌐 **Cross-browser compatible**: Works seamlessly across all modern browsers

## 📥 Installation

1. **Install a userscript manager** (Tampermonkey recommended)
   - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the script**
   - Use the [GreasyFork page](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator) (recommended) or
   - Load the built script from the `dist/` directory into Tampermonkey

3. **Start creating! 🎉**
   - Navigate to `https://wtr-lab.com/en/novel/...`
   - Select descriptive text to generate images

## ⚙️ Configuration Overview

**API Providers**: AI Horde, Pollinations, Google Imagen, and OpenAI-compatible endpoints  
**AI Prompt Enhancement**: Gemini-powered enhancement with clear queue indicators and immediate status updates  
**Negative Prompt Handling**: Correct behavior for AI Horde with proper `negative_prompt` support  
**Templates & Persistence**: Custom enhancement templates persist across all user workflows  
**Dimensions & UI**: Standardized Pollinations controls and polished mobile-friendly layout  
**History & Maintenance**: Built-in cleanup tools and reliable mobile layout

## 📚 Usage

1. **Highlight descriptive text** in any WTR-LAB chapter
2. **Click "🎨 Generate Image"** when the floating button appears
3. **Monitor progress** via the status widget for queue, enhancement, and error states
4. **View results** in the image viewer to inspect, download, and manage generated images
5. **Configure settings** (Tampermonkey menu → "Image Generator Settings") for:
   - API keys, models, and endpoints
   - AI Prompt Enhancement enabling/disabling
   - Enhancement templates and global settings

## 🏗️ Architecture

Built as a modular, webpack-bundled userscript following professional development practices:

- `src/api/` – provider integrations (AI Horde, Pollinations, Google, OpenAI-compatible, Gemini)
- `src/components/` – UI pieces (status widget, viewer, config, prompts, history)
- `src/config/` – defaults, model maps, shared styles, and configuration management
- `src/core/` – bootstrapping, events, and core application flow
- `src/utils/` – logging, storage, prompt utilities, file helpers, and caching
- `src/styles/` – layered CSS for base, layout, components, themes, and utilities

This modular structure enables safer changes, better debugging, and clean separation of concerns.

## 🆕 What's New in v6.0.5

Latest improvements focus on stability, UI refinements, and enhanced user experience:

- 🧹 **History & UI Fixes**: Improved History Tab Cleaner layout and mobile-friendly input widths
- 🔄 **Config Import/Export**: Enhanced backward compatibility between legacy (5.7.x) and 6.x formats
- 🎯 **Provider Behavior**: Corrected global negative prompt handling for AI Horde
- 🚀 **Enhancement System**: Improved queue behavior and immediate status updates after config changes
- 📏 **Consistent UX**: Standardized Pollinations controls and polished layout
- 📝 **Template Persistence**: Reliable enhancement template storage across all user workflows
- 🖼️ **Image Viewer**: Better modal layering and close-button accessibility

For complete changelog, see [Changelog.md](Changelog.md).

## 📦 Links

- 📜 **Changelog**: [Changelog.md](Changelog.md)
- 🧩 **GreasyFork Script Page**: https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator
- 🗂️ **Source & Issues**: https://github.com/MasuRii/wtr-lab-novel-image-generator

## 🤝 Contributing

- 🐛 **Report bugs** via GitHub Issues with clear reproduction steps
- 💡 **Propose enhancements** focused on UX, performance, or provider support
- 📖 **Improve documentation** to help new users onboard quickly
- 🌟 **Join the community** and help make novel reading more immersive

## 📄 License

MIT License — see [LICENSE](LICENSE) for full terms. Use freely for personal and commercial projects, modify and distribute with attribution.

---

*Built with ❤️ for novel enthusiasts who believe in the power of visual storytelling.*

_Questions? [Open an Issue](https://github.com/MasuRii/wtr-lab-novel-image-generator/issues)_