export const DEFAULTS = {
    selectedProvider: 'Pollinations',
    loggingEnabled: false,
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
    enhancementOverrideProvider: false,
    enhancementLastStatus: 'disabled',
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
    openAICompatModelManualInput: false
};