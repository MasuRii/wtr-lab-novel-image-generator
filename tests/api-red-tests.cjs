#!/usr/bin/env node
/*
 * RED tests for source-backed Novel Image Generator provider API assumptions.
 *
 * These tests intentionally assert the desired current provider behavior before
 * the implementation is updated. They are dependency-free, use local mocks for
 * userscript globals, and never call real provider networks or require API keys.
 */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { pathToFileURL } = require("node:url");
const ts = require("typescript");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SRC_ROOT = path.join(PROJECT_ROOT, "src");
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "nig-api-red-tests-"));
const TRANSPILED_ROOT = path.join(TEMP_ROOT, "src");
const REQUESTS = [];
const STORAGE = new Map();
const BLOB_URLS = [];
const NativeURL = globalThis.URL;

const DEFAULT_CONFIG = {
  selectedProvider: "Pollinations",
  loggingEnabled: false,
  enhancementEnabled: false,
  enhancementProvider: "gemini",
  enhancementApiKey: "",
  enhancementModel: "models/gemini-2.5-pro",
  enhancementMaxRetriesPerModel: 2,
  enhancementRetryDelay: 1000,
  enhancementModelsFallback: ["models/gemini-2.5-pro"],
  enhancementAlwaysFallback: true,
  enableNegPrompt: true,
  globalNegPrompt:
    "ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality",
  googleApiKey: "test-google-key",
  model: "imagen-4.0-generate-001",
  numberOfImages: 1,
  imageSize: "1024",
  aspectRatio: "1:1",
  personGeneration: "allow_adult",
  aiHordeApiKey: "0000000000",
  aiHordeModel: "AlbedoBase XL (SDXL)",
  aiHordeSampler: "k_dpmpp_2m",
  aiHordeSteps: 25,
  aiHordeCfgScale: 7,
  aiHordeWidth: 512,
  aiHordeHeight: 512,
  aiHordePostProcessing: [],
  aiHordeSeed: "",
  pollinationsModel: "flux",
  pollinationsWidth: 512,
  pollinationsHeight: 512,
  pollinationsSeed: "",
  pollinationsEnhance: true,
  pollinationsNologo: false,
  pollinationsPrivate: false,
  pollinationsSafe: true,
  pollinationsToken: "",
  openAICompatProfiles: {},
  openAICompatActiveProfileUrl: "",
  openAICompatModelManualInput: false,
  historyDays: 30,
};

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function resetHarness(overrides = {}) {
  REQUESTS.length = 0;
  BLOB_URLS.length = 0;
  STORAGE.clear();
  const config = { ...DEFAULT_CONFIG, ...overrides };
  for (const [key, value] of Object.entries(config)) {
    STORAGE.set(key, clone(value));
  }
}

function clone(value) {
  return value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}

function makeCallbacks() {
  const events = [];
  return {
    events,
    onSuccess: (...args) => events.push({ type: "success", args }),
    onFailure: (...args) => events.push({ type: "failure", args }),
    onAuthFailure: (...args) => events.push({ type: "authFailure", args }),
    updateStatus: (...args) => events.push({ type: "status", args }),
  };
}

function findRequest(predicate, message) {
  const request = REQUESTS.find(predicate);
  assert.ok(request, message);
  return request;
}

function parseJsonRequest(request) {
  assert.equal(typeof request.data, "string", `Expected ${request.url} to include JSON request data`);
  return JSON.parse(request.data);
}

function transpileSourceTree() {
  for (const file of walkFiles(SRC_ROOT)) {
    if (!file.endsWith(".ts") || file.endsWith(".d.ts")) {
      continue;
    }

    const relative = path.relative(SRC_ROOT, file);
    const outputFile = path.join(
      TRANSPILED_ROOT,
      relative.replace(/\.ts$/, ".mjs"),
    );
    const source = fs.readFileSync(file, "utf8");
    let outputText = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ES2020,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
      fileName: file,
    }).outputText;

    outputText = rewriteRelativeImports(outputText);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, outputText, "utf8");
  }
}

function walkFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function rewriteRelativeImports(source) {
  return source
    .replace(/(from\s+["']\.\.?\/[^"']+)(["'])/g, "$1.mjs$2")
    .replace(/(import\s*\(\s*["']\.\.?\/[^"']+)(["']\s*\))/g, "$1.mjs$2");
}

async function importModule(relativeFromSrc) {
  const compiled = path.join(
    TRANSPILED_ROOT,
    relativeFromSrc.replace(/\.ts$/, ".mjs"),
  );
  return await import(pathToFileURL(compiled).href);
}

