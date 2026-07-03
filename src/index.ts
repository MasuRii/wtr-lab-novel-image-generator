// Import styles
import "./styles/main.css";

// Import utility modules
import * as logger from "./utils/logger";
import * as storage from "./utils/storage";
import { parseErrorMessage } from "./utils/error";
import { getApiReadyPrompt } from "./utils/promptUtils";

// Import API modules
import * as apiEnhancement from "./api/enhancement";
import * as apiPollinations from "./api/pollinations";
import * as apiAIHorde from "./api/aiHorde";
import * as apiOpenAI from "./api/openAI";

// Import Component modules
import * as statusWidget from "./components/statusWidget";
import * as imageViewer from "./components/imageViewer";
import * as errorModal from "./components/errorModal";
import * as pollinationsAuthPrompt from "./components/pollinationsAuthPrompt";
import * as configPanel from "./components/configPanel";
import * as abortRegistry from "./utils/abortRegistry";

(function () {
  "use strict";

  // --- STATE MANAGEMENT ---
  const generationQueue = [];
  const completedQueue = [];
  const errorQueue = [];
  let isGenerating = false;
  let currentGenerationStatusText = "";
  let enhancementInFlightCount = 0;
  let isErrorModalVisible = false;
  let currentSelection = "";
  let generateBtn;

  // --- CORE LOGIC ---

  function handleGenerationSuccess(
    displayUrls,
    prompt,
    provider,
    model,
    persistentUrls = null,
  ) {
    logger.logInfo("GENERATION", "Generation completed successfully", {
      provider,
      model,
      promptLength: prompt.length,
      promptPreview:
        prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
      imagesGenerated: displayUrls.length,
      hasPersistentUrls: Boolean(persistentUrls),
    });

    completedQueue.push({ imageUrls: displayUrls, prompt, provider, model });
    // Defensive guard: only honor persistentUrls when every entry is a data:
    // URL (actual image content). This prevents non-image API endpoints from
    // overriding valid display URLs in history — the root cause of the
    // Pollinations history 404 bug where the POST endpoint URL was stored
    // instead of the generated image.
    const safePersistentUrls =
      persistentUrls &&
      persistentUrls.every(
        (u) => typeof u === "string" && u.startsWith("data:"),
      )
        ? persistentUrls
        : null;
    const historyUrls = safePersistentUrls || displayUrls;
    historyUrls.forEach((url) =>
      storage.addToHistory({
        date: new Date().toISOString(),
        prompt,
        url,
        provider,
        model,
      }),
    );
    isGenerating = false;
    updateSystemStatus();
    processQueue();
  }

  function handleGenerationFailure(
    errorMessage,
    prompt = "Unknown",
    provider,
    providerProfileUrl = null,
    errorMetadata = null,
  ) {
    logger.logError("GENERATION", `Generation Failed`, {
      prompt,
      provider,
      errorMessage,
      errorMetadata,
    });

    // If error metadata is provided (e.g., from OpenAI provider), use it to enhance error parsing
    const friendlyError = parseErrorMessage(
      errorMessage,
      provider,
      providerProfileUrl,
    );

    // If metadata provides explicit error type and retryability, use that
    if (errorMetadata) {
      if (errorMetadata.errorType) {
        friendlyError.errorType = errorMetadata.errorType;
      }
      if (typeof errorMetadata.isNonRetryable === "boolean") {
        friendlyError.retryable = !errorMetadata.isNonRetryable;
        friendlyError.isNonRetryable = errorMetadata.isNonRetryable;
      }
    }

    errorQueue.push({
      reason: friendlyError,
      prompt,
      provider,
      providerProfileUrl,
    });
    showNextError();

    // Don't auto-continue queue - wait for user action
    statusWidget.update("error", "Generation Failed.");
    isGenerating = false;

    // Update status but don't auto-process queue
    updateSystemStatus();

    logger.logInfo(
      "GENERATION",
      "Generation failed - waiting for user action",
      {
        errorQueueLength: errorQueue.length,
        generationQueueLength: generationQueue.length,
        willWaitForUser: true,
        errorType: friendlyError.errorType || "unknown",
        isNonRetryable: friendlyError.isNonRetryable || false,
      },
    );
  }

  function showNextError() {
    if (isErrorModalVisible || errorQueue.length === 0) {
      return;
    }
    const errorToShow = errorQueue.shift();
    isErrorModalVisible = true;
    errorModal.show(errorToShow);

    logger.logInfo("ERROR", "Showing error modal to user", {
      errorReason: errorToShow.reason.message,
      provider: errorToShow.provider,
      remainingErrorQueue: errorQueue.length,
    });

    // The error modal will hide itself, we don't need to manage its closing state here
  }

  function handleErrorModalDismiss() {
    logger.logInfo("ERROR", "Error modal dismissed by user", {
      errorQueueLength: errorQueue.length,
      generationQueueLength: generationQueue.length,
      isGenerating,
    });

    isErrorModalVisible = false;
    updateSystemStatus();

    // Resume queue processing if there are more items
    if (generationQueue.length > 0 && !isGenerating) {
      logger.logInfo(
        "ERROR",
        "Resuming queue processing after error modal dismissal",
      );
      processQueue();
    } else {
      logger.logInfo("ERROR", "No more items to process, queue paused");
    }
  }

  function retryGeneration(
    basePositivePrompt,
    provider,
    providerProfileUrl = null,
  ) {
    const queueEntry = {
      basePositivePrompt,
      provider,
      providerProfileUrl,
    };
    generationQueue.unshift(queueEntry);

    logger.logInfo(
      "GENERATION",
      "Added retry generation to queue (LIFO - Priority)",
      {
        provider,
        basePositivePromptLength: basePositivePrompt.length,
        queueLength: generationQueue.length,
        queuePosition: 1,
        basePositivePromptPreview:
          basePositivePrompt.substring(0, 100) +
          (basePositivePrompt.length > 100 ? "..." : ""),
      },
    );

    isGenerating = false;
    errorModal.hide();
    isErrorModalVisible = false;
    updateSystemStatus();
    processQueue();
    showNextError(); // Check if there are other errors in the queue
  }

  function addToGenerationQueue(
    basePositivePrompt,
    provider,
    providerProfileUrl = null,
  ) {
    generationQueue.push({
      basePositivePrompt,
      provider,
      providerProfileUrl,
    });

    logger.logInfo("GENERATION", "Added generation to queue (FIFO)", {
      provider,
      basePositivePromptLength: basePositivePrompt.length,
      queueLength: generationQueue.length,
      queuePosition: generationQueue.length,
      basePositivePromptPreview:
        basePositivePrompt.substring(0, 100) +
        (basePositivePrompt.length > 100 ? "..." : ""),
    });

    updateSystemStatus();

    if (!isGenerating) {
      processQueue();
    }
  }

  function cancelGeneration() {
    logger.logInfo("GENERATION", "User cancelled generation", {
      generationQueueLength: generationQueue.length,
      isGenerating,
      enhancementInFlightCount,
    });
    generationQueue.length = 0;
    abortRegistry.abortAll();
    isGenerating = false;
    enhancementInFlightCount = 0;
    currentGenerationStatusText = "";
    updateSystemStatus();
  }

  function updateSystemStatus() {
    logger.logDebug("SYSTEM", "Updating system status", {
      completedQueueLength: completedQueue.length,
      isGenerating,
      generationQueueLength: generationQueue.length,
      currentStatusText: currentGenerationStatusText,
    });

    if (completedQueue.length > 0) {
      const text =
        completedQueue.length === 1
          ? "1 Image Ready!"
          : `${completedQueue.length} Images Ready!`;
      statusWidget.update("success", `${text} Click to view.`, () => {
        const result = completedQueue.shift();
        if (result) {
          // Ensure viewer sees the exact main prompt string sent to provider:
          // - For AI Horde: positive-only prompt.
          // - For others: fully concatenated prompt with inline negative when applicable.
          imageViewer.show(
            result.imageUrls,
            result.prompt,
            result.provider,
            result.model,
          );
        }
        updateSystemStatus();
      });
    } else if (isGenerating || generationQueue.length > 0) {
      // Only show queue indicator if there are items actually waiting (generationQueue.length > 0)
      // This prevents showing "Queue: 1" when only the current item is being processed
      const queueText =
        generationQueue.length > 0 ? ` (Queue: ${generationQueue.length})` : "";
      statusWidget.update(
        "loading",
        `${currentGenerationStatusText}${queueText}`,
        null,
        cancelGeneration,
      );
    } else {
      statusWidget.update("hidden", "");
    }
  }

  async function processQueue() {
    if (isGenerating || generationQueue.length === 0) {
      logger.logDebug("QUEUE", "Queue processing skipped", {
        reason: isGenerating ? "Currently generating" : "Queue is empty",
        isGenerating,
        queueLength: generationQueue.length,
      });
      return;
    }

    isGenerating = true;
    const request = generationQueue.shift();
    currentGenerationStatusText = "Requesting...";

    const provider = request.provider;
    const basePositivePrompt = request.basePositivePrompt;

    const apiPrompt = getApiReadyPrompt(basePositivePrompt, "queue_dispatch");
    const displayPrompt = basePositivePrompt;

    logger.logInfo("QUEUE", "Starting queue processing", {
      provider,
      basePositivePromptLength: basePositivePrompt.length,
      basePositivePromptPreview:
        basePositivePrompt.substring(0, 100) +
        (basePositivePrompt.length > 100 ? "..." : ""),
      remainingQueueLength: generationQueue.length,
      currentStatus: currentGenerationStatusText,
    });

    updateSystemStatus();

    const callbacks = {
      onSuccess: handleGenerationSuccess,
      onFailure: handleGenerationFailure,
      onAuthFailure: (msg, p) => {
        logger.logInfo("AUTH", "Authentication required", {
          provider: p,
          message: msg,
        });
        pollinationsAuthPrompt.show(msg, p, retryGeneration);
        isGenerating = false;
        // Don't auto-resume - wait for user action
        statusWidget.update("error", "Authentication needed.");
        updateSystemStatus();

        logger.logInfo(
          "AUTH",
          "Queue paused due to authentication requirement",
          {
            generationQueueLength: generationQueue.length,
            willWaitForUser: true,
          },
        );
      },
      updateStatus: (text) => {
        currentGenerationStatusText = text;
        logger.logDebug("SYSTEM", "Status updated by provider", {
          provider: request.provider,
          newStatusText: text,
          isGenerating,
          generationQueueLength: generationQueue.length,
        });
        updateSystemStatus();
      },
    };

    // Provider-specific final/negative prompt handling
    switch (provider) {
      case "AIHorde": {
        // For AI Horde:
        // - apiPrompt is strictly the positive prompt (StyledPrompt or EnhancedPrompt)
        // - api/aiHorde.ts appends negative prompts with AI Horde's documented
        //   ### separator when the global negative prompt is enabled.
        logger.logInfo("QUEUE", "Using AI Horde prompt construction path", {
          provider: "AIHorde",
          positivePromptLength: apiPrompt.length,
          positivePromptPreview:
            apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
        });

        logger.logDebug(
          "QUEUE",
          "Dispatching to AIHorde provider with positive-only prompt",
          {
            provider: "AIHorde",
            prompt:
              apiPrompt.substring(0, 200) +
              (apiPrompt.length > 200 ? "..." : ""),
          },
        );

        apiAIHorde.generate(apiPrompt, callbacks);
        break;
      }

      case "Pollinations":
      case "OpenAICompat": {
        // Provider modules now own provider-specific negative prompt handling:
        // - Pollinations sends negative_prompt as a query parameter.
        // - OpenAI-compatible retains inline negative prompting.
        const useCase =
          provider === "Pollinations"
            ? "pollinations_negative_prompt_query"
            : "openai_compat_inline_negative";

        logger.logInfo("QUEUE", "Using non-AI Horde prompt construction path", {
          provider,
          basePositivePromptLength: apiPrompt.length,
          basePositivePromptPreview:
            apiPrompt.substring(0, 200) + (apiPrompt.length > 200 ? "..." : ""),
        });

        if (provider === "Pollinations") {
          logger.logDebug("QUEUE", "Dispatching to Pollinations provider", {
            prompt:
              apiPrompt.substring(0, 200) +
              (apiPrompt.length > 200 ? "..." : ""),
            path: useCase,
          });
          apiPollinations.generate(apiPrompt, callbacks);
        } else {
          logger.logDebug("QUEUE", "Dispatching to OpenAICompat provider", {
            prompt:
              apiPrompt.substring(0, 200) +
              (apiPrompt.length > 200 ? "..." : ""),
            providerProfileUrl: request.providerProfileUrl,
            path: useCase,
          });
          apiOpenAI.generate(
            apiPrompt,
            request.providerProfileUrl,
            callbacks,
          );
        }
        break;
      }

      default:
        handleGenerationFailure(
          `Unknown provider: ${provider}`,
          displayPrompt,
          "System",
        );
    }
  }

  // --- EVENT HANDLERS & UI TRIGGERS ---

  async function onGenerateClick() {
    generateBtn.style.display = "none";
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    if (!currentSelection) {
      logger.logWarn("GENERATION", "No text selected for generation");
      return;
    }

    logger.logInfo("GENERATION", "User initiated image generation", {
      selectionLength: currentSelection.length,
      selectionPreview:
        currentSelection.substring(0, 100) +
        (currentSelection.length > 100 ? "..." : ""),
    });

    const config = await storage.getConfig();

    let finalPrompt = currentSelection;
    let prefix = "";

    // StyledPrompt = StylePrefix + SelectedText
    if (config.customStyleEnabled && config.customStyleText) {
      prefix = config.customStyleText.trim();
      if (prefix && !prefix.endsWith(", ")) {
        prefix += ", ";
      }
    } else if (config.mainPromptStyle !== "None") {
      prefix =
        config.subPromptStyle && config.subPromptStyle !== "none"
          ? config.subPromptStyle
          : `${config.mainPromptStyle} style, `;
    }
    finalPrompt = prefix + finalPrompt;

    // If AI Enhancement is enabled and used, it operates on StyledPrompt and becomes EnhancedPrompt.
    if (config.enhancementEnabled) {
      const shouldUseProviderEnh = apiEnhancement.shouldUseProviderEnhancement(
        config.selectedProvider,
        config,
      );
      const hasEndpoint =
        (config.enhancementBaseUrl || "").trim().length > 0;
      const hasModel = (config.enhancementModel || "").trim().length > 0;
      const shouldUseExternalEnhancement =
        (!shouldUseProviderEnh || config.enhancementOverrideProvider) &&
        hasEndpoint &&
        hasModel;

      if (shouldUseExternalEnhancement) {
        enhancementInFlightCount++;
        const tokenBeforeEnhancement = abortRegistry.getCancelToken();
        const startQueueText =
          enhancementInFlightCount > 1
            ? ` (Queue: ${enhancementInFlightCount})`
            : "";
        statusWidget.update("loading", `Enhancing prompt...${startQueueText}`);
        try {
          // Clean prompt for enhancement API call
          // IMPORTANT: Enhancement must ONLY see the positive prompt (style + user text), never global negatives
          const cleanPromptForEnhancement = getApiReadyPrompt(
            finalPrompt,
            "enhancement_positive_only",
          );
          finalPrompt = await apiEnhancement.enhancePrompt(
            cleanPromptForEnhancement,
            config,
          );
          enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
          if (abortRegistry.getCancelToken() !== tokenBeforeEnhancement) {
            return;
          }
          const successQueueText =
            enhancementInFlightCount > 0
              ? ` (Queue: ${enhancementInFlightCount})`
              : "";
          statusWidget.update("success", `Prompt enhanced!${successQueueText}`);
          setTimeout(() => updateSystemStatus(), 2000);
        } catch (error) {
          enhancementInFlightCount = Math.max(0, enhancementInFlightCount - 1);
          if (abortRegistry.getCancelToken() !== tokenBeforeEnhancement) {
            return;
          }
          const errorQueueText =
            enhancementInFlightCount > 0
              ? ` (Queue: ${enhancementInFlightCount})`
              : "";
          // External enhancement failure is expected to gracefully fall back.
          // Log as non-critical ENHANCEMENT info so it respects the logging toggle.
          logger.logInfo(
            "ENHANCEMENT",
            "External AI enhancement failed, falling back to original",
            { error: error.message },
          );
          statusWidget.update(
            "error",
            `Enhancement failed, using original prompt${errorQueueText}`,
          );
          setTimeout(() => updateSystemStatus(), 3000);
        }
      }
    }

    // NOTE (Objective 4):
    // Global negative prompt is applied ONLY at provider dispatch time for providers that explicitly support it.
    // Do NOT concatenate globalNegPrompt into finalPrompt here.

    logger.logInfo(
      "GENERATION",
      "Prompt preparation completed, adding to queue",
      {
        provider: config.selectedProvider,
        basePositivePromptLength: finalPrompt.length,
        basePositivePromptPreview:
          finalPrompt.substring(0, 200) +
          (finalPrompt.length > 200 ? "..." : ""),
        queueSystem: "FIFO",
      },
    );

    // finalPrompt is now StyledPrompt or EnhancedPrompt (positive-only).
    // Provider-specific negative behavior is applied later at dispatch/API modules.
    addToGenerationQueue(
      finalPrompt,
      config.selectedProvider,
      config.openAICompatActiveProfileUrl,
    );
  }

  function handleSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (generateBtn) {
        generateBtn.style.display = "none";
      }
      return;
    }
    const selectedText = selection.toString().trim();

    if (selectedText.length > 5) {
      currentSelection = selectedText;
      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();
      if (rects.length === 0) {
        generateBtn.style.display = "none";
        return;
      }
      const firstRect = rects[0];
      generateBtn.style.display = "inline-flex";
      const buttonHeight = generateBtn.offsetHeight || 30;
      let topPosition = window.scrollY + firstRect.top - buttonHeight - 5;
      if (topPosition < window.scrollY) {
        const lastRect = rects[rects.length - 1];
        topPosition = window.scrollY + lastRect.bottom + 5;
      }
      generateBtn.style.top = `${topPosition}px`;
      generateBtn.style.left = `${window.scrollX + firstRect.left}px`;
    } else {
      if (generateBtn) {
        generateBtn.style.display = "none";
      }
    }
  }

  // --- INITIALIZATION ---
  async function init() {
    await logger.updateLoggingStatus();

    // Clean old history entries on startup to maintain data integrity
    try {
      const removedCount = await storage.cleanOldHistory();
      if (removedCount > 0) {
        logger.logInfo(
          "INIT",
          `Cleaned ${removedCount} old history entries on startup`,
        );
      }
    } catch (error) {
      logger.logError(
        "INIT",
        "Failed to clean old history entries on startup",
        { error: error.message },
      );
    }

    // Create the main UI button
    const materialSymbolsLink = document.createElement("link");
    materialSymbolsLink.rel = "stylesheet";
    materialSymbolsLink.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
    document.head.appendChild(materialSymbolsLink);
    generateBtn = document.createElement("button");
    generateBtn.className = "nig-button";
    generateBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg><span>Generate Image</span>';
    generateBtn.setAttribute("aria-label", "Generate image from selected text");
    generateBtn.addEventListener("click", onGenerateClick);
    document.body.appendChild(generateBtn);

    // Create and initialize all components
    statusWidget.create();
    imageViewer.create();
    errorModal.create();
    configPanel.create();

    // Inject an "AI Image" launcher directly into the site's bottom reader
    // navigation bar (the Read / Display / Speech / Settings / More tab
    // strip) instead of a standalone floating widget. This keeps the entry
    // point inside the host UI where it belongs. The site is a SPA that
    // re-renders the nav on route changes, so a MutationObserver re-injects
    // the tab whenever the nav reappears without it.
    function injectSettingsTab() {
      const nav = document.querySelector("nav.bottom-reader-nav");
      if (!nav || nav.querySelector(".nig-reader-tab")) {
        return;
      }

      // Locate the tab strip via the "More" tab so the launcher inserts
      // beside the site's own Settings tab. Falls back to the first
      // button's parent (the tab strip) if labels differ.
      const buttons = nav.querySelectorAll("button");
      let moreTab = null;
      for (const btn of buttons) {
        if (/^more$/i.test(btn.textContent.trim())) {
          moreTab = btn;
          break;
        }
      }
      const tabBar = (moreTab ?? nav.querySelector("button"))?.parentElement;
      if (!tabBar) {
        return;
      }

      const tab = document.createElement("button");
      tab.type = "button";
      tab.className =
        "nig-reader-tab relative flex-1 flex flex-col items-center justify-center pt-1.5 pb-2 gap-0.5 transition-colors border-l border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/30";
      tab.title = "Image Generator Settings";
      tab.setAttribute("aria-label", "Open Image Generator settings");
      tab.innerHTML =
        '<span class="absolute top-0 inset-x-0 h-0.5 transition-colors bg-transparent"></span>' +
        '<span class="[&>svg]:w-4 [&>svg]:h-4">' +
        '<svg class="icon inline-flex shrink-0 size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>' +
        "</span>" +
        '<span class="text-[10px] font-medium leading-none">AI Image</span>';
      tab.addEventListener("click", () => configPanel.show());

      // Insert before the "More" tab so the launcher sits beside Settings.
      if (moreTab) {
        tabBar.insertBefore(tab, moreTab);
      } else {
        tabBar.appendChild(tab);
      }
    }

    let tabInjectScheduled = false;
    const tabObserver = new MutationObserver(() => {
      if (tabInjectScheduled) {
        return;
      }
      tabInjectScheduled = true;
      requestAnimationFrame(() => {
        tabInjectScheduled = false;
        injectSettingsTab();
      });
    });
    tabObserver.observe(document.body, { childList: true, subtree: true });
    injectSettingsTab();

    errorModal.init({
      onRetry: retryGeneration,
      onDismiss: handleErrorModalDismiss,
    });

    // Register global event listeners
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);
    GM_registerMenuCommand("Image Generator Settings", configPanel.show);

    logger.logInfo(
      "INIT",
      "WTR LAB Novel Image Generator initialized successfully",
      {
        config: await storage.getConfig(),
      },
    );
  }

  init();
})();
