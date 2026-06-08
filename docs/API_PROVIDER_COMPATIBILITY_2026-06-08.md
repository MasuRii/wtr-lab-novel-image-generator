# API Provider Compatibility Notes (2026-06-08)

This document records the source-backed provider API behavior implemented by the userscript. It intentionally avoids screenshots and image snippets so existing documentation image links remain unchanged.

## Sources checked

| Provider / Area | Source URL | Date accessed | Source date signal from research |
|---|---|---:|---|
| Pollinations API docs | https://raw.githubusercontent.com/pollinations/pollinations/master/APIDOCS.md | 2026-06-08 | GitHub raw served 2026-06-07 UTC; latest commit observed 2026-06-02T13:32:25Z |
| Pollinations OpenAPI/source | https://raw.githubusercontent.com/pollinations/pollinations/master/image.pollinations.ai/openapi.yaml | 2026-06-08 | GitHub raw served 2026-06-07 UTC |
| Pollinations live models | https://image.pollinations.ai/models | 2026-06-08 | Live response returned `['sana']` |
| AI Horde Swagger | https://aihorde.net/api/swagger.json | 2026-06-08 | Live Swagger `info.version: 2.5`; rate headers present |
| AI Horde integration guide | https://raw.githubusercontent.com/Haidra-Org/AI-Horde/main/README_integration.md | 2026-06-08 | GitHub source-backed integration guide |
| AI Horde source behavior | https://raw.githubusercontent.com/Haidra-Org/AI-Horde/main/horde/apis/v2/stable.py | 2026-06-08 | Source splits prompt text on `###` for negative prompt handling |
| Google Imagen docs | https://ai.google.dev/gemini-api/docs/imagen | 2026-06-08 | `last-modified: Tue, 28 Apr 2026 03:23:11 GMT` |
| Google Gemini image generation docs | https://ai.google.dev/gemini-api/docs/image-generation | 2026-06-08 | `last-modified: Fri, 29 May 2026 18:03:14 GMT` |
| Google GenerateContent API | https://ai.google.dev/api/generate-content | 2026-06-08 | `last-modified: Wed, 20 May 2026 18:35:43 GMT` |
| Google Models API | https://ai.google.dev/api/models | 2026-06-08 | `last-modified: Fri, 24 Apr 2026 15:54:31 GMT` |
| OpenAI image generation API | https://developers.openai.com/api/reference/resources/images/methods/generate | 2026-06-08 | `Last-Modified: Fri, 05 Jun 2026 21:39:45 GMT` |
| OpenAI image guide | https://developers.openai.com/api/docs/guides/image-generation | 2026-06-08 | `Last-Modified: Fri, 05 Jun 2026 20:42:23 GMT` |
| OpenAI models list API | https://developers.openai.com/api/reference/resources/models/methods/list | 2026-06-08 | `Last-Modified: Fri, 05 Jun 2026 20:48:09 GMT` |

## Local validation and development standard

- Runtime provider source lives in `src/api/**/*.ts` and related TypeScript modules under `src/`.
- Installable userscript artifacts are generated under `dist/`; generated `.user.js` and `.meta.js` files should not be edited by hand.
- The local compatibility harness is `npm run test:api:red`. It uses mocked userscript requests, test-only keys, and local provider responses rather than live provider calls.
- The standard repository gate is `npm run validate`, which runs TypeScript checking, ESLint, and the Webpack build.
- Existing image snippets in README and provider-reference docs must be preserved exactly during documentation edits.

## Implemented provider behavior

### Pollinations

- Text-to-image requests use `GET https://image.pollinations.ai/prompt/{prompt}`.
- The public/default model is `sana`. Stored legacy selections `flux` and `turbo` are normalized to `sana` for compatibility instead of breaking older user settings.
- Global negative prompts are sent with the `negative_prompt` query parameter instead of being appended into the path prompt.
- Privacy uses the canonical `nofeed=true` query parameter. The old `private=true` parameter is not sent as the primary privacy flag.
- Optional query parameters retained: `token`, `width`, `height`, `seed`, `enhance`, `safe`, and `nologo`.
- Authentication/payment errors now recognize both `auth.pollinations.ai` and `enter.pollinations.ai`, plus HTTP `402` payment-required responses.