function installGlobals() {
  global.GM_getValue = async (key, defaultValue) =>
    STORAGE.has(key) ? clone(STORAGE.get(key)) : clone(defaultValue);
  global.GM_setValue = async (key, value) => {
    STORAGE.set(key, clone(value));
  };
  global.GM_xmlhttpRequest = (request) => {
    REQUESTS.push(request);
    respondToMockRequest(request);
  };
  global.URL = NativeURL;
  Object.defineProperty(global.URL, "createObjectURL", {
    configurable: true,
    writable: true,
    value: (blob) => {
      const value = `blob:mock-${BLOB_URLS.length + 1}`;
      BLOB_URLS.push({ value, blob });
      return value;
    },
  });
  global.setTimeout = (callback, _delay) => {
    // Keep polling tests deterministic and single-step. Queued callbacks are not
    // auto-run because these RED tests verify the first follow-up request shape.
    return { callback };
  };
}

function respondToMockRequest(request) {
  const response = buildResponse(request);
  queueMicrotask(() => request.onload?.(response));
}

function buildResponse(request) {
  if (request.url === "https://aihorde.net/api/v2/generate/async") {
    return jsonResponse(202, { id: "red-test-generation-id" });
  }
  if (request.url.includes("/api/v2/generate/check/")) {
    return jsonResponse(200, {
      done: true,
      queue_position: 0,
      processing: 0,
      wait_time: 0,
    });
  }
  if (request.url.includes("/api/v2/generate/status/")) {
    return jsonResponse(200, {
      done: true,
      generations: [{ img: "https://example.invalid/generated.webp" }],
      queue_position: 0,
      processing: 0,
      wait_time: 0,
    });
  }
  if (request.url.includes(":generateContent")) {
    return jsonResponse(200, {
      candidates: [
        {
          content: {
            parts: [{ inlineData: { mimeType: "image/png", data: "aW1hZ2U=" } }],
          },
        },
      ],
    });
  }
  if (request.url.endsWith("/images/generations")) {
    return jsonResponse(200, { data: [{ b64_json: "aW1hZ2U=" }] });
  }
  if (request.url.startsWith("https://image.pollinations.ai/prompt/")) {
    return {
      status: 200,
      response: { type: "image/png", size: 1 },
      responseText: "",
    };
  }
  return jsonResponse(200, {});
}

function jsonResponse(status, data) {
  const responseText = JSON.stringify(data);
  return {
    status,
    responseText,
    response: {
      text: async () => responseText,
    },
  };
}

transpileSourceTree();
installGlobals();

