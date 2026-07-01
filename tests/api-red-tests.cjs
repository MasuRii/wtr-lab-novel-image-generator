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
  enhancementBaseUrl: "",
  enhancementApiKey: "",
  enhancementModel: "",
  enhancementModelManualInput: false,
  enhancementMaxRetriesPerModel: 2,
  enhancementRetryDelay: 1000,
  enhancementOverrideProvider: false,
  enhancementAlwaysFallback: true,
  enableNegPrompt: true,
  globalNegPrompt:
    "ugly, blurry, deformed, disfigured, poor details, bad anatomy, low quality",
  aiHordeApiKey: "0000000000",
  aiHordeModel: "AlbedoBase XL (SDXL)",
  aiHordeSampler: "k_dpmpp_2m",
  aiHordeSteps: 25,
  aiHordeCfgScale: 7,
  aiHordeWidth: 512,
  aiHordeHeight: 512,
  aiHordePostProcessing: [],
  aiHordeSeed: "",
  pollinationsModel: "zimage",
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

const MOCK_STATE = {
  chatCompletionsQueue: [],
  autoRespond: true,
  pollinationsGenResponse: null,
  pollinationsLegacyModelUsed: null,
};

function resetHarness(overrides = {}) {
  REQUESTS.length = 0;
  BLOB_URLS.length = 0;
  STORAGE.clear();
  MOCK_STATE.chatCompletionsQueue = [];
  MOCK_STATE.autoRespond = true;
  MOCK_STATE.pollinationsGenResponse = null;
  MOCK_STATE.pollinationsLegacyModelUsed = null;
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
    const handle = {
      _aborted: false,
      abort() {
        this._aborted = true;
      },
    };
    request._handle = handle;
    if (MOCK_STATE.autoRespond) {
      respondToMockRequest(request);
    }
    return handle;
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
  // Mock FileReader for blob -> data URL conversion (Pollinations image
  // persistence fix: legacy endpoint and gen-endpoint remote-URL path).
  global.FileReader = class MockFileReader {
    constructor() {
      this.result = null;
      this.error = null;
      this.onloadend = null;
      this.onerror = null;
    }
    readAsDataURL(blob) {
      queueMicrotask(() => {
        const mimeType = (blob && blob.type) || "image/png";
        this.result = `data:${mimeType};base64,aW1hZ2U=`;
        if (this.onloadend) this.onloadend();
      });
    }
  };
  global.setTimeout = (callback, _delay) => {
    // Auto-run callbacks via microtask so retry/sleep flows are testable.
    // AI Horde polling tests use done=true responses, so recursive polling
    // is not triggered.
    queueMicrotask(() => callback());
    return { callback };
  };
  global.clearTimeout = (_timerId) => {
    // No-op: mock timers auto-run via microtask and cannot be cleared.
  };
}

function respondToMockRequest(request) {
  const response = buildResponse(request);
  queueMicrotask(() => {
    if (request._handle && request._handle._aborted) {
      if (request.onerror) {
        request.onerror({ error: "aborted", status: 0 });
      }
      return;
    }
    request.onload?.(response);
  });
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
  if (request.url === "https://gen.pollinations.ai/v1/images/generations") {
    if (MOCK_STATE.pollinationsGenResponse) {
      return MOCK_STATE.pollinationsGenResponse;
    }
    return jsonResponse(200, { data: [{ b64_json: "aW1hZ2U=" }] });
  }
  if (request.url.endsWith("/images/generations")) {
    return jsonResponse(200, { data: [{ b64_json: "aW1hZ2U=" }] });
  }
  if (request.url.endsWith("/chat/completions")) {
    if (MOCK_STATE.chatCompletionsQueue.length > 0) {
      return MOCK_STATE.chatCompletionsQueue.shift();
    }
    return jsonResponse(200, {
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Enhanced prompt: a beautiful landscape",
          },
          finish_reason: "stop",
        },
      ],
    });
  }
  if (request.url === "https://gen.pollinations.ai/image/models") {
    return jsonResponse(200, [
      { name: "zimage", category: "image", aliases: ["z-image"] },
      { name: "flux", category: "image" },
      { name: "kontext", category: "image" },
      { name: "veo", category: "video" },
      { name: "seedance", category: "video" },
    ]);
  }
  if (request.url.startsWith("https://image.pollinations.ai/prompt/")) {
    const legacyUrl = new URL(request.url);
    const requestedModel = legacyUrl.searchParams.get("model") || "zimage";
    const modelUsed = MOCK_STATE.pollinationsLegacyModelUsed || requestedModel;
    return {
      status: 200,
      response: { type: "image/png", size: 1 },
      responseText: "",
      responseHeaders: `x-model-used: ${modelUsed}\r\nx-auth-status: unauthenticated\r\n`,
    };
  }
  // Secondary fetch for remote image URL -> data URL conversion
  // (Pollinations gen endpoint may return a remote url instead of b64_json).
  if (request.method === "GET" && request.responseType === "blob") {
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

test("Pollinations uses valid model passthrough, canonical private param, and negative_prompt query parameter", async () => {
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
    "flux",
    "Valid Pollinations model 'flux' should pass through without normalization to sana",
  );
  assert.equal(
    requestUrl.searchParams.get("negative_prompt"),
    "low quality, blurry",
    "Pollinations negative prompt should be sent as the negative_prompt query parameter",
  );
  assert.equal(
    requestUrl.searchParams.get("private"),
    "true",
    "Pollinations privacy should use canonical private=true per 2026 API docs",
  );
  assert.equal(
    requestUrl.searchParams.has("nofeed"),
    false,
    "Pollinations should not use legacy nofeed param",
  );
});

test("Pollinations authenticated generation uses POST gen.pollinations.ai endpoint with Bearer auth and selected model", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 768,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a serene landscape", callbacks);
  await flushMicrotasks();

  const request = findRequest(
    (entry) => entry.url === "https://gen.pollinations.ai/v1/images/generations",
    "Authenticated Pollinations generation should use the gen endpoint",
  );
  assert.equal(request.method, "POST", "Authenticated Pollinations generation should use POST");
  assert.equal(
    request.headers?.["Authorization"],
    "Bearer test-pollinations-token",
    "Authenticated Pollinations generation should send Bearer auth header",
  );
  assert.equal(
    request.headers?.["Content-Type"],
    "application/json",
    "Authenticated Pollinations generation should send JSON content type",
  );

  const payload = parseJsonRequest(request);
  assert.equal(payload.model, "gpt-image-2", "Gen endpoint should use the selected model without silent normalization");
  assert.equal(payload.prompt, "a serene landscape", "Gen endpoint prompt should be the cleaned positive prompt");
  assert.equal(payload.n, 1, "Gen endpoint should request a single image");
  assert.equal(payload.size, "768x512", "Gen endpoint size should be derived from configured width and height");

  // No legacy fallback request should be made when authenticated
  const legacyRequests = REQUESTS.filter((entry) =>
    entry.url.startsWith("https://image.pollinations.ai/prompt/"),
  );
  assert.equal(
    legacyRequests.length,
    0,
    "Authenticated Pollinations generation must not fall back to the legacy endpoint",
  );
});

test("Pollinations authenticated generation inlines negative prompt into gen endpoint payload", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 1024,
    pollinationsHeight: 1024,
    enableNegPrompt: true,
    globalNegPrompt: "low quality, blurry",
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a cinematic robot", callbacks);
  await flushMicrotasks();

  const request = findRequest(
    (entry) => entry.url === "https://gen.pollinations.ai/v1/images/generations",
    "Authenticated Pollinations generation should use the gen endpoint",
  );
  const payload = parseJsonRequest(request);
  assert.ok(
    payload.prompt.includes("negative prompt: low quality, blurry"),
    "Gen endpoint payload should inline the negative prompt (OpenAI-compatible API has no negative_prompt field)",
  );
  assert.equal(payload.size, "1024x1024");
});

test("Pollinations authenticated generation parses b64_json and reports success with selected model", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const success = callbacks.events.find((e) => e.type === "success");
  assert.ok(success, "Authenticated gen success should call onSuccess");
  assert.deepEqual(
    success.args[0],
    ["data:image/png;base64,aW1hZ2U="],
    "Gen success should convert b64_json to a data URL",
  );
  assert.equal(success.args[1], "a luminous castle", "onSuccess should receive the cleaned prompt");
  assert.equal(success.args[2], "Pollinations", "onSuccess provider should be Pollinations");
  assert.equal(success.args[3], "gpt-image-2", "onSuccess should report the selected model, not a fallback model");
  assert.equal(success.args.length, 4, "Gen success must not pass persistentUrls (5th arg); data URLs are already persistent and must flow into history");
});