**Unresolved provider uncertainty:** Pollinations source and docs differ on parts of the restricted-model/authenticated endpoint story. The userscript keeps provider support and surfaces auth/payment errors instead of removing restricted-model compatibility.

### AI Horde

- Image generation is initiated with `POST https://aihorde.net/api/v2/generate/async`.
- Polling now follows the integration guide: call `GET /api/v2/generate/check/{id}` until the request is done, then call `GET /api/v2/generate/status/{id}` once to fetch full results.
- Requests include a descriptive `Client-Agent` header: `WTR-Lab-Novel-Image-Generator:6.1.1:https://github.com/MasuRii/wtr-lab-novel-image-generator`.
- Global negative prompts are encoded in the prompt using AI Horde's source-backed `###` separator. The unsupported top-level `negative_prompt` payload field is no longer sent.
- Final image results handle both URL strings and raw base64/webp payloads returned in `generations[].img`.

**Unresolved provider uncertainty:** AI Horde Swagger does not expose a top-level negative prompt field for stable image generation. Source inspection shows `###` prompt splitting, so the userscript uses that convention and documents it here.

### Google Imagen and Gemini image generation

- Imagen models continue to use `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:predict` with `instances: [{ prompt }]` and `parameters` for `sampleCount`, `aspectRatio`, `personGeneration`, and supported `imageSize`.
- Imagen 4 Fast omits `imageSize`; Imagen Standard/Ultra use `1K` or `2K`.
- Gemini image models use `POST https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`.
- Current Gemini image model IDs are `gemini-3.1-flash-image`, `gemini-3-pro-image`, and `gemini-2.5-flash-image`. The retired `gemini-3-pro-image-preview` setting is normalized to `gemini-3-pro-image`.
- Gemini image sizing is sent as `generationConfig.responseFormat.image` with `aspectRatio` and `imageSize`; the older local `imageConfig` payload shape is no longer used.
- The userscript does not send `candidateCount` for Gemini image generation because current source-backed image docs did not confirm it as the multiple-output control for image models.
- Google model fetching uses `/v1beta/models?pageSize=1000`, follows `nextPageToken`, and filters/merges results using `supportedGenerationMethods` plus the current image-capable model IDs.

**Unresolved provider uncertainty:** Google API reference and guides have overlapping `imageConfig`/`responseFormat` language. The implementation follows the current image-generation guide shape while preserving Imagen's documented `:predict` path.

### OpenAI-compatible image APIs

- OpenAI-compatible profiles still post to `{baseUrl}/images/generations` with Bearer authentication.
- DALL-E models (`dall-e-2`, `dall-e-3`) keep `response_format: "b64_json"` for compatibility.
- GPT image models omit `response_format` because OpenAI's current docs state GPT image models always return base64 and do not support that parameter.
- Responses are parsed from either `data[].b64_json` or `data[].url`. If `output_format` metadata is present, it is used for the returned data URL MIME type.
- Optional profile fields are supported when present: `size`, `quality`, `output_format`, `background`, and `moderation`.
- Manual model entry remains supported because OpenAI's `/models` response does not reliably identify image capability.

## Validation coverage

The local API compatibility harness in `tests/api-red-tests.cjs` verifies the implemented request shapes without real API keys or provider network calls:

- Pollinations `sana`, `negative_prompt`, and `nofeed=true` behavior.
- AI Horde `/generate/check/{id}` before final `/generate/status/{id}`, plus `Client-Agent`.
- Google Gemini `v1` stable image model normalization and `generationConfig.responseFormat.image` payload.
- OpenAI-compatible GPT image omission of `response_format` while DALL-E keeps `b64_json`.