test("Pollinations uses current sana model default, nofeed privacy, and negative_prompt query parameter", async () => {
  resetHarness({
    pollinationsModel: "flux",
    pollinationsPrivate: true,
    pollinationsNologo: true,
    pollinationsSafe: true,
    pollinationsEnhance: true,
    pollinationsWidth: 768,
    pollinationsHeight: 512,
    enableNegPrompt: true,
    globalNegPrompt: "low quality, blurry",
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const request = findRequest(
    (entry) => entry.url.startsWith("https://image.pollinations.ai/prompt/"),
    "Pollinations request was not captured",
  );
  const requestUrl = new URL(request.url);
  const decodedPrompt = decodeURIComponent(
    requestUrl.pathname.replace("/prompt/", ""),
  );

  assert.equal(
    decodedPrompt,
    "a luminous castle",
    "Negative prompt should not be appended into the Pollinations path prompt",
  );
  assert.equal(
    requestUrl.searchParams.get("model"),
    "sana",
    "Stored legacy flux/default selection should be normalized to current Pollinations model sana",
  );
  assert.equal(
    requestUrl.searchParams.get("negative_prompt"),
    "low quality, blurry",
    "Pollinations negative prompt should be sent as the source-backed negative_prompt query parameter",
  );
  assert.equal(
    requestUrl.searchParams.get("nofeed"),
    "true",
    "Pollinations privacy should use canonical nofeed=true",
  );
  assert.equal(
    requestUrl.searchParams.has("private"),
    false,
    "Pollinations should not use legacy private=true as the primary privacy parameter",
  );
});

test("AI Horde polls /generate/check before fetching final /generate/status results", async () => {
  resetHarness({
    aiHordeApiKey: "test-horde-key",
    aiHordeModel: "AlbedoBase XL (SDXL)",
    enableNegPrompt: true,
    globalNegPrompt: "bad anatomy",
  });
  const aiHorde = await importModule("api/aiHorde.ts");
  const callbacks = makeCallbacks();

  await aiHorde.generate("a detailed airship", callbacks);
  await flushMicrotasks();

  const urls = REQUESTS.map((entry) => entry.url);
  const asyncIndex = urls.findIndex((url) => url.endsWith("/generate/async"));
  const checkIndex = urls.findIndex((url) => url.includes("/generate/check/red-test-generation-id"));
  const statusIndex = urls.findIndex((url) => url.includes("/generate/status/red-test-generation-id"));

  assert.notEqual(asyncIndex, -1, "AI Horde async request should be sent first");
  assert.notEqual(checkIndex, -1, "AI Horde should poll /generate/check/{id} before status retrieval");
  assert.notEqual(statusIndex, -1, "AI Horde should fetch /generate/status/{id} once check reports done");
  assert.ok(
    asyncIndex < checkIndex && checkIndex < statusIndex,
    `AI Horde polling order should be async -> check -> status, got: ${urls.join(" -> ")}`,
  );

  const asyncRequest = REQUESTS[asyncIndex];
  assert.equal(
    asyncRequest.headers?.["Client-Agent"],
    "WTR-Lab-Novel-Image-Generator:6.1.1:https://github.com/MasuRii/wtr-lab-novel-image-generator",
    "AI Horde requests should include a descriptive Client-Agent header",
  );
});

test("Google Gemini image requests use current image model and responseFormat image sizing without candidateCount", async () => {
  resetHarness({
    model: "gemini-3-pro-image-preview",
    googleApiKey: "test-google-key",
    numberOfImages: "2",
    aspectRatio: "16:9",
    imageSize: "2048",
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  const google = await importModule("api/google.ts");
  const callbacks = makeCallbacks();

  await google.generate("a neon dragon", callbacks);
  await flushMicrotasks();

  const request = findRequest(
    (entry) => entry.url.includes(":generateContent"),
    "Google Gemini generateContent request was not captured",
  );
  const payload = parseJsonRequest(request);

  assert.equal(
    request.url,
    "https://generativelanguage.googleapis.com/v1/models/gemini-3-pro-image:generateContent",
    "Stale Gemini preview image model should be normalized to the current stable v1 model endpoint",
  );
  assert.deepEqual(
    payload.generationConfig?.responseModalities,
    ["IMAGE"],
    "Gemini image generation should request IMAGE modality",
  );
  assert.deepEqual(
    payload.generationConfig?.responseFormat?.image,
    { aspectRatio: "16:9", imageSize: "2K" },
    "Gemini image sizing should use generationConfig.responseFormat.image",
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(payload.generationConfig, "imageConfig"),
    false,
    "Gemini image generation should not use legacy imageConfig payload shape",
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(payload.generationConfig, "candidateCount"),
    false,
    "Gemini image generation should not rely on candidateCount for multiple image output",
  );
});

test("OpenAI-compatible GPT image models omit response_format while DALL-E keeps b64_json", async () => {
  const activeUrl = "https://openai-compatible.example/v1";
  const openAICompat = await importModule("api/openAI.ts");

  resetHarness({
    openAICompatActiveProfileUrl: activeUrl,
    openAICompatProfiles: {
      [activeUrl]: { apiKey: "test-openai-key", model: "gpt-image-2" },
    },
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  await openAICompat.generate("a cinematic robot", activeUrl, makeCallbacks());
  await flushMicrotasks();
  const gptPayload = parseJsonRequest(
    findRequest(
      (entry) => entry.url === `${activeUrl}/images/generations`,
      "OpenAI-compatible GPT image request was not captured",
    ),
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(gptPayload, "response_format"),
    false,
    "GPT image models always return base64 and should omit unsupported response_format",
  );

  resetHarness({
    openAICompatActiveProfileUrl: activeUrl,
    openAICompatProfiles: {
      [activeUrl]: { apiKey: "test-openai-key", model: "dall-e-3" },
    },
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  await openAICompat.generate("a watercolor fox", activeUrl, makeCallbacks());
  await flushMicrotasks();
  const dallePayload = parseJsonRequest(
    findRequest(
      (entry) => entry.url === `${activeUrl}/images/generations`,
      "OpenAI-compatible DALL-E request was not captured",
    ),
  );
  assert.equal(
    dallePayload.response_format,
    "b64_json",
    "DALL-E models should keep response_format=b64_json for compatibility",
  );
});

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

(async () => {
  let failed = 0;
  console.log("RED API compatibility tests for Novel Image Generator");
  console.log(`Tests: ${tests.length}`);
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`ok - ${name}`);
    } catch (error) {
      failed += 1;
      console.log(`not ok - ${name}`);
      console.log(`  ${error.name}: ${error.message}`);
    }
  }
  console.log(`Result: ${tests.length - failed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
})().finally(() => {
  fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
});