test("Pollinations gen endpoint converts remote image URL to data URL before success", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  MOCK_STATE.pollinationsGenResponse = jsonResponse(200, {
    data: [{ url: "https://gen.pollinations.ai/image/test-remote.png" }],
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const success = callbacks.events.find((e) => e.type === "success");
  assert.ok(success, "Gen endpoint with remote URL should still report success");
  assert.equal(success.args.length, 4, "Gen success must not pass persistentUrls; converted data URL is already persistent");
  assert.ok(
    String(success.args[0][0]).startsWith("data:"),
    "Gen endpoint remote URL should be converted to a persistent data URL before success",
  );
  assert.ok(
    !String(success.args[0][0]).startsWith("https://"),
    "Gen success must never pass a remote URL that would 404 in history",
  );
});

test("Pollinations authenticated generation reports auth failure on 401 from gen endpoint", async () => {
  resetHarness({
    pollinationsToken: "invalid-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  MOCK_STATE.pollinationsGenResponse = jsonResponse(401, {
    success: false,
    error: {
      message: "Authentication required. Please provide a valid API key.",
      code: "UNAUTHORIZED",
    },
    status: 401,
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const authFailure = callbacks.events.find((e) => e.type === "authFailure");
  assert.ok(authFailure, "401 from gen endpoint should call onAuthFailure");
  assert.equal(
    authFailure.args[0],
    "Authentication required. Please provide a valid API key.",
    "onAuthFailure should receive the error message from the gen endpoint envelope",
  );
  assert.equal(callbacks.events.some((e) => e.type === "success"), false, "401 must not report success");
});

test("Pollinations authenticated generation reports model error and clears cache on gen endpoint model error", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "nonexistent-model-xyz",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  // Pre-populate cache with a pollinations entry so clearing is detectable
  STORAGE.set("cachedModels", JSON.stringify({
    pollinations: { models: ["nonexistent-model-xyz"], timestamp: Date.now(), endpoint: "https://gen.pollinations.ai/image/models", schemaVersion: 99 },
    aiHorde: { models: ["AlbedoBase XL (SDXL)"] },
  }));
  MOCK_STATE.pollinationsGenResponse = jsonResponse(400, {
    success: false,
    error: {
      message: "Model not found: nonexistent-model-xyz",
      code: "model_not_found",
    },
    status: 400,
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const failure = callbacks.events.find((e) => e.type === "failure");
  assert.ok(failure, "Model error from gen endpoint should call onFailure");
  assert.ok(
    failure.args[0].includes("Model not found"),
    "onFailure should include the gen endpoint error message",
  );
  assert.equal(callbacks.events.some((e) => e.type === "success"), false, "Model error must not report success");
  const stored = JSON.parse(STORAGE.get("cachedModels") || "{}");
  assert.ok(!stored.pollinations, "Model error should clear the cached Pollinations model entry");
  assert.ok(stored.aiHorde, "Clearing should only remove the affected provider, not all cached models");
});

test("Pollinations free generation errors on X-Model-Used mismatch instead of silent success", async () => {
  resetHarness({
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  // No token -> legacy free path. Simulate the silent Sana fallback: the
  // server returns 200 but used a different model than requested.
  MOCK_STATE.pollinationsLegacyModelUsed = "sana";
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const failure = callbacks.events.find((e) => e.type === "failure");
  assert.ok(failure, "Silent model mismatch on the legacy path should call onFailure, not onSuccess");
  assert.ok(
    failure.args[0].includes("sana"),
    "Mismatch failure message should name the model actually used",
  );
  assert.ok(
    failure.args[0].includes("gpt-image-2"),
    "Mismatch failure message should name the requested model",
  );
  assert.equal(callbacks.events.some((e) => e.type === "success"), false, "Model mismatch must not report success with the wrong model");
});

test("Pollinations free generation succeeds when X-Model-Used matches requested model", async () => {
  resetHarness({
    pollinationsModel: "flux",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  // No token -> legacy free path. Server honors the requested model.
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const success = callbacks.events.find((e) => e.type === "success");
  assert.ok(success, "Matching X-Model-Used should report success");
  assert.equal(success.args[3], "flux", "onSuccess should report the requested model");
  assert.equal(success.args.length, 4, "Legacy success must not pass persistentUrls (5th arg); image content is preserved as a data URL");
  assert.ok(
    String(success.args[0][0]).startsWith("data:"),
    "Legacy free success should pass a persistent data URL, not a session-only blob URL",
  );
});

test("Pollinations authenticated generation does not fall back to legacy endpoint when gen endpoint fails", async () => {
  resetHarness({
    pollinationsToken: "test-pollinations-token",
    pollinationsModel: "gpt-image-2",
    pollinationsWidth: 512,
    pollinationsHeight: 512,
    enableNegPrompt: false,
    globalNegPrompt: "",
  });
  // Gen endpoint returns a 500 server error
  MOCK_STATE.pollinationsGenResponse = jsonResponse(500, {
    success: false,
    error: { message: "Internal server error", code: "INTERNAL" },
    status: 500,
  });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();

  await pollinations.generate("a luminous castle", callbacks);
  await flushMicrotasks();

  const failure = callbacks.events.find((e) => e.type === "failure");
  assert.ok(failure, "Gen endpoint failure should call onFailure");
  assert.equal(callbacks.events.some((e) => e.type === "success"), false, "Gen endpoint failure must not report success");
  const legacyRequests = REQUESTS.filter((entry) =>
    entry.url.startsWith("https://image.pollinations.ai/prompt/"),
  );
  assert.equal(
    legacyRequests.length,
    0,
    "Gen endpoint failure must not silently fall back to the legacy endpoint",
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
    "WTR-Lab-Novel-Image-Generator:6.2.0:https://github.com/MasuRii/wtr-lab-novel-image-generator",
    "AI Horde requests should include a descriptive Client-Agent header",
  );
});

test("Google image provider module is removed and cannot be imported", async () => {
  let importFailed = false;
  try {
    await importModule("api/google.ts");
  } catch (e) {
    importFailed = true;
  }
  assert.equal(
    importFailed,
    true,
    "api/google.ts module should be deleted and not importable after Google provider removal",
  );
});

test("No legacy enhancement provider references remain in source or docs", () => {
  // Forbidden tokens are assembled at runtime so this test file itself
  // contains no literal legacy-provider name references.
  const legacyToken = ["g", "e", "m", "i", "n", "i"].join("");
  const forbidden = [
    legacyToken,
    ["generativel", "anguage"].join(""),
    "nig-" + legacyToken,
    ["aistudio", ".google"].join(""),
    "enhancePromptWith" + legacyToken.charAt(0).toUpperCase() + legacyToken.slice(1),
  ];

  const checkFiles = [
    ...walkFiles(SRC_ROOT).filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".d.ts"),
    ),
    path.join(PROJECT_ROOT, "CHANGELOG.md"),
    path.join(PROJECT_ROOT, "README.md"),
    path.join(PROJECT_ROOT, "GREASYFORK_README.md"),
    path.join(PROJECT_ROOT, "package.json"),
  ].filter((f) => fs.existsSync(f));

  const offenders = [];
  for (const file of checkFiles) {
    const content = fs.readFileSync(file, "utf8").toLowerCase();
    for (const pattern of forbidden) {
      if (content.includes(pattern.toLowerCase())) {
        offenders.push(`${path.relative(PROJECT_ROOT, file)}: ${pattern}`);
      }
    }
  }

  assert.equal(
    offenders.length,
    0,
    `Forbidden legacy-provider references found:\n${offenders.join("\n")}`,
  );
});

test("OpenAI-compatible enhancement calls /chat/completions with messages array and Bearer auth", async () => {
  const baseUrl = "https://openai-enhance.example/v1";
  resetHarness();
  const enhancement = await importModule("api/enhancement.ts");
  const config = {
    ...DEFAULT_CONFIG,
    enhancementBaseUrl: baseUrl,
    enhancementApiKey: "test-enhance-key",
    enhancementModel: "gpt-4o-mini",
    enhancementEnabled: true,
    enhancementAlwaysFallback: false,
    enhancementMaxRetriesPerModel: 2,
    enhancementRetryDelay: 1000,
    enhancementTemplate: "Extract visual elements.",
    mainPromptStyle: "None",
    subPromptStyle: "none",
    customStyleEnabled: false,
    customStyleText: "",
  };

  const result = await enhancement.enhancePrompt(
    "a beautiful landscape",
    config,
  );

  const request = findRequest(
    (entry) => entry.url === `${baseUrl}/chat/completions`,
    "Enhancement request to /chat/completions was not captured",
  );

  assert.equal(request.method, "POST", "Enhancement should use POST");
  assert.equal(
    request.headers?.["Authorization"],
    "Bearer test-enhance-key",
    "Enhancement should send Bearer auth header when API key is provided",
  );
  assert.equal(
    request.headers?.["Content-Type"],
    "application/json",
    "Enhancement should send JSON content type",
  );

  const payload = parseJsonRequest(request);
  assert.equal(
    payload.model,
    "gpt-4o-mini",
    "Enhancement should send configured model",
  );
  assert.ok(
    Array.isArray(payload.messages),
    "Enhancement should send messages array",
  );
  assert.equal(
    payload.messages.length,
    2,
    "Enhancement should send system + user messages",
  );
  assert.equal(
    payload.messages[0].role,
    "system",
    "First message should be system role",
  );
  assert.equal(
    payload.messages[1].role,
    "user",
    "Second message should be user role",
  );
  assert.equal(
    payload.stream,
    false,
    "Enhancement should disable streaming",
  );
  assert.equal(
    result,
    "Enhanced prompt: a beautiful landscape",
    "Enhancement should return choices[0].message.content from response",
  );
});

test("OpenAI-compatible enhancement omits Authorization header when no API key", async () => {
  const baseUrl = "http://127.0.0.1:11434/v1";
  resetHarness();
  const enhancement = await importModule("api/enhancement.ts");
  const config = {
    ...DEFAULT_CONFIG,
    enhancementBaseUrl: baseUrl,
    enhancementApiKey: "",
    enhancementModel: "llama3.1",
    enhancementEnabled: true,
    enhancementAlwaysFallback: false,
    enhancementMaxRetriesPerModel: 2,
    enhancementRetryDelay: 1000,
    enhancementTemplate: "Extract visual elements.",
    mainPromptStyle: "None",
    subPromptStyle: "none",
    customStyleEnabled: false,
    customStyleText: "",
  };

  await enhancement.enhancePrompt("a serene mountain", config);

  const request = findRequest(
    (entry) => entry.url === `${baseUrl}/chat/completions`,
    "Enhancement request to /chat/completions was not captured",
  );

  assert.equal(
    Object.prototype.hasOwnProperty.call(request.headers || {}, "Authorization"),
    false,
    "Enhancement should omit Authorization header when no API key is set (local no-auth servers)",
  );
});

test("shouldUseProviderEnhancement preserves Pollinations built-in enhancement priority", async () => {
  resetHarness();
  const enhancement = await importModule("api/enhancement.ts");

  const pollinationsResult = enhancement.shouldUseProviderEnhancement(
    "Pollinations",
    { pollinationsEnhance: true },
  );
  assert.equal(
    pollinationsResult,
    true,
    "Pollinations with pollinationsEnhance=true should report provider enhancement active",
  );

  const hordeResult = enhancement.shouldUseProviderEnhancement(
    "AIHorde",
    { pollinationsEnhance: true },
  );
  assert.equal(
    hordeResult,
    false,
    "AIHorde should not report provider enhancement active",
  );

  const pollinationsDisabled = enhancement.shouldUseProviderEnhancement(
    "Pollinations",
    { pollinationsEnhance: false },
  );
  assert.equal(
    pollinationsDisabled,
    false,
    "Pollinations with pollinationsEnhance=false should not report provider enhancement active",
  );
});

test("OpenAI-compatible image models omit response_format for all models after DALL-E removal", async () => {
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
    Object.prototype.hasOwnProperty.call(dallePayload, "response_format"),
    false,
    "DALL-E support removed: response_format should not be sent for any model",
  );
});

test("Enhancement model discovery parses OpenAI-compatible /models response shapes", async () => {
  const models = await importModule("api/models.ts");

  // Shape 1: { data: [...] } (OpenAI standard)
  let result = models.parseEnhancementModelsResponse({
    data: [{ id: "gpt-4o-mini" }, { id: "gpt-4o" }],
  });
  assert.deepEqual(
    result,
    ["gpt-4o", "gpt-4o-mini"],
    "OpenAI {data} shape should extract and sort ids",
  );

  // Shape 2: bare array of objects
  result = models.parseEnhancementModelsResponse([
    { id: "llama3.1" },
    { id: "qwen2.5-instruct" },
  ]);
  assert.deepEqual(
    result,
    ["llama3.1", "qwen2.5-instruct"],
    "Bare array shape should extract ids",
  );

  // Shape 3: { models: [...] } with name field (Ollama-style)
  result = models.parseEnhancementModelsResponse({
    models: [{ name: "phi-3" }, { name: "mistral" }],
  });
  assert.deepEqual(
    result,
    ["mistral", "phi-3"],
    "{models} shape with name field should extract and sort ids",
  );

  // Shape 4: bare array of strings
  result = models.parseEnhancementModelsResponse(["zephyr", "aquila"]);
  assert.deepEqual(result, ["aquila", "zephyr"], "Bare string array should be sorted");

  // Shape 5: empty/invalid → empty array
  assert.deepEqual(
    models.parseEnhancementModelsResponse({}),
    [],
    "Empty object should return empty array",
  );
  assert.deepEqual(
    models.parseEnhancementModelsResponse(null),
    [],
    "Null should return empty array",
  );
});

test("Enhancement model discovery filters non-chat models but preserves local LLMs with minimal metadata", async () => {
  const models = await importModule("api/models.ts");

  // Name-based filtering (no explicit metadata — typical for cloud + local)
  const result = models.parseEnhancementModelsResponse({
    data: [
      { id: "gpt-4o-mini" },
      { id: "text-embedding-3-small" },
      { id: "tts-1" },
      { id: "whisper-1" },
      { id: "gpt-image-1" },
      { id: "llama3.1" },
      { id: "qwen2.5-instruct" },
    ],
  });
  assert.ok(result.includes("gpt-4o-mini"), "Chat models should be included");
  assert.ok(
    result.includes("llama3.1"),
    "Local LLMs with minimal metadata should be included",
  );
  assert.ok(result.includes("qwen2.5-instruct"), "Local LLMs should be included");
  assert.ok(
    !result.includes("text-embedding-3-small"),
    "Embedding models should be excluded",
  );
  assert.ok(!result.includes("tts-1"), "TTS models should be excluded");
  assert.ok(!result.includes("whisper-1"), "Whisper models should be excluded");
  assert.ok(!result.includes("gpt-image-1"), "Image models should be excluded");

  // Explicit type metadata filtering
  const metaResult = models.parseEnhancementModelsResponse({
    data: [
      { id: "chat-model", type: "chat" },
      { id: "img-model", type: "image" },
      { id: "embed-model", type: "embedding" },
    ],
  });
  assert.ok(
    metaResult.includes("chat-model"),
    "Explicit chat type should be included",
  );
  assert.ok(
    !metaResult.includes("img-model"),
    "Explicit image type should be excluded",
  );
  assert.ok(
    !metaResult.includes("embed-model"),
    "Explicit embedding type should be excluded",
  );
});

test("Enhancement model discovery omits Authorization header for no-auth local servers", async () => {
  const models = await importModule("api/models.ts");

  const noAuth = models.buildEnhancementModelsRequest(
    "http://127.0.0.1:11434/v1",
    "",
  );
  assert.equal(
    noAuth.url,
    "http://127.0.0.1:11434/v1/models",
    "URL should append /models to base URL",
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(noAuth.headers, "Authorization"),
    false,
    "Authorization header should be omitted when API key is empty (local no-auth servers)",
  );

  const withAuth = models.buildEnhancementModelsRequest(
    "https://api.openai.com/v1",
    "sk-test-key",
  );
  assert.equal(withAuth.url, "https://api.openai.com/v1/models");
  assert.equal(
    withAuth.headers["Authorization"],
    "Bearer sk-test-key",
    "Bearer auth should be sent when API key is provided",
  );
});

test("AI Horde top models are derived from live API metadata, not hardcoded TOP_MODELS", async () => {
  const models = await importModule("api/models.ts");

  // Use model names NOT present in any hardcoded list, with varying worker counts
  const apiModels = [
    { name: "FreshModelA", count: 100 },
    { name: "FreshModelB", count: 50 },
    { name: "FreshModelC", count: 10 },
    { name: "FreshModelD", count: 75 },
  ];

  const grouped = models.groupAIHordeModels(apiModels);
  assert.ok(Array.isArray(grouped.top), "groupAIHordeModels should return a top array");
  assert.ok(
    Array.isArray(grouped.other),
    "groupAIHordeModels should return an other array",
  );
  assert.equal(
    grouped.top[0].name,
    "FreshModelA",
    "Top group should be sorted by worker count descending (highest first)",
  );
  assert.equal(grouped.top[0].count, 100);
  assert.equal(
    grouped.top[1].name,
    "FreshModelD",
    "Second in top group should be the second-highest worker count",
  );
  assert.equal(grouped.top[2].name, "FreshModelB");
  assert.equal(grouped.top[3].name, "FreshModelC");
});

test("AI Horde model grouping source no longer references stale TOP_MODELS hardcoded list", () => {
  const modelsSource = fs.readFileSync(
    path.join(SRC_ROOT, "api/models.ts"),
    "utf8",
  );
  assert.ok(
    !modelsSource.includes("TOP_MODELS"),
    "api/models.ts should not reference the stale hardcoded TOP_MODELS list",
  );
});

test("Pollinations normalizes legacy sana model to zimage", async () => {
  resetHarness({ pollinationsModel: "sana" });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();
  await pollinations.generate("test prompt", callbacks);
  await flushMicrotasks();
  const request = findRequest(
    (entry) => entry.url.startsWith("https://image.pollinations.ai/prompt/"),
    "Pollinations sana request was not captured",
  );
  assert.equal(
    new URL(request.url).searchParams.get("model"),
    "zimage",
    "Legacy model 'sana' should be normalized to 'zimage'",
  );
});

test("Pollinations normalizes legacy turbo model to zimage", async () => {
  resetHarness({ pollinationsModel: "turbo" });
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();
  await pollinations.generate("test prompt", callbacks);
  await flushMicrotasks();
  const request = findRequest(
    (entry) => entry.url.startsWith("https://image.pollinations.ai/prompt/"),
    "Pollinations turbo request was not captured",
  );
  assert.equal(
    new URL(request.url).searchParams.get("model"),
    "zimage",
    "Legacy model 'turbo' should be normalized to 'zimage'",
  );
});

test("Pollinations model fetch source uses gen.pollinations.ai/image/models endpoint", () => {
  const source = fs.readFileSync(path.join(SRC_ROOT, "api/models.ts"), "utf8");
  assert.ok(
    source.includes("https://gen.pollinations.ai/image/models"),
    "api/models.ts should fetch from gen.pollinations.ai/image/models",
  );
  assert.ok(
    !source.includes("https://image.pollinations.ai/models"),
    "api/models.ts should not use the deprecated image.pollinations.ai/models endpoint",
  );
});

test("Pollinations model fetch parses object responses and filters image models", async () => {
  const models = await importModule("api/models.ts");
  const result = models.parsePollinationsModelsResponse([
    { name: "zimage", category: "image" },
    { name: "flux", category: "image" },
    { name: "veo", category: "video" },
    { name: "kontext", category: "image" },
    { name: "seedance", category: "video" },
  ]);
  assert.ok(result.includes("zimage"), "Image model zimage should be included");
  assert.ok(result.includes("flux"), "Image model flux should be included");
  assert.ok(result.includes("kontext"), "Image model kontext should be included");
  assert.ok(!result.includes("veo"), "Video model veo should be excluded");
  assert.ok(!result.includes("seedance"), "Video model seedance should be excluded");
});

test("Default config uses OpenCode Zen for enhancement with big-pickle model", async () => {
  const defaults = await importModule("config/defaults.ts");
  assert.equal(defaults.DEFAULTS.enhancementEnabled, true, "Enhancement should be enabled by default");
  assert.equal(defaults.DEFAULTS.enhancementBaseUrl, "https://opencode.ai/zen/v1", "Default enhancement base URL should be OpenCode Zen");
  assert.equal(defaults.DEFAULTS.enhancementModel, "big-pickle", "Default enhancement model should be big-pickle");
  assert.equal(defaults.DEFAULTS.enhancementApiKey, "", "Default enhancement API key should be empty for free models");
});

test("Default Pollinations model is zimage, not sana", async () => {
  const defaults = await importModule("config/defaults.ts");
  assert.equal(defaults.DEFAULTS.pollinationsModel, "zimage", "Default Pollinations model should be zimage");
});

test("Zen free-model filtering identifies big-pickle and free-suffixed models as free", async () => {
  const models = await importModule("api/models.ts");
  assert.ok(models.isZenFreeModel("big-pickle"), "big-pickle should be identified as free");
  assert.ok(models.isZenFreeModel("deepseek-v4-flash-free"), "Models with 'free' in ID should be identified as free");
  assert.ok(models.isZenFreeModel("mimo-v2.5-free"), "Models with 'free' in ID should be identified as free");
  assert.ok(!models.isZenFreeModel("gpt-5.5"), "Paid models should not be identified as free");
  assert.ok(!models.isZenFreeModel("claude-fable-5"), "Paid models should not be identified as free");
});

test("Zen endpoint detection identifies opencode.ai/zen URLs", async () => {
  const models = await importModule("api/models.ts");
  assert.ok(models.isZenEndpoint("https://opencode.ai/zen/v1"), "opencode.ai/zen/v1 should be detected as Zen");
  assert.ok(models.isZenEndpoint("https://opencode.ai/zen/v1/"), "Trailing slash should not affect Zen detection");
  assert.ok(!models.isZenEndpoint("https://api.openai.com/v1"), "OpenAI should not be detected as Zen");
  assert.ok(!models.isZenEndpoint("http://127.0.0.1:11434/v1"), "Local servers should not be detected as Zen");
});

test("Enhancement model discovery filters Zen models to free-only when no API key", async () => {
  const models = await importModule("api/models.ts");
  const zenModels = {
    data: [
      { id: "big-pickle" },
      { id: "deepseek-v4-flash-free" },
      { id: "gpt-5.5" },
      { id: "claude-fable-5" },
      { id: "mimo-v2.5-free" },
    ],
  };
  // With Zen free-only filter (no API key)
  const freeOnly = models.parseEnhancementModelsResponse(zenModels, { zenFreeOnly: true });
  assert.ok(freeOnly.includes("big-pickle"), "big-pickle should be included in free-only filter");
  assert.ok(freeOnly.includes("deepseek-v4-flash-free"), "Free models should be included");
  assert.ok(freeOnly.includes("mimo-v2.5-free"), "Free models should be included");
  assert.ok(!freeOnly.includes("gpt-5.5"), "Paid models should be excluded in free-only filter");
  assert.ok(!freeOnly.includes("claude-fable-5"), "Paid models should be excluded in free-only filter");

  // Without filter (API key present) - all models shown
  const allModels = models.parseEnhancementModelsResponse(zenModels, { zenFreeOnly: false });
  assert.ok(allModels.includes("big-pickle"), "big-pickle should be included when key present");
  assert.ok(allModels.includes("gpt-5.5"), "Paid models should be included when key present");
  assert.ok(allModels.includes("claude-fable-5"), "Paid models should be included when key present");
});

test("Enhancement parseRetryAfter extracts delay from Retry-After header", async () => {
  const enhancement = await importModule("api/enhancement.ts");
  // With Retry-After header
  const withHeader = enhancement.parseRetryAfter({
    responseHeaders: "HTTP/1.1 429\r\nretry-after: 5\r\nContent-Type: application/json\r\n",
  });
  assert.equal(withHeader, 5000, "Retry-After: 5 should return 5000ms");
  // Without Retry-After header
  const withoutHeader = enhancement.parseRetryAfter({
    responseHeaders: "HTTP/1.1 429\r\nContent-Type: application/json\r\n",
  });
  assert.equal(withoutHeader, null, "No Retry-After header should return null");
  // With invalid Retry-After
  const invalid = enhancement.parseRetryAfter({
    responseHeaders: "retry-after: abc\r\n",
  });
  assert.equal(invalid, null, "Invalid Retry-After should return null");
  // Empty response
  assert.equal(enhancement.parseRetryAfter(null), null, "Null response should return null");
});

test("Enhancement retries on HTTP 429 with Retry-After backoff", async () => {
  const baseUrl = "https://opencode.ai/zen/v1";
  resetHarness();
  const enhancement = await importModule("api/enhancement.ts");
  const config = {
    ...DEFAULT_CONFIG,
    enhancementBaseUrl: baseUrl,
    enhancementApiKey: "",
    enhancementModel: "big-pickle",
    enhancementEnabled: true,
    enhancementAlwaysFallback: false,
    enhancementMaxRetriesPerModel: 3,
    enhancementRetryDelay: 100,
    enhancementTemplate: "Extract visual elements.",
    mainPromptStyle: "None",
    subPromptStyle: "none",
    customStyleEnabled: false,
    customStyleText: "",
  };
  // Queue: 429 (rate limited) -> 200 (success)
  MOCK_STATE.chatCompletionsQueue = [
    {
      status: 429,
      responseText: JSON.stringify({ error: { message: "Rate limited" } }),
      responseHeaders: "retry-after: 1\r\n",
      response: { text: async () => JSON.stringify({ error: { message: "Rate limited" } }) },
    },
    jsonResponse(200, {
      choices: [{ message: { content: "Enhanced prompt" } }],
    }),
  ];
  const result = await enhancement.enhancePrompt("a beautiful landscape", config);
  // Should have made 2 requests (first 429, second 200)
  const chatRequests = REQUESTS.filter((r) => r.url === `${baseUrl}/chat/completions`);
  assert.equal(chatRequests.length, 2, "Enhancement should retry after 429");
  assert.equal(result, "Enhanced prompt", "Enhancement should return the successful response after retry");
});

test("No broken auth.pollinations.ai URLs remain in source", () => {
  const checkFiles = walkFiles(SRC_ROOT).filter(
    (f) => f.endsWith(".ts") && !f.endsWith(".d.ts"),
  );
  const offenders = [];
  for (const file of checkFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("auth.pollinations.ai")) {
      offenders.push(path.relative(PROJECT_ROOT, file));
    }
  }
  assert.equal(
    offenders.length,
    0,
    `Broken auth.pollinations.ai references found in:\n${offenders.join("\n")}`,
  );
});

test("Abort registry tracks and aborts active requests", async () => {
  const abortRegistry = await importModule("utils/abortRegistry.ts");
  const handle = { _aborted: false, abort() { this._aborted = true; } };
  abortRegistry.trackRequest(handle);
  assert.ok(abortRegistry.hasActive(), "Should have active request after tracking");
  const tokenBefore = abortRegistry.getCancelToken();
  const count = abortRegistry.abortAll();
  assert.ok(count >= 1, "Should abort at least 1 request");
  assert.equal(handle._aborted, true, "Handle should be aborted");
  assert.ok(!abortRegistry.hasActive(), "Should have no active requests after abort");
  assert.notEqual(abortRegistry.getCancelToken(), tokenBefore, "Cancel token should change after abort");
});

test("Cancel during Pollinations generation prevents success callback", async () => {
  resetHarness({ pollinationsModel: "zimage" });
  MOCK_STATE.autoRespond = false;
  const abortRegistry = await importModule("utils/abortRegistry.ts");
  const pollinations = await importModule("api/pollinations.ts");
  const callbacks = makeCallbacks();
  // Start generation - XHR is made but response is NOT auto-sent
  await pollinations.generate("a test prompt", callbacks);
  // Cancel before the response arrives
  abortRegistry.abortAll();
  // Now manually trigger the response — mock sees _aborted=true, calls onerror
  const request = findRequest(
    (entry) => entry.url.startsWith("https://image.pollinations.ai/prompt/"),
    "Pollinations request was not captured",
  );
  respondToMockRequest(request);
  await flushMicrotasks();
  assert.equal(
    callbacks.events.length,
    0,
    "No success/failure callbacks should fire after cancel",
  );
});

// =========================================================================
// Cache TTL / Schema Migration Tests
// =========================================================================

test("CACHE_EXPIRATION_MS is consumed in cache logic, not just defined", () => {
  const cacheSource = fs.readFileSync(
    path.join(SRC_ROOT, "utils/cache.ts"),
    "utf8",
  );
  const matches = cacheSource.match(/CACHE_EXPIRATION_MS/g);
  assert.ok(
    matches && matches.length >= 2,
    "CACHE_EXPIRATION_MS should be referenced at least twice (definition + usage)",
  );
});

test("Cache exports CACHE_SCHEMA_VERSION constant", async () => {
  const cache = await importModule("utils/cache.ts");
  assert.ok(
    typeof cache.CACHE_SCHEMA_VERSION === "number",
    "CACHE_SCHEMA_VERSION should be exported as a number",
  );
  assert.ok(
    cache.CACHE_SCHEMA_VERSION >= 2,
    "CACHE_SCHEMA_VERSION should be at least 2 for timestamped schema",
  );
});

test("setCachedModels stores timestamp, endpoint, and schemaVersion", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  await cache.setCachedModels(
    "pollinations",
    ["zimage", "flux"],
    "https://gen.pollinations.ai/image/models",
  );

  const stored = JSON.parse(STORAGE.get("cachedModels"));
  assert.ok(stored.pollinations, "Cache entry should exist for pollinations");
  assert.equal(
    typeof stored.pollinations.timestamp,
    "number",
    "Cache entry should have a numeric timestamp",
  );
  assert.equal(
    stored.pollinations.endpoint,
    "https://gen.pollinations.ai/image/models",
    "Cache entry should store the endpoint URL",
  );
  assert.equal(
    stored.pollinations.schemaVersion,
    cache.CACHE_SCHEMA_VERSION,
    "Cache entry should have current schema version",
  );
  assert.deepEqual(
    stored.pollinations.models,
    ["zimage", "flux"],
    "Cache entry should store the models array",
  );
});

test("getCachedModelsForProvider returns models for valid fresh cache with matching endpoint", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  await cache.setCachedModels(
    "pollinations",
    ["zimage", "flux"],
    "https://gen.pollinations.ai/image/models",
  );

  const result = await cache.getCachedModelsForProvider(
    "pollinations",
    "https://gen.pollinations.ai/image/models",
  );
  assert.deepEqual(
    result,
    ["zimage", "flux"],
    "Fresh cache with matching endpoint should return models",
  );
});

test("getCachedModelsForProvider returns null for expired cache entries", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  const expiredCache = {
    pollinations: {
      models: ["zimage"],
      timestamp: Date.now() - cache.CACHE_EXPIRATION_MS - 1,
      endpoint: "https://gen.pollinations.ai/image/models",
      schemaVersion: cache.CACHE_SCHEMA_VERSION,
    },
  };
  STORAGE.set("cachedModels", JSON.stringify(expiredCache));

  const result = await cache.getCachedModelsForProvider(
    "pollinations",
    "https://gen.pollinations.ai/image/models",
  );
  assert.equal(result, null, "Expired cache should return null");
});

test("getCachedModelsForProvider returns null for legacy bare-array cache shape", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  const legacyCache = {
    pollinations: ["zimage", "flux"],
  };
  STORAGE.set("cachedModels", JSON.stringify(legacyCache));

  const result = await cache.getCachedModelsForProvider("pollinations");
  assert.equal(
    result,
    null,
    "Legacy bare-array cache should be treated as a cache miss",
  );
});

