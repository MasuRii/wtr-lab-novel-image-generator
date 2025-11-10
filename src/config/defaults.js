export const DEFAULTS = {
  selectedProvider: "Pollinations",
  loggingEnabled: false,
  // Prompt Styling
  mainPromptStyle: "None",
  subPromptStyle: "none",
  customStyleEnabled: false,
  customStyleText: "",
  // AI Prompt Enhancement
  enhancementEnabled: false,
  enhancementProvider: "gemini", // 'gemini', 'disabled'
  enhancementApiKey: "",
  enhancementModel: "models/gemini-2.5-pro",
  // Default enhancement behavior is driven by the selected preset.
  // This base template is aligned with the "Standard Enhancement" preset.
  enhancementTemplate:
    "Extract visual elements from this text and craft a concise, image-ready prompt as a flowing paragraph. Focus on: clear subjects, setting and environment, lighting/mood/color palette, and artistic style/composition/framing. Omit narrative, dialogue, text overlays, and non-visual details. Use vivid, concrete descriptors separated by commas or short phrases. End with quality boosters such as highly detailed, sharp focus, high resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene and mood, then add style and technical details.",
  enhancementTemplateSelected: "standard",
  enhancementOverrideProvider: false,
  enhancementLastStatus: "disabled",
  // Enhancement Retry and Fallback Configuration
  enhancementMaxRetriesPerModel: 2,
  enhancementRetryDelay: 1000,
  enhancementModelsFallback: [
    "models/gemini-2.5-pro",
    "models/gemini-flash-latest",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.5-flash",
    "models/gemini-2.5-flash-lite",
  ],
  enhancementLogLevel: "info", // 'debug', 'info', 'warn', 'error'
  enhancementAlwaysFallback: true,
  // Preset Enhancement Prompts
  // Default enhancement presets (top 5 only). User presets are stored separately.
  enhancementPresets: {
    standard: {
      name: "Standard Enhancement",
      description: "Default enhancement that improves prompt quality",
      template:
        'Extract visual elements from this text and craft a concise image generation prompt as a flowing paragraph. Focus on: characters and their appearances/actions/expressions, setting and environment, lighting/mood/color palette, artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with quality boosters like "highly detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with core subjects, layer in scene/mood, then style/technicals:',
    },
    safety: {
      name: "Safety Enhancement",
      description:
        "Enhances prompts while removing harmful or inappropriate content",
      template:
        'Extract visual elements from this text and craft a safe, concise image generation prompt as a flowing paragraph while removing harmful, inappropriate, or policy-violating elements. Focus on: positive and suitable characters and their appropriate appearances/actions/expressions, safe setting and environment, wholesome lighting/mood/color palette, appropriate artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, specific descriptors separated by commas or short phrases for clarity. End with safety-focused quality boosters like "appropriate content, family-friendly, positive imagery, safe, well-balanced, detailed, sharp focus, 8K resolution, masterpiece. Generated Prompt Structure: Start with safe core subjects, layer in safe scene/mood, then appropriate style/technicals:',
    },
    artistic: {
      name: "Artistic Enhancement",
      description: "Focuses on artistic and creative elements",
      template:
        'Extract visual elements from this text and craft an artistic image generation prompt as a flowing paragraph with emphasis on creative elements and visual aesthetics. Focus on: characters and their creative appearances/actions/expressions with artistic flair, artistic setting and environment, vibrant lighting/mood/color palette, artistic style/composition/framing with emphasis on artistic techniques. Omit narrative, dialogue, text, or non-visual details. Use vivid, artistic descriptors separated by commas or short phrases for clarity. End with artistic quality boosters like "artistic masterpiece, creative composition, vibrant colors, detailed artwork, museum quality, fine art, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with artistic core subjects, layer in creative scene/mood, then artistic style/technicals:',
    },
    technical: {
      name: "Technical Enhancement",
      description: "Emphasizes technical accuracy and detail",
      template:
        'Extract visual elements from this text and craft a technically-precise image generation prompt as a flowing paragraph with emphasis on technical accuracy and realistic elements. Focus on: characters with technically accurate appearances/actions/expressions, realistic setting and environment, precise lighting/mood/color palette, technical artistic style/composition/framing with photorealistic qualities. Omit narrative, dialogue, text, or non-visual details. Use precise, technical descriptors separated by commas or short phrases for clarity. End with technical quality boosters like "photorealistic, technical precision, accurate details, high resolution, professional photography, sharp focus, 8K detail, masterpiece. Generated Prompt Structure: Start with technically accurate core subjects, layer in realistic scene/mood, then technical style/technicals:',
    },
    character: {
      name: "Character Enhancement",
      description: "Focuses on character development and description",
      template:
        'Extract visual elements from this text and craft a character-focused image generation prompt as a flowing paragraph with emphasis on character details and development. Focus on: detailed character appearances/actions/expressions with rich personality traits, character-centric setting and environment, character-appropriate lighting/mood/color palette, character-driven artistic style/composition/framing. Omit narrative, dialogue, text, or non-visual details. Use vivid, character-specific descriptors separated by commas or short phrases for clarity. End with character-focused quality boosters like "detailed character, expressive features, well-defined personality, professional portrait, masterpiece character study, highly detailed, sharp focus, 8K resolution. Generated Prompt Structure: Start with compelling core characters, layer in character-appropriate scene/mood, then character-focused style/technicals:',
    },
  },
  /**
   * User-defined enhancement presets (schema v1).
   * Stored separately from enhancementPresets to preserve default set across updates.
   *
   * Shape:
   * {
   *   "<id>": {
   *     id: string,
   *     name: string,
   *     description?: string,
   *     template: string,
   *     createdAt?: string,
   *     updatedAt?: string,
   *     version?: 1
   *   },
   *   ...
   * }
   *
   * Backward compatibility:
   * - If existing stored value is an array or legacy map without id, migration logic
   *   in the UI/loader should normalize it into this keyed-object shape.
   */
  enhancementUserPresets: {},
  // Global Negative Prompting
  enableNegPrompt: true,
  globalNegPrompt:
    "ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality",
  // Google
  googleApiKey: "",
  model: "imagen-4.0-generate-001",
  numberOfImages: 1,
  imageSize: "1024",
  aspectRatio: "1:1",
  personGeneration: "allow_adult",
  // AI Horde
  aiHordeApiKey: "0000000000",
  aiHordeModel: "AlbedoBase XL (SDXL)",
  aiHordeSampler: "k_dpmpp_2m",
  aiHordeSteps: 25,
  aiHordeCfgScale: 7,
  aiHordeWidth: 512,
  aiHordeHeight: 512,
  aiHordePostProcessing: [],
  aiHordeSeed: "",
  // Pollinations.ai
  pollinationsModel: "flux",
  pollinationsWidth: 512,
  pollinationsHeight: 512,
  pollinationsSeed: "",
  pollinationsEnhance: true,
  pollinationsNologo: false,
  pollinationsPrivate: false,
  pollinationsSafe: true,
  pollinationsToken: "",
  // OpenAI Compatible
  openAICompatProfiles: {},
  openAICompatActiveProfileUrl: "",
  openAICompatModelManualInput: false,
  // History Management
  historyDays: 30,
};
