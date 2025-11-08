export const DEFAULTS = {
    selectedProvider: 'Pollinations',
    loggingEnabled: false,
    // Provider Logo Configuration (External URLs)
    providerLogos: {
        Pollinations: {
            url: 'https://raw.githubusercontent.com/pollinations/pollinations/eea264f608e9393e69631eea5e00e9ecf6e1836e/shared/assets/logo.svg',
            alt: 'Pollinations.ai Logo'
        },
        AIHorde: {
            url: 'https://stablehorde.net/assets/img/logo.png',
            alt: 'AI Horde Logo'
        },
        OpenAICompat: {
            url: 'https://openai.com/favicon.svg',
            alt: 'OpenAI Compatible Logo'
        },
        Google: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg',
            alt: 'Google Gemini Logo'
        }
    },
    // Prompt Styling
    mainPromptStyle: 'None',
    subPromptStyle: 'none',
    customStyleEnabled: false,
    customStyleText: '',
    // AI Prompt Enhancement
    enhancementEnabled: false,
    enhancementProvider: 'gemini', // 'gemini', 'disabled'
    enhancementApiKey: '',
    enhancementModel: 'models/gemini-2.5-pro',
    enhancementTemplate: 'Convert this text into a focused visual description for image generation. Extract key visual elements (characters, setting, mood, style) and describe them as a direct prompt without narrative elements, dialogue, or markdown formatting. Keep it concise and focused on what can be visually rendered. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:',
    enhancementTemplateSelected: 'standard',
    enhancementOverrideProvider: false,
    enhancementLastStatus: 'disabled',
    // Enhancement Retry and Fallback Configuration
    enhancementMaxRetriesPerModel: 2,
    enhancementRetryDelay: 1000,
    enhancementModelsFallback: [
        'models/gemini-2.5-pro',
        'models/gemini-flash-latest',
        'models/gemini-flash-lite-latest',
        'models/gemini-2.5-flash',
        'models/gemini-2.5-flash-lite'
    ],
    enhancementLogLevel: 'info', // 'debug', 'info', 'warn', 'error'
    enhancementAlwaysFallback: true,
    // Preset Enhancement Prompts
    enhancementPresets: {
        standard: {
            name: 'Standard Enhancement',
            description: 'Default enhancement that improves prompt quality',
            template: 'Convert this text into a focused visual description for image generation. Extract key visual elements (characters, setting, mood, style) and describe them as a direct prompt without narrative elements, dialogue, or markdown formatting. Keep it concise and focused on what can be visually rendered. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:'
        },
        safety: {
            name: 'Safety Enhancement',
            description: 'Enhances prompts while removing harmful or inappropriate content',
            template: 'Enhance this prompt for image generation while ensuring content safety. Remove any harmful, inappropriate, or policy-violating elements. Focus on extracting positive, creative, and suitable visual elements. Transform the text into a clear, detailed visual description that promotes safe and appropriate imagery. Structure: subjects, setting, mood, style with safety-focused quality boosters like "safe content, appropriate, well-composed, detailed, sharp focus, 8K resolution, masterpiece":'
        },
        artistic: {
            name: 'Artistic Enhancement',
            description: 'Focuses on artistic and creative elements',
            template: 'Transform this text into an artistic prompt for image generation. Emphasize creative elements, artistic techniques, visual aesthetics, and stylistic choices. Focus on artistic expression, color theory, composition, and visual appeal. Extract key artistic elements and describe them with rich, descriptive language that enhances creative vision. End with artistic quality boosters like "artistic masterpiece, creative composition, vibrant colors, detailed artwork, museum quality, fine art":'
        },
        technical: {
            name: 'Technical Enhancement',
            description: 'Emphasizes technical accuracy and detail',
            template: 'Convert this text into a technically-focused image generation prompt. Emphasize technical accuracy, precise details, realistic elements, and measurable characteristics. Focus on technical specifications, realistic proportions, accurate details, and photographic quality. Structure the prompt with technical precision, ending with technical quality boosters like "photorealistic, technical precision, accurate details, high resolution, professional photography, sharp focus, 8K detail":'
        },
        character: {
            name: 'Character Enhancement',
            description: 'Focuses on character development and description',
            template: 'Enhance this prompt by focusing on character development and description. Extract and elaborate on character details including appearance, expression, pose, clothing, age, and personality traits visible in the visual. Describe characters with rich detail, appropriate emotions, and engaging presentation. Focus on what makes the character compelling and well-defined. End with character-focused quality boosters like "detailed character, expressive features, well-defined personality, professional portrait, masterpiece character study":'
        },
        environment: {
            name: 'Environment Enhancement',
            description: 'Enhances environmental and setting descriptions',
            template: 'Transform this prompt by emphasizing environmental and setting details. Focus on the surrounding environment, atmosphere, lighting, weather, architecture, nature, and spatial relationships. Describe the setting with immersive detail, creating a vivid sense of place and mood. Emphasize environmental storytelling and atmospheric elements. End with environmental quality boosters like "immersive environment, detailed background, atmospheric lighting, cinematic composition, 8K environmental detail":'
        },
        composition: {
            name: 'Composition Enhancement',
            description: 'Focuses on composition and visual structure',
            template: 'Enhance this prompt by focusing on visual composition and structure. Emphasize framing, rule of thirds, leading lines, depth of field, visual balance, and photographic techniques. Describe how elements are arranged within the frame and their visual relationships. Focus on creating strong visual impact through careful composition. End with compositional quality boosters like "excellent composition, balanced framing, visual impact, professional photography, cinematic quality, masterpiece composition":'
        },
        clean: {
            name: 'Clean Enhancement',
            description: 'Removes potentially harmful or inappropriate elements',
            template: 'Clean and enhance this prompt for appropriate image generation. Remove any potentially harmful, inappropriate, or problematic elements while preserving the core creative intent. Focus on family-friendly, positive, and suitable visual content. Transform the text into a clear, wholesome prompt that promotes appropriate imagery. Structure with positive, safe content and clean quality boosters like "appropriate content, family-friendly, positive imagery, clean composition, well-balanced, detailed, sharp focus":'
        }
    },
    // Global Negative Prompting
    enableNegPrompt: true,
    globalNegPrompt: 'ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality',
    // Google
    googleApiKey: '',
    model: 'imagen-4.0-generate-001',
    numberOfImages: 1,
    imageSize: '1024',
    aspectRatio: '1:1',
    personGeneration: 'allow_adult',
    // AI Horde
    aiHordeApiKey: '0000000000',
    aiHordeModel: 'AlbedoBase XL (SDXL)',
    aiHordeSampler: 'k_dpmpp_2m',
    aiHordeSteps: 25,
    aiHordeCfgScale: 7,
    aiHordeWidth: 512,
    aiHordeHeight: 512,
    aiHordePostProcessing: [],
    aiHordeSeed: '',
    // Pollinations.ai
    pollinationsModel: 'flux',
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    pollinationsSeed: '',
    pollinationsEnhance: true,
    pollinationsNologo: false,
    pollinationsPrivate: false,
    pollinationsSafe: true,
    pollinationsToken: '',
    // OpenAI Compatible
    openAICompatProfiles: {},
    openAICompatActiveProfileUrl: '',
    openAICompatModelManualInput: false,
    // History Management
    historyDays: 30
};