test("getCachedModelsForProvider returns null when endpoint changes", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  await cache.setCachedModels(
    "pollinations",
    ["zimage"],
    "https://old-endpoint.example/models",
  );

  const result = await cache.getCachedModelsForProvider(
    "pollinations",
    "https://new-endpoint.example/models",
  );
  assert.equal(
    result,
    null,
    "Cache should be invalidated when endpoint changes",
  );
});

test("getCachedModelsForProvider returns null for wrong schemaVersion", async () => {
  resetHarness();
  const cache = await importModule("utils/cache.ts");
  const wrongVersionCache = {
    pollinations: {
      models: ["zimage"],
      timestamp: Date.now(),
      endpoint: "https://gen.pollinations.ai/image/models",
      schemaVersion: 1,
    },
  };
  STORAGE.set("cachedModels", JSON.stringify(wrongVersionCache));

  const result = await cache.getCachedModelsForProvider(
    "pollinations",
    "https://gen.pollinations.ai/image/models",
  );
  assert.equal(
    result,
    null,
    "Cache with wrong schemaVersion should be treated as a miss",
  );
});

// =========================================================================
// Zen Default Migration Tests
// =========================================================================

test("migrateConfig upgrades empty enhancement settings to Zen defaults", async () => {
  const migration = await importModule("config/migration.ts");
  const defaults = await importModule("config/defaults.ts");

  const staleConfig = {
    ...defaults.DEFAULTS,
    enhancementBaseUrl: "",
    enhancementModel: "",
    enhancementModelManualInput: true,
    configSchemaVersion: 1,
  };

  const migrated = migration.migrateConfig(staleConfig);
  assert.equal(
    migrated.enhancementBaseUrl,
    "https://opencode.ai/zen/v1",
    "Empty enhancementBaseUrl should be migrated to Zen",
  );
  assert.equal(
    migrated.enhancementModel,
    "big-pickle",
    "Empty enhancementModel should be migrated to Zen default",
  );
  assert.equal(
    migrated.enhancementModelManualInput,
    false,
    "Manual input should be disabled when migrating to Zen dropdown mode",
  );
  assert.equal(
    migrated.configSchemaVersion,
    2,
    "configSchemaVersion should be bumped to 2",
  );
});

