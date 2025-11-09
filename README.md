# 🚀 WTR LAB Novel Image Generator 🖼️ (v6.0.4)

[![ezgif.com animated gif maker](https://pixvid.org/images/2025/11/01/kAPg7.gif)](https://pixvid.org/image/kAPg7)

[![Version](https://img.shields.io/badge/version-6.0.4-blue.svg)](Changelog.md) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-green.svg)](https://tampermonkey.net/) [![Status](https://img.shields.io/badge/status-active-success.svg)]() [![Modular Architecture](https://img.shields.io/badge/Architecture-Modular-purple.svg)]()

## ✨ Overview

WTR LAB Novel Image Generator is a modern userscript that turns your WTR-LAB novel reading into a visual experience. Select text on `wtr-lab.com` and generate AI-powered images via multiple providers with a clean UI, modular architecture, prompt enhancement, history, and powerful configuration options.

## ✨ Key Features

- 🔄 Multi-provider support: Pollinations, AI Horde, OpenAI-compatible, Google Imagen
- 🚀 AI Prompt Enhancement via Gemini with smart queue behavior
- 🎛️ Rich configuration panel with import/export and backward-compatible normalization
- 🧱 Fully modular architecture for maintainability and stability
- 🖼️ Unified image viewer with history, cleanup tools, and mobile-friendly layout

## 📥 Installation

1. Install a userscript manager (Tampermonkey recommended).
2. Install the built userscript:
   - Use the GreasyFork page (recommended) or
   - Load the built script from the `dist/` directory into Tampermonkey.
3. Navigate to `https://wtr-lab.com/en/novel/...`, select descriptive text, and click "🎨 Generate Image".

## ⚙️ Configuration Overview

- 🔐 API Providers:
  - AI Horde, Pollinations, Google Imagen, and OpenAI-compatible endpoints.
- 🚀 AI Prompt Enhancement:
  - Gemini-powered enhancement with clear queue indicators and immediate status updates after config import.
  - Supports custom templates and safe handling of prompts without leaking global negative prompts into enhancement.
- 🕶️ Negative Prompt Handling:
  - Correct behavior for AI Horde: global negative prompt applied only where supported (e.g., `negative_prompt`).
- 🧩 Templates & Persistence:
  - Custom enhancement templates persist correctly across save/reload, load example, and reset flows.
- 📏 Dimensions & UI:
  - Standardized Pollinations dimension inputs and polished layout for key panels.
- 🧹 History & Maintenance:
  - History cleaner and mobile layout tuned for reliability and readability.

## 🆕 New in v6.0.4

- 🧹 Fixed History Tab Cleaner layout and ensured mobile-friendly input widths.
- ❌ Improved image viewer modal layering and close-button usability so it remains accessible above other UI.
- 🔄 Hardened config import/export to seamlessly normalize between legacy (5.7.x) and 6.x formats.
- 🎯 Corrected global negative prompt behavior for AI Horde so it is only applied via `negative_prompt` where supported.
- 🚀 Clarified AI Prompt Enhancement queue behavior and added refinement so the status widget reflects enhancement queue state.
- ⚡ Ensured AI Prompt Enhancement status reacts immediately after configuration imports.
- 📏 Standardized Pollinations size/dimension controls for consistent UX.
- 📝 Made enhancement templates reliably persist across typical user workflows.

## 📚 Usage

1. Highlight descriptive text in a WTR-LAB chapter.
2. Click "🎨 Generate Image" when the floating button appears.
3. Watch the status widget for queue/progress, enhancement, and error states.
4. Open the image viewer to inspect, download, and manage generated images.
5. Use the configuration panel (Tampermonkey menu → "Image Generator Settings") to:
   - Set API keys, models, endpoints
   - Enable/disable AI Prompt Enhancement
   - Manage enhancement templates and global settings

## 🏗️ Architecture

Built as a modular, webpack-bundled userscript:

- `src/api/` – provider integrations (AI Horde, Pollinations, Google, OpenAI-compatible, Gemini)
- `src/components/` – UI pieces (status widget, viewer, config, prompts, history, etc.)
- `src/config/` – defaults, model maps, shared styles
- `src/core/` – bootstrapping, events, core app flow
- `src/utils/` – logging, storage, prompt utilities, file helpers
- `src/styles/` – layered CSS for base, layout, components, themes, and utilities

This structure enables safer changes, better debugging, and clean separation of concerns.

## 📦 Links

- 📜 Changelog: [Changelog.md](Changelog.md)
- 🧩 GreasyFork Script Page: https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator
- 🗂️ Source & Issues: https://github.com/MasuRii/wtr-lab-novel-image-generator

## 🤝 Contributing

- 🐛 Report bugs via GitHub Issues with clear reproduction steps.
- 💡 Propose enhancements focused on UX, performance, or provider support.
- 📖 Improve documentation to help new users onboard quickly.

## 📄 License

MIT License — see [LICENSE](LICENSE) for full terms.

_Built with ❤️ for novel enthusiasts who believe in the power of visual storytelling._

- **Complete Architecture Redesign**: Transformed from single-file monolith to professional modular structure
- **Separation of Concerns**: Cleanly organized into API modules, components, utilities, and configuration
- **Enhanced Maintainability**: Easy to understand, modify, and extend
- **Improved Code Reusability**: Modular components can be reused across different features
- **Professional Development Experience**: Follows industry best practices for scalable codebases

### 🛠️ **14 Stability & Enhancement Fixes**

✅ **AI Prompt Enhancement Fallback**: Robust fallback mechanism for enhanced prompts  
✅ **Persistent History Management**: Improved local storage and history system  
✅ **OpenAI Compatible Provider Error Handling**: Better error categorization and recovery  
✅ **IP Address Mismatch Retry**: Intelligent retry logic for network issues  
✅ **CSS Alignment & Styling**: Professional UI improvements and responsive design  
✅ **JSON Parsing Error Resolution**: Enhanced error handling for data processing  
✅ **Enhancement Template Interface**: Improved configuration management  
✅ **Unified Image Modal**: Seamless handling of base64 and URL images  
✅ **Clean Prompt Formatting**: Better text processing before transmission  
✅ **Provider Icons/Logos Updates**: Modern visual identity improvements  
✅ **Additional Styling Fixes**: Comprehensive UI polish and consistency  
✅ **Testing & Stability Validation**: Extensive quality assurance improvements  
✅ **Configuration Tab Functionality**: Restored and enhanced settings management  
✅ **Complete Logo System Simplification**: Streamlined visual branding

## ✨ What's New in v6.0.2 - Minor Release: UI/UX Refinements

### 🎨 **User Interface Improvements**

- **Provider Logo Integration**: Added professional logos to provider header sections for better visual identification
- **Retry Generation Button Display Fix**: Resolved issue where retry button failed to appear during API key validation errors
- **History List Padding Removal**: Cleaned up CSS by removing unnecessary padding from history list selectors for improved visual consistency

### 🛠️ **Enhancement System Optimizations**

- **Prompt Enhancement Preset Formatting**: Standardized all enhancement presets to flowing paragraph format for better readability and consistency
- **Configuration Save Message Deduplication**: Eliminated duplicate save notification messages to provide cleaner user feedback

### 📈 **User Experience Enhancements**

- **Improved Visual Identity**: Professional provider logos enhance overall interface recognition
- **Better Error Handling**: Retry functionality now properly displays during all error scenarios
- **Streamlined Notifications**: Cleaner, non-repetitive user feedback system
- **Enhanced Interface Consistency**: Removed visual inconsistencies for more professional appearance

## 🎯 Key Features

### Multi-Provider AI Image Generation

Generate high-quality images from selected text using multiple AI providers:

- **🔄 Pollinations.ai**: Fast, free generation with multiple model options
- **🤖 AI Horde**: Community-powered network with high-quality results
- **🧠 OpenAI Compatible**: Connect to any compatible API service
- **🎨 Google Imagen**: Premium models with advanced generation controls

### Advanced Enhancement System

- **🚀 AI Prompt Enhancement**: Powered by Google's Gemini AI for improved prompts
- **📝 Custom Templates**: Personalized enhancement styles and configurations
- **⚡ Smart Provider Logic**: Optimizes enhancement for each AI service
- **🔄 Smart Queue Management**: Background processing without interrupting reading

### Professional User Experience

- **📱 Mobile-First Design**: Optimized for desktop and mobile reading
- **🎛️ Advanced Configuration**: Comprehensive settings with provider-specific options
- **🔒 Privacy-Focused**: Local storage with exportable logs and configuration
- **🌐 Cross-Browser Compatible**: Works seamlessly across all modern browsers

## 🚀 Quick Start

### Prerequisites

- Modern browser (Chrome, Firefox, Edge, Safari)
- Internet connection for AI generation services

### Installation

1. **Install Tampermonkey**

   - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the Script**

   - Download the built userscript from the `dist/` directory
   - Import into Tampermonkey

3. **Start Creating! 🎉**
   - Navigate to `https://wtr-lab.com/en/novel/...`
   - Select descriptive text to generate images

## 💻 Usage

### Basic Workflow

1. Read any novel chapter on wtr-lab.com
2. Highlight descriptive text with your mouse/touch
3. Click "Generate Image" button (appears automatically)
4. Watch the status indicator as generation completes
5. View and download your generated image!

### Advanced Configuration

**AI Prompt Enhancement Setup**:

- Configure Google Gemini API key for enhanced prompts
- Preview original vs enhanced prompts before generation
- Use custom templates for personalized styles

**Provider Configuration**:

- Set up API keys for preferred services
- Configure generation parameters and quality settings
- Switch between providers based on needs and availability

## 🏗️ Architecture Overview

### Modular Structure

Our v6.0.3 release introduces a completely modular architecture:

```
src/
├── api/              # AI provider integrations
│   ├── aiHorde.js    # AI Horde API implementation
│   ├── gemini.js     # Google Gemini enhancement
│   ├── google.js     # Google Imagen API
│   ├── openAI.js     # OpenAI compatible APIs
│   └── pollinations.js # Pollinations.ai integration
├── components/       # UI components
│   ├── configPanel.js # Configuration interface
│   ├── errorModal.js  # Error handling UI
│   ├── imageViewer.js # Image display component
│   └── statusWidget.js # Status indicators
├── config/          # Configuration management
│   ├── defaults.js   # Default settings
│   ├── models.js     # AI model configurations
│   └── styles.js     # Style definitions
├── core/            # Core application logic
│   ├── app.js       # Main application controller
│   └── events.js    # Event management system
├── styles/          # Stylesheets
│   └── main.css     # Main application styles
└── utils/           # Utility functions
    ├── cache.js      # Caching system
    ├── error.js      # Error handling utilities
    ├── file.js       # File operations
    ├── logger.js     # Logging system
    ├── promptUtils.js # Prompt processing
    └── storage.js    # Local storage management
```

### Benefits of Modular Architecture

- **🎯 Separation of Concerns**: Each module has a specific responsibility
- **🔄 Easy Maintenance**: Locate and fix issues quickly
- **📈 Scalability**: Add new features without affecting existing code
- **🧪 Testability**: Individual modules can be tested independently
- **👥 Team Collaboration**: Multiple developers can work on different modules
- **🔧 Reusability**: Components can be reused across the application

## 🔧 Technical Specifications

### Build System

- **Webpack 5**: Modern bundling and optimization
- **Modular Code splitting**: Efficient code organization
- **CSS Processing**: Advanced styling with CSS loaders
- **Production Optimization**: Minified and optimized builds

### Error Handling & Recovery

- **Categorized Errors**: Proper error classification and handling
- **Smart Retry Logic**: Automatic recovery from temporary failures
- **User-Friendly Messages**: Clear, actionable error communications
- **Fallback Mechanisms**: Graceful degradation when services are unavailable

### Performance Optimizations

- **Efficient Caching**: Smart caching strategies for improved response times
- **Background Processing**: Non-blocking image generation queues
- **Resource Management**: Optimized memory and network usage
- **Cross-Browser Compatibility**: Consistent performance across browsers

## 📊 Provider Comparison

| Provider          | Speed       | Cost    | Quality    | Special Features                   | Best For                  |
| ----------------- | ----------- | ------- | ---------- | ---------------------------------- | ------------------------- |
| Pollinations.ai   | ⚡ Fast     | 💰 Free | ⭐⭐⭐     | Multiple models, Fast results      | Quick testing, Free usage |
| AI Horde          | 🐌 Variable | 💰 Free | ⭐⭐⭐⭐   | Community powered, High quality    | Quality-focused users     |
| OpenAI Compatible | ⚡ Fast     | 💳 Paid | ⭐⭐⭐⭐⭐ | Custom APIs, Premium models        | Professional use cases    |
| Google Imagen     | ⚡ Fast     | 💳 Paid | ⭐⭐⭐⭐⭐ | Premium quality, Advanced controls | Best quality results      |

## 🛠️ Configuration Panel

Access via Tampermonkey menu → "Image Generator Settings":

### 🎨 Prompt Styling

Choose from comprehensive art style categories:

- **Anime Styles**: 10+ sub-styles for anime aesthetics
- **Fantasy Styles**: Magical and mythical art approaches
- **Realism Styles**: Photorealistic and realistic rendering
- **Custom Templates**: Personalized enhancement styles

### ⚙️ Provider Settings

- **API Configuration**: Set up keys and endpoints for each provider
- **Model Selection**: Choose specific models for each service
- **Generation Parameters**: Fine-tune quality, speed, and style settings
- **Fallback Logic**: Configure automatic provider switching

### 🔄 AI Enhancement

- **Gemini Integration**: Set up Google Gemini API for prompt enhancement
- **Enhancement Templates**: Create and save custom enhancement styles
- **Preview Mode**: Compare original vs enhanced prompts
- **Smart Logic**: Optimized enhancement for each provider

### 📊 History & Analytics

- **Generation History**: View all generated images with metadata
- **Usage Statistics**: Track provider usage and performance
- **Export/Import**: Backup and restore settings and history
- **Cleanup Tools**: Manage storage and remove old entries

## 🧪 Testing & Quality Assurance

Version 6.0.0 underwent extensive testing and validation:

- **✅ Functional Testing**: All features tested across multiple browsers
- **✅ Integration Testing**: Provider APIs tested for stability
- **✅ Performance Testing**: Load testing and optimization validation
- **✅ Error Handling Testing**: Comprehensive error scenario testing
- **✅ Cross-Platform Testing**: Desktop and mobile compatibility verification
- **✅ Security Testing**: Privacy and data protection validation

## 🚀 Development

### Build Commands

```bash
# Development build with hot reload
npm run dev

# Production build
npm run build
```

### Architecture Principles

- **Modularity First**: Every feature follows modular design principles
- **Error Resilience**: Robust error handling at every level
- **Performance Conscious**: Optimized for both speed and resource usage
- **User Experience**: Every decision prioritizes user experience
- **Maintainability**: Clean, documented, and easy-to-understand code

## 📝 Changelog

Track all updates and changes in [Changelog.md](Changelog.md).

**Latest: v6.0.2** - Minor UI/UX refinement release with provider logo integration, retry button fixes, preset formatting, and message deduplication. Built on v6.0.0 modular architecture foundation. 🎨

## 🤝 Contributing

We ❤️ community contributions! Help make novel reading more immersive:

1. **Report Issues**: Found a bug? Open an issue with detailed information
2. **Feature Requests**: Have an idea? We'd love to hear your suggestions!
3. **Code Contributions**: Fork, branch, and submit a pull request
4. **Documentation**: Help improve guides, examples, and documentation

**New to open source?** Start with issues labeled [🐛 Bug] or [✨ Enhancement].

## 📄 License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

- ✅ Use freely for personal and commercial projects
- ✅ Modify and distribute with attribution
- ❌ No warranty or liability

## 🆘 Support & Community

- **📖 Documentation**: Comprehensive guides and API references
- **🐛 Bug Reports**: GitHub Issues for technical problems
- **💬 Feature Requests**: Share your enhancement ideas
- **🌟 Community**: Join WTR LAB readers and creators worldwide

---

### 🎯 Version 6.0.3 Highlights Summary

**🎨 UI/UX Improvements**: Enhanced z-index hierarchy, flexible positioning, smooth animations, and mobile responsiveness
**🛠️ Feature Enhancements**: Reorganized download file naming, automatic link cleaning, and improved clean button functionality
**🔧 Bug Fixes**: Mobile button animation fix, button text corruption resolution, and model information flow fixes
**🚀 Performance**: Built on v6.0.0 modular architecture for maintainability and scalability

### 🎯 Version 6.0.0 Highlights Summary

**⚠️ Note: v6.0.0 was the major architectural transformation release (v6.0.2 builds on this foundation).**

**🏗️ Architecture**: Complete modular transformation from monolith to professional structure
**🛠️ Stability**: 14 major fixes addressing reliability and user experience
**🚀 Performance**: Optimized caching, background processing, and resource management
**🎨 UX**: Professional UI improvements with mobile-first responsive design
**🔧 Maintainability**: Clean, documented, and extensible codebase for future development

_Built with ❤️ for novel enthusiasts who believe in the power of visual storytelling_

_Questions? [Open an Issue](https://github.com/MasuRii/wtr-lab-novel-image-generator/issues)_  
_Last Updated: November 08, 2025_ | _Current Version: 6.0.2_ (Known Issues)
