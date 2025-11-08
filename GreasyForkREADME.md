# 🚀 WTR LAB Novel Image Generator

[![ezgif.com animated gif maker](https://pixvid.org/images/2025/11/01/kAPg7.gif)](https://pixvid.org/image/kAPg7)

[![Version](https://img.shields.io/badge/version-6.0.2-blue.svg)](CHANGELOGS.md) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Userscript](https://img.shields.io/badge/Userscript-Tampermonkey-green.svg)](https://tampermonkey.net/) [![Status](https://img.shields.io/badge/status-active-success.svg)]()

A professional userscript that transforms your novel reading experience by generating AI-powered images from text descriptions. Seamlessly integrate image generation into your reading workflow on `wtr-lab.com` with support for multiple AI providers and advanced prompt enhancement. Why? Because visual storytelling makes stories come alive! 🎨

## 💡 Key Features

Generate high-quality images from selected text using multiple AI providers:

- **🔄 Multi-Provider Support**: Pollinations.ai, AI Horde, OpenAI Compatible APIs, and Google Imagen
- **🧠 AI Prompt Enhancement**: Advanced enhancement powered by Google's Gemini AI (v5.7+)
- **⚡ Smart Queue Management**: Background processing without interrupting your reading flow
- **📱 Mobile-First Design**: Optimized for both desktop and mobile reading experiences
- **🎛️ Advanced Configuration**: Comprehensive settings with provider-specific optimizations
- **🔒 Privacy-Focused**: Local storage with exportable logs and configuration management

## 🔧 Installation

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, Safari)
- Internet connection for AI generation services

### Quick Start

1. **Install Userscript Manager**

   - **Tampermonkey** (Recommended):
     - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
     - [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
     - [Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the Script**

   - Click "Install this script" button on the GreasyFork page
   - Confirm installation in Tampermonkey dashboard

3. **Ready to Go!** 🎉
   - Navigate to `https://wtr-lab.com/en/novel/...`
   - Start selecting text to generate images!

## 💻 Usage

### Basic Workflow

```bash
1. Read any novel chapter on wtr-lab.com
2. Highlight descriptive text with your mouse/touch
3. Click "Generate Image" button (appears automatically)
4. Watch the status indicator as generation completes
5. View and download your generated image!
```

### Advanced Features (v5.7+)

**AI Prompt Enhancement**:

- Automatically enhances prompts using Google's Gemini AI
- Preview original vs enhanced prompts before generation
- Custom templates for personalized enhancement styles
- Smart provider logic optimizes enhancement for each service

**Provider Configuration**:

- **Pollinations.ai**: Fast, free generation with optional premium models
- **AI Horde**: Community-powered network with configurable parameters
- **OpenAI Compatible**: Connect to any compatible API service
- **Google Imagen**: Premium models with advanced generation controls

### Configuration Panel

Access via Tampermonkey menu → "Image Generator Settings":

**🎨 Prompt Styling**: Choose from Anime, Fantasy, Realism categories with 10+ sub-styles each

**⚙️ Provider Settings**: Configure API keys, models, and generation parameters

**🔄 AI Enhancement**: Set up Gemini API key for prompt enhancement (v5.7+)

**📊 History**: View generation history with cleanup tools

**🛠️ Utilities**: Clear cache, toggle logging, import/export settings

## 🏗️ Core Architecture

### 🚀 Intelligent Processing System

- **Background Queue**: Non-intrusive generation queue management
- **Error Recovery**: Smart retry logic with provider switching
- **Status Monitoring**: Clean progress indicators without reading disruption
- **Performance Optimization**: 45-second timeouts with intelligent fallbacks

### 🔌 Provider Integration Matrix

| Provider          | Speed       | Cost    | Quality    | Special Features  |
| ----------------- | ----------- | ------- | ---------- | ----------------- |
| Pollinations.ai   | ⚡ Fast     | 💰 Free | ⭐⭐⭐     | Multiple models   |
| AI Horde          | 🐌 Variable | 💰 Free | ⭐⭐⭐⭐   | Community powered |
| OpenAI Compatible | ⚡ Fast     | 💳 Paid | ⭐⭐⭐⭐⭐ | Custom APIs       |
| Google Imagen     | ⚡ Fast     | 💳 Paid | ⭐⭐⭐⭐⭐ | Premium quality   |

## 🛠️ Troubleshooting

### Common Issues & Solutions

**🔘 Button Not Appearing**

- Verify you're on a novel chapter page (`https://wtr-lab.com/en/novel/...`)
- Refresh page and try text selection again
- Check Tampermonkey is enabled for the site

**❌ Generation Failures**

- Review error messages in popup modal
- Try editing prompt or switching providers
- Check internet connection stability

**🐌 Slow Performance**

- Pollinations.ai: Fastest for simple requests
- AI Horde: Speed varies with community availability
- Google: Fast but may incur costs

### 💡 Pro Tips

- **Batch Processing**: Queue multiple images for background generation
- **Style Experimentation**: Try different artistic styles to find preferences
- **Configuration Backup**: Save settings using import/export functionality
- **Regular Maintenance**: Clean history to maintain optimal performance
- **Mobile Optimization**: Generate button positioned for easy thumb access

## 📝 Changelog

Track all updates and new features in [History](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator/versions).

**Latest: v6.0.2** - Enhanced UI/UX with provider logos, bug fixes, and improved user experience 🎨

### 🆕 New in v6.0.2

**Visual & User Experience Improvements:**

- **🎨 Provider Logo Integration**: Added logos to provider header sections for better visual identification and branding consistency
- **🔧 Enhanced Error Recovery**: Fixed retry button not appearing on API key validation errors, improving error recovery workflow
- **📝 Improved Readability**: Standardized all enhancement presets to flowing paragraph format for better readability
- **🔔 Cleaner Notifications**: Eliminated duplicate save notification messages to reduce visual clutter
- **📐 Better Layout**: Removed specified padding from CSS selectors to improve layout consistency

These updates focus on making your novel reading and image generation experience more intuitive and visually appealing!

## 🤝 Contributing

We ❤️ community contributions! Help make novel reading more immersive:

1. **Report Issues**: Found a bug? Open an issue with details
2. **Feature Requests**: Have an idea? We'd love to hear it!
3. **Code Contributions**: Fork, branch, and submit a PR
4. **Documentation**: Help improve guides and examples

**New to open source?** Start with issues labeled [🐛 Bug] or [✨ Enhancement].

## 📄 License

This project is MIT licensed. See LICENSE for details.

- ✅ Use freely for personal and commercial projects
- ✅ Modify and distribute with attribution
- ❌ No warranty or liability

## 🆘 Support & Community

- **📖 Documentation**: Full guides and API references
- **🐛 Bug Reports**: GitHub Issues for technical problems
- **💬 Feature Requests**: Share your enhancement ideas
- **🌟 Community**: Join WTR LAB readers and creators

---

_Built with ❤️ for novel enthusiasts who believe in the power of visual storytelling_ | _Questions? [Open an Issue](https://greasyfork.org/en/scripts/553073-wtr-lab-novel-image-generator/feedback)_
_Last Updated: November 08, 2025_ | _Current Version: 6.0.2_