test("migrateConfig preserves truly custom enhancement settings", async () => {
  const migration = await importModule("config/migration.ts");
  const defaults = await importModule("config/defaults.ts");

  const customConfig = {
    ...defaults.DEFAULTS,
    enhancementBaseUrl: "https://api.openai.com/v1",
    enhancementModel: "gpt-4o-mini",
    enhancementModelManualInput: true,
    configSchemaVersion: 1,
  };

  const migrated = migration.migrateConfig(customConfig);
  assert.equal(
    migrated.enhancementBaseUrl,
    "https://api.openai.com/v1",
    "Custom endpoint should be preserved",
  );
  assert.equal(
    migrated.enhancementModel,
    "gpt-4o-mini",
    "Custom model should be preserved",
  );
  assert.equal(
    migrated.enhancementModelManualInput,
    true,
    "Manual input mode should be preserved for custom settings",
  );
  assert.equal(
    migrated.configSchemaVersion,
    2,
    "configSchemaVersion should still be bumped to 2",
  );
});

test("migrateConfig migrates models/ prefixed model to Zen default", async () => {
  const migration = await importModule("config/migration.ts");
  const defaults = await importModule("config/defaults.ts");

  const legacyConfig = {
    ...defaults.DEFAULTS,
    enhancementBaseUrl: "https://opencode.ai/zen/v1",
    enhancementModel: "models/gemini-1.5-flash",
    enhancementModelManualInput: false,
    configSchemaVersion: 1,
  };

  const migrated = migration.migrateConfig(legacyConfig);
  assert.equal(
    migrated.enhancementModel,
    "big-pickle",
    "Legacy models/ prefixed model should be migrated to Zen default",
  );
});

test("migrateConfig skips migration when configSchemaVersion is already 2", async () => {
  const migration = await importModule("config/migration.ts");
  const defaults = await importModule("config/defaults.ts");

  const config = {
    ...defaults.DEFAULTS,
    enhancementBaseUrl: "https://api.openai.com/v1",
    enhancementModel: "gpt-4o-mini",
    configSchemaVersion: 2,
  };

  const migrated = migration.migrateConfig(config);
  assert.strictEqual(
    migrated,
    config,
    "Should return same object reference when already migrated",
  );
});

test("getConfig runs migration and persists Zen defaults for stale configs", async () => {
  resetHarness({
    enhancementBaseUrl: "",
    enhancementModel: "",
    enhancementModelManualInput: true,
  });
  const storage = await importModule("utils/storage.ts");
  const config = await storage.getConfig();

  assert.equal(
    config.enhancementBaseUrl,
    "https://opencode.ai/zen/v1",
    "getConfig should migrate empty endpoint to Zen",
  );
  assert.equal(
    config.enhancementModel,
    "big-pickle",
    "getConfig should migrate empty model to Zen default",
  );
  assert.equal(
    config.enhancementModelManualInput,
    false,
    "getConfig should set dropdown mode for Zen",
  );
  assert.equal(
    config.configSchemaVersion,
    2,
    "getConfig should bump configSchemaVersion",
  );

  assert.equal(
    STORAGE.get("enhancementBaseUrl"),
    "https://opencode.ai/zen/v1",
    "Migrated endpoint should be persisted to storage",
  );
  assert.equal(
    STORAGE.get("enhancementModel"),
    "big-pickle",
    "Migrated model should be persisted to storage",
  );
  assert.equal(
    STORAGE.get("configSchemaVersion"),
    2,
    "Migrated schema version should be persisted to storage",
  );
});

test("getConfig preserves custom enhancement settings during migration", async () => {
  resetHarness({
    enhancementBaseUrl: "https://api.openai.com/v1",
    enhancementModel: "gpt-4o-mini",
    enhancementModelManualInput: true,
  });
  const storage = await importModule("utils/storage.ts");
  const config = await storage.getConfig();

  assert.equal(
    config.enhancementBaseUrl,
    "https://api.openai.com/v1",
    "Custom endpoint should be preserved by getConfig migration",
  );
  assert.equal(
    config.enhancementModel,
    "gpt-4o-mini",
    "Custom model should be preserved by getConfig migration",
  );
  assert.equal(
    config.enhancementModelManualInput,
    true,
    "Custom manual input mode should be preserved",
  );
  assert.equal(config.configSchemaVersion, 2, "configSchemaVersion should be bumped even for custom configs");
});

// =========================================================================
// Version Badge Tests
// =========================================================================

test("Version module exports VERSION_INFO with valid semver", async () => {
  const version = await importModule("version.ts");
  assert.ok(version.VERSION_INFO, "VERSION_INFO should be exported");
  assert.equal(
    typeof version.VERSION_INFO.SEMANTIC,
    "string",
    "SEMANTIC should be a string",
  );
  assert.ok(
    /^\d+\.\d+\.\d+$/.test(version.VERSION_INFO.SEMANTIC),
    "SEMANTIC should be a valid semver string",
  );
  assert.ok(version.VERSION, "VERSION should be exported");
  assert.equal(
    version.VERSION,
    version.VERSION_INFO.SEMANTIC,
    "VERSION should equal SEMANTIC",
  );
  assert.ok(
    typeof version.VERSION_INFO.BUILD_DATE === "string",
    "BUILD_DATE should be a string",
  );
});

test("Config panel template includes a version badge", () => {
  const source = fs.readFileSync(
    path.join(SRC_ROOT, "components/configPanelTemplate.ts"),
    "utf8",
  );
  assert.ok(
    source.includes("nig-version-badge"),
    "Config panel template should include a version badge element",
  );
  assert.ok(
    source.includes("VERSION_INFO"),
    "Config panel template should reference VERSION_INFO",
  );
});

test("update-versions.js syncs src/version.ts", () => {
  const source = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts/update-versions.js"),
    "utf8",
  );
  assert.ok(
    source.includes("updateVersionTs"),
    "update-versions.js should have an updateVersionTs function",
  );
  assert.ok(
    source.includes("version.ts"),
    "update-versions.js should reference version.ts",
  );
});

test("defaults.ts exports configSchemaVersion", async () => {
  const defaults = await importModule("config/defaults.ts");
  assert.ok(
    "configSchemaVersion" in defaults.DEFAULTS,
    "DEFAULTS should include configSchemaVersion",
  );
  assert.equal(
    defaults.DEFAULTS.configSchemaVersion,
    1,
    "configSchemaVersion default should be 1 (pre-migration)",
  );
});

test("Version badge is rendered inside the modal h2 header and reflects the dynamic VERSION_INFO.DISPLAY value", async () => {
  const template = await importModule("components/configPanelTemplate.ts");
  const html = template.getConfigPanelHTML();
  assert.equal(typeof html, "string", "getConfigPanelHTML should return a string");

  // The version badge must live inside the modal <h2> header so it renders
  // inline with the title rather than as a disconnected element below the
  // header's border separator.
  const h2Match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  assert.ok(h2Match, "Config panel template should render an <h2> header");
  assert.ok(
    h2Match[1].includes("nig-version-badge"),
    "Version badge should be rendered inside the modal <h2> header, not as a sibling below the header border",
  );

  // The badge text must be sourced from VERSION_INFO.DISPLAY (dynamic), not
  // hardcoded into the markup.
  const version = await importModule("version.ts");
  assert.ok(
    h2Match[1].includes(version.VERSION_INFO.DISPLAY),
    `Rendered badge should include the dynamic VERSION_INFO.DISPLAY value (${version.VERSION_INFO.DISPLAY})`,
  );

  // Guard against a hardcoded version literal leaking into the template markup
  const templateSource = fs.readFileSync(
    path.join(SRC_ROOT, "components/configPanelTemplate.ts"),
    "utf8",
  );
  assert.ok(
    !templateSource.includes("v6.2.0"),
    "Config panel template must not hardcode the version literal; it should be sourced from VERSION_INFO",
  );
});

// =========================================================================
// Enhancement Preview Removal Tests
// =========================================================================

test("Enhancement preview/test block markup is fully removed from config panel template", () => {
  const source = fs.readFileSync(
    path.join(SRC_ROOT, "components/configPanelTemplate.ts"),
    "utf8",
  );
  const forbidden = [
    "nig-enhancement-preview",
    "nig-original-prompt",
    "nig-enhanced-prompt",
    "nig-test-enhancement",
    "nig-test-enhancement-btn",
    "nig-preview-container",
    "nig-preview-section",
    "nig-preview-arrow",
    "nig-prompt-display",
  ];
  const offenders = forbidden.filter((id) => source.includes(id));
  assert.equal(
    offenders.length,
    0,
    `Forbidden preview/test markup remains in config panel template: ${offenders.join(", ")}`,
  );
});

test("Enhancement preview/test wiring is fully removed from enhancementPanel", () => {
  const source = fs.readFileSync(
    path.join(SRC_ROOT, "components/enhancementPanel.ts"),
    "utf8",
  );
  const forbidden = [
    "nig-enhancement-preview",
    "nig-original-prompt",
    "nig-enhanced-prompt",
    "nig-test-enhancement",
    "testEnhancement",
    "updatePreviewVisibility",
    "getActiveEnhancementModelValue",
    "nig-prompt-display",
  ];
  const offenders = forbidden.filter((id) => source.includes(id));
  assert.equal(
    offenders.length,
    0,
    `Forbidden preview/test wiring remains in enhancementPanel: ${offenders.join(", ")}`,
  );
});

test("Enhancement preview/test CSS rules are fully removed from stylesheets", () => {
  const styleFiles = [
    "styles/components.css",
    "styles/layout.css",
    "styles/themes.css",
  ].map((rel) => path.join(SRC_ROOT, rel));
  const forbidden = [
    "nig-enhancement-preview",
    "nig-test-enhancement-btn",
    "nig-preview-container",
    "nig-preview-section",
    "nig-preview-arrow",
    "nig-original-prompt",
    "nig-enhanced-prompt",
    "nig-prompt-display",
  ];
  const offenders = [];
  for (const file of styleFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const id of forbidden) {
      if (content.includes(id)) {
        offenders.push(`${path.relative(PROJECT_ROOT, file)}: ${id}`);
      }
    }
  }
  assert.equal(
    offenders.length,
    0,
    `Forbidden preview/test CSS remains in stylesheets: ${offenders.join(", ")}`,
  );
});

test("handleGenerationSuccess defensively rejects non-image persistentUrls in favor of displayUrls", () => {
  const source = fs.readFileSync(path.join(SRC_ROOT, "index.ts"), "utf8");
  // The guard must ensure persistentUrls only overrides displayUrls when every
  // entry is a data: URL, preventing non-image API endpoints from being stored
  // in history (the root cause of the Pollinations 404 history bug).
  assert.ok(
    source.includes('startsWith("data:")'),
    "index.ts should guard persistentUrls by checking that entries start with 'data:'",
  );
  assert.ok(
    source.includes("safePersistentUrls"),
    "index.ts should compute a safe persistent URL set that filters non-data URLs",
  );
});

// === UI/UX AUDIT FIX TESTS (30 findings) ===

function readSrc(rel) {
  return fs.readFileSync(path.join(SRC_ROOT, rel), "utf8");
}

test("UI Audit #1: Modal close buttons are semantic <button> elements, not <span>", () => {
  const files = [
    "components/configPanelTemplate.ts",
    "components/errorModal.ts",
    "components/imageViewer.ts",
    "components/pollinationsAuthPrompt.ts",
  ];
  const offenders = [];
  for (const rel of files) {
    const content = readSrc(rel);
    if (content.includes('<span class="nig-close-btn"')) {
      offenders.push(rel);
    }
  }
  assert.equal(
    offenders.length,
    0,
    `Close buttons still use <span> in: ${offenders.join(", ")}`,
  );
});

test("UI Audit #2: Modals include role=dialog and aria-modal attributes", () => {
  const files = [
    "components/configPanelTemplate.ts",
    "components/errorModal.ts",
    "components/imageViewer.ts",
    "components/pollinationsAuthPrompt.ts",
  ];
  const offenders = [];
  for (const rel of files) {
    const content = readSrc(rel);
    if (!content.includes('role="dialog"')) {
      offenders.push(`${rel}: missing role=dialog`);
    }
    if (!content.includes("aria-modal")) {
      offenders.push(`${rel}: missing aria-modal`);
    }
  }
  assert.equal(offenders.length, 0, `Missing modal ARIA: ${offenders.join(", ")}`);
});

test("UI Audit #3: Tabs use ARIA tab pattern with keyboard navigation", () => {
  const template = readSrc("components/configPanelTemplate.ts");
  assert.ok(template.includes('role="tab"'), "Tabs should have role=tab");
  assert.ok(template.includes('role="tablist"'), "Tab container should have role=tablist");
  assert.ok(template.includes('aria-selected'), "Tabs should have aria-selected");
  assert.ok(template.includes('role="tabpanel"'), "Tab content should have role=tabpanel");
  const events = readSrc("components/configPanelEvents.ts");
  assert.ok(
    events.includes("ArrowRight") || events.includes("ArrowLeft") || events.includes("keydown"),
    "Tab system should support keyboard arrow navigation",
  );
});

test("UI Audit #4: Select elements have visible focus indicator", () => {
  const cssFiles = ["styles/components.css", "styles/utilities.css", "styles/layout.css"];
  let found = false;
  for (const rel of cssFiles) {
    if (readSrc(rel).match(/select\s*:focus/)) {
      found = true;
      break;
    }
  }
  assert.ok(found, "No select:focus rule found in CSS files");
});

test("UI Audit #5: Status widget cancel is a <button> with accessible name", () => {
  const content = readSrc("components/statusWidget.ts");
  assert.ok(!content.includes('<span class="nig-status-cancel"'), "Cancel should not be a <span>");
  assert.ok(content.includes("aria-label"), "Cancel should have aria-label");
});

test("UI Audit #6: Prompt container expand/collapse is keyboard accessible", () => {
  const content = readSrc("components/imageViewer.ts");
  assert.ok(content.includes("aria-expanded"), "Prompt container should have aria-expanded");
  assert.ok(
    content.includes("keydown") || content.includes("role="),
    "Prompt container should support keyboard interaction or have a role",
  );
});

test("UI Audit #7: Image action buttons are always visible (no opacity:0)", () => {
  const content = readSrc("styles/layout.css");
  assert.ok(
    !content.match(/\.nig-image-actions\s*\{[^}]*opacity:\s*0\s*[;}]/),
    "Image actions should not have opacity:0 as base state (must be visible on touch)",
  );
});

test("UI Audit #8: Generate button has aria-label", () => {
  const content = readSrc("index.ts");
  assert.ok(content.includes("aria-label"), "Generate button should have aria-label");
});

test("UI Audit #10/#30: Status indicator has state-specific CSS rules", () => {
  const content = readSrc("styles/utilities.css");
  assert.ok(content.includes(".nig-status-indicator.provider-active"), "Missing .provider-active state rule");
  assert.ok(content.includes(".nig-status-indicator.external-active"), "Missing .external-active state rule");
  assert.ok(content.includes(".nig-status-indicator.disabled"), "Missing .disabled state rule");
});

test("UI Audit #11: Toggle Logging button hover uses primary color, not error", () => {
  const content = readSrc("styles/utilities.css");
  const hoverMatch = content.match(/\.nig-btn-primary\s*:\s*hover\s*\{([^}]*)\}/);
  assert.ok(hoverMatch, "btn-primary:hover rule should exist");
  assert.ok(
    !hoverMatch[1].includes("hover-error"),
    "btn-primary:hover should not use --nig-color-hover-error (confusing warning->danger shift)",
  );
});

test("UI Audit #12: No native alert/confirm/prompt calls in source files", () => {
  const nativeDialogRegex = /(?:^|[^a-zA-Z0-9_.])(?:alert|confirm|prompt)\s*\(/;
  const offenders = [];
  function checkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        checkDir(full);
      } else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
        const lines = fs.readFileSync(full, "utf8").split("\n");
        for (let i = 0; i < lines.length; i++) {
          const trimmed = lines[i].trim();
          if (nativeDialogRegex.test(lines[i]) && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
            offenders.push(`${path.relative(SRC_ROOT, full)}:${i + 1}: ${trimmed.substring(0, 80)}`);
          }
        }
      }
    }
  }
  checkDir(SRC_ROOT);
  assert.equal(offenders.length, 0, `Native dialog calls remain:\n${offenders.join("\n")}`);
});

test("UI Audit #13: Success green darkened for WCAG AA contrast with white text", () => {
  const base = readSrc("styles/base.css");
  // #10b981 with white text = ~2.5:1 (fails). #047857 with white = ~5.5:1 (passes AA).
  assert.ok(
    !base.includes("--nig-color-accent-success: #10b981"),
    "Success accent should be darkened from #10b981 for WCAG AA contrast with white text",
  );
});

test("UI Audit #14: History prompt uses a contrast-safe color token, not hardcoded #d0d0d0a6", () => {
  const content = readSrc("styles/layout.css");
  // Check that #d0d0d0a6 is not used as an actual color value (ignore comments)
  const nonCommentLines = content.split("\n").filter((l) => !l.trim().startsWith("/*") && !l.trim().startsWith("*") && !l.trim().startsWith("//"));
  const nonCommentContent = nonCommentLines.join("\n");
  assert.ok(
    !nonCommentContent.includes("#d0d0d0a6"),
    "History prompt should not use hardcoded low-contrast #d0d0d0a6; use a design token instead",
  );
});

test("UI Audit #16: Status widget has max-width to prevent overflow on mobile", () => {
  const content = readSrc("styles/utilities.css");
  assert.ok(
    content.match(/\.nig-status-widget\s*\{[^}]*max-width/),
    "Status widget should have max-width to prevent overflow on small screens",
  );
});

test("UI Audit #17: Body scroll lock implemented when modal is open", () => {
  // Check that a scroll-lock mechanism exists in the UI utils
  const uiUtils = readSrc("utils/uiUtils.ts");
  assert.ok(
    uiUtils.includes("overflow") && (uiUtils.includes("hidden") || uiUtils.includes("scroll")),
    "uiUtils should implement body scroll lock (overflow hidden) for open modals",
  );
});

test("UI Audit #18: Error modal shows a hint when Retry button is hidden for non-retryable errors", () => {
  const content = readSrc("components/errorModal.ts");
  assert.ok(
    content.includes("nig-error-hint") || content.includes("hint"),
    "Error modal should show a hint explaining why Retry is hidden for non-retryable errors",
  );
});

test("UI Audit #19: Error modal retry provider list is dynamic, not hardcoded", () => {
  const content = readSrc("components/errorModal.ts");
  assert.ok(
    !content.match(/\["Pollinations",\s*"AIHorde"\]/),
    "Error modal should not hardcode provider list; should derive from config",
  );
});

test("UI Audit #20: Enhancement disabled state removes inputs from tab order", () => {
  const content = readSrc("components/enhancementPanel.ts");
  assert.ok(
    content.includes("tabindex") && content.includes("aria-disabled"),
    "Enhancement disabled state should set tabindex=-1 and aria-disabled on inputs to remove them from keyboard tab order",
  );
});

test("UI Audit #21: No 'transition: all' in CSS files (performance anti-pattern)", () => {
  const cssFiles = ["styles/base.css", "styles/components.css", "styles/utilities.css", "styles/layout.css", "styles/themes.css"];
  const offenders = [];
  for (const rel of cssFiles) {
    if (readSrc(rel).includes("transition: all")) {
      offenders.push(rel);
    }
  }
  assert.equal(offenders.length, 0, `transition: all found in: ${offenders.join(", ")}`);
});

test("UI Audit #25: prefers-reduced-motion is scoped to userscript elements, not global *", () => {
  const content = readSrc("styles/base.css");
  assert.ok(content.includes("prefers-reduced-motion"), "prefers-reduced-motion media query should exist");
  assert.ok(
    !content.includes("*,\n  *::before,\n  *::after"),
    "prefers-reduced-motion should not use bare global * selector; must scope to .nig- elements",
  );
});

test("UI Audit #26: input[type=file] selector is scoped to userscript container", () => {
  const content = readSrc("styles/base.css");
  assert.ok(
    !content.match(/^input\[type="file"\]\s*\{/m),
    "input[type=file] should be scoped under .nig- selector, not global",
  );
});

test("UI Audit #27: No @import Google Fonts in base.css (avoids host page leak)", () => {
  const content = readSrc("styles/base.css");
  assert.ok(
    !content.includes('@import url("https://fonts.googleapis.com'),
    "base.css should not @import Google Fonts (leaks into host page)",
  );
});

test("UI Audit #28: History prompt is escaped before innerHTML (XSS robustness)", () => {
  const content = readSrc("components/historyManager.ts");
  assert.ok(
    content.includes("escapeHtml") || content.includes("textContent") || content.includes("createTextNode"),
    "History manager should escape dynamic content (escapeHtml/textContent/createTextNode)",
  );
});

test("UI Audit #29: Error modal escapes dynamic content from API responses", () => {
  const content = readSrc("components/errorModal.ts");
  assert.ok(
    content.includes("escapeHtml") || content.includes("textContent") || content.includes("createTextNode"),
    "Error modal should escape dynamic content from API responses",
  );
});

test("UI Audit #24: Image viewer img has CLS-prevention (aspect-ratio or width/height)", () => {
  const content = readSrc("components/imageViewer.ts");
  assert.ok(
    content.includes("aspect-ratio") || content.includes("aspectRatio") || content.match(/\.(width|height)\s*=/),
    "Image viewer should set aspect-ratio or width/height to reduce CLS",
  );
});

test("UI Audit #23: History list avoids full re-render on every tab visit", () => {
  const content = readSrc("components/historyManager.ts");
  assert.ok(
    content.includes("lastRenderKey") || content.includes("lastRenderHash") || content.includes("lastRenderCount") || content.includes("needsRefresh") || content.includes("isDirty"),
    "History list should use a dirty/changed flag to avoid full re-render on every tab visit",
  );
});

test("UI Audit #9: Close button and image action buttons meet 44px touch target", () => {
  const components = readSrc("styles/components.css");
  const layout = readSrc("styles/layout.css");
  // Close button should be at least 36px (was 32px) — or have min-height/min-width
  assert.ok(
    !components.match(/\.nig-close-btn\s*\{[^}]*width:\s*32px/),
    "Close button should be at least 36px (was 32px), ideally 44px for touch",
  );
});

test("UI Audit: uiUtils module exports escapeHtml, showToast, showConfirm, showPrompt", () => {
  const content = readSrc("utils/uiUtils.ts");
  assert.ok(content.includes("export function escapeHtml"), "uiUtils should export escapeHtml");
  assert.ok(content.includes("export function showToast"), "uiUtils should export showToast (alert replacement)");
  assert.ok(content.includes("export function showConfirm"), "uiUtils should export showConfirm (confirm replacement)");
  assert.ok(content.includes("export function showPrompt"), "uiUtils should export showPrompt (prompt replacement)");
});

test("UI Audit #15: No conflicting duplicate .nig-preview-container definitions", () => {
  const components = readSrc("styles/components.css");
  const layout = readSrc("styles/layout.css");
  // The preview-container was removed in a prior task; verify it stays removed
  assert.ok(!components.includes("nig-preview-container"), "components.css should not have nig-preview-container (removed)");
  assert.ok(!layout.includes("nig-preview-container"), "layout.css should not have nig-preview-container (removed)");
});

async function flushMicrotasks() {
  // Deep async chains (e.g. Pollinations remote-URL -> secondary blob fetch
  // -> FileReader conversion -> Promise.all) need more microtask hops than
  // simpler single-request flows. 10 is generous but safe.
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
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
