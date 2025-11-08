// Import styles
import './styles/main.css';

// Import utility modules
import * as logger from './utils/logger.js';
import * as storage from './utils/storage.js';
import { parseErrorMessage } from './utils/error.js';

// Import API modules
import * as apiGemini from './api/gemini.js';
import * as apiGoogle from './api/google.js';
import * as apiPollinations from './api/pollinations.js';
import * as apiAIHorde from './api/aiHorde.js';
import * as apiOpenAI from './api/openAI.js';

// Import Component modules
import * as statusWidget from './components/statusWidget.js';
import * as imageViewer from './components/imageViewer.js';
import * as errorModal from './components/errorModal.js';
import * as googleApiPrompt from './components/googleApiPrompt.js';
import * as pollinationsAuthPrompt from './components/pollinationsAuthPrompt.js';
import * as configPanel from './components/configPanel.js';

(function () {
    'use strict';

    // --- STATE MANAGEMENT ---
    let generationQueue = [];
    let completedQueue = [];
    let errorQueue = [];
    let isGenerating = false;
    let currentGenerationStatusText = '';
    let isErrorModalVisible = false;
    let currentSelection = '';
    let generateBtn;

    // --- CORE LOGIC ---

    function handleGenerationSuccess(displayUrls, prompt, provider, model, persistentUrls = null) {
        logger.logInfo('GENERATION', 'Generation completed successfully', {
            provider,
            model,
            promptLength: prompt.length,
            promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
            imagesGenerated: displayUrls.length,
            hasPersistentUrls: !!persistentUrls
        });
        
        completedQueue.push({ imageUrls: displayUrls, prompt, provider });
        const historyUrls = persistentUrls || displayUrls;
        historyUrls.forEach(url => storage.addToHistory({ date: new Date().toISOString(), prompt, url, provider, model }));
        isGenerating = false;
        updateSystemStatus();
        processQueue();
    }

    function handleGenerationFailure(errorMessage, prompt = 'Unknown', provider, providerProfileUrl = null) {
        logger.logError('GENERATION', `Generation Failed`, { prompt, provider, errorMessage });
        const friendlyError = parseErrorMessage(errorMessage, provider, providerProfileUrl);
        errorQueue.push({ reason: friendlyError, prompt, provider, providerProfileUrl });
        showNextError();
        
        // Don't auto-continue queue - wait for user action
        statusWidget.update('error', 'Generation Failed.');
        isGenerating = false;
        
        // Update status but don't auto-process queue
        updateSystemStatus();
        
        logger.logInfo('GENERATION', 'Generation failed - waiting for user action', {
            errorQueueLength: errorQueue.length,
            generationQueueLength: generationQueue.length,
            willWaitForUser: true
        });
    }

    function showNextError() {
        if (isErrorModalVisible || errorQueue.length === 0) return;
        const errorToShow = errorQueue.shift();
        isErrorModalVisible = true;
        errorModal.show(errorToShow);
        
        logger.logInfo('ERROR', 'Showing error modal to user', {
            errorReason: errorToShow.reason.message,
            provider: errorToShow.provider,
            remainingErrorQueue: errorQueue.length
        });
        
        // The error modal will hide itself, we don't need to manage its closing state here
    }

    function handleErrorModalDismiss() {
        logger.logInfo('ERROR', 'Error modal dismissed by user', {
            errorQueueLength: errorQueue.length,
            generationQueueLength: generationQueue.length,
            isGenerating
        });
        
        isErrorModalVisible = false;
        updateSystemStatus();
        
        // Resume queue processing if there are more items
        if (generationQueue.length > 0 && !isGenerating) {
            logger.logInfo('ERROR', 'Resuming queue processing after error modal dismissal');
            processQueue();
        } else {
            logger.logInfo('ERROR', 'No more items to process, queue paused');
        }
    }

    function retryGeneration(prompt, provider, providerProfileUrl = null) {
        // Add to the front of the queue (LIFO - Last In, First Out) to give priority to retries
        const queueEntry = { prompt, provider, providerProfileUrl };
        generationQueue.unshift(queueEntry);
        
        logger.logInfo('GENERATION', 'Added retry generation to queue (LIFO - Priority)', {
            provider,
            promptLength: prompt.length,
            queueLength: generationQueue.length,
            queuePosition: 1, // Will be processed next
            promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')
        });
        
        isGenerating = false;
        errorModal.hide();
        isErrorModalVisible = false;
        updateSystemStatus();
        processQueue();
        showNextError(); // Check if there are other errors in the queue
    }

    function addToGenerationQueue(prompt, provider, providerProfileUrl = null) {
        // Add to the end of the queue (FIFO - First In, First Out) for normal requests
        const queueEntry = { prompt, provider, providerProfileUrl };
        generationQueue.push(queueEntry);
        
        logger.logInfo('GENERATION', 'Added generation to queue (FIFO)', {
            provider,
            promptLength: prompt.length,
            queueLength: generationQueue.length,
            queuePosition: generationQueue.length, // Position in queue (1-based)
            promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')
        });
        
        updateSystemStatus();
        processQueue();
    }

    function updateSystemStatus() {
        logger.logDebug('SYSTEM', 'Updating system status', {
            completedQueueLength: completedQueue.length,
            isGenerating,
            generationQueueLength: generationQueue.length,
            currentStatusText: currentGenerationStatusText
        });

        if (completedQueue.length > 0) {
            const text = completedQueue.length === 1 ? '1 Image Ready!' : `${completedQueue.length} Images Ready!`;
            statusWidget.update('success', `${text} Click to view.`, () => {
                const result = completedQueue.shift();
                if (result) {
                    imageViewer.show(result.imageUrls, result.prompt, result.provider);
                }
                updateSystemStatus();
            });
        } else if (isGenerating || generationQueue.length > 0) {
            // Only show queue indicator if there are items actually waiting (generationQueue.length > 0)
            // This prevents showing "Queue: 1" when only the current item is being processed
            const queueText = generationQueue.length > 0 ? ` (Queue: ${generationQueue.length})` : '';
            statusWidget.update('loading', `${currentGenerationStatusText}${queueText}`);
        } else {
            statusWidget.update('hidden', '');
        }
    }

    async function processQueue() {
        if (isGenerating || generationQueue.length === 0) {
            logger.logDebug('QUEUE', 'Queue processing skipped', {
                reason: isGenerating ? 'Currently generating' : 'Queue is empty',
                isGenerating,
                queueLength: generationQueue.length
            });
            return;
        }

        isGenerating = true;
        const request = generationQueue.shift();
        currentGenerationStatusText = 'Requesting...';
        
        logger.logInfo('QUEUE', 'Starting queue processing', {
            provider: request.provider,
            promptLength: request.prompt.length,
            promptPreview: request.prompt.substring(0, 100) + (request.prompt.length > 100 ? '...' : ''),
            remainingQueueLength: generationQueue.length,
            currentStatus: currentGenerationStatusText
        });
        
        updateSystemStatus();

        const callbacks = {
            onSuccess: handleGenerationSuccess,
            onFailure: handleGenerationFailure,
            onAuthFailure: (msg, p) => {
                logger.logInfo('AUTH', 'Authentication required', { provider: p, message: msg });
                pollinationsAuthPrompt.show(msg, p, retryGeneration);
                isGenerating = false;
                // Don't auto-resume - wait for user action
                statusWidget.update('error', 'Authentication needed.');
                updateSystemStatus();
                
                logger.logInfo('AUTH', 'Queue paused due to authentication requirement', {
                    generationQueueLength: generationQueue.length,
                    willWaitForUser: true
                });
            },
            updateStatus: (text) => {
                currentGenerationStatusText = text;
                updateSystemStatus();
            }
        };

        switch (request.provider) {
            case 'Google':
                logger.logDebug('QUEUE', 'Dispatching to Google provider', { prompt: request.prompt.substring(0, 50) + '...' });
                apiGoogle.generate(request.prompt, callbacks);
                break;
            case 'AIHorde':
                logger.logDebug('QUEUE', 'Dispatching to AIHorde provider', { prompt: request.prompt.substring(0, 50) + '...' });
                apiAIHorde.generate(request.prompt, callbacks);
                break;
            case 'Pollinations':
                logger.logDebug('QUEUE', 'Dispatching to Pollinations provider', { prompt: request.prompt.substring(0, 50) + '...' });
                apiPollinations.generate(request.prompt, callbacks);
                break;
            case 'OpenAICompat':
                logger.logDebug('QUEUE', 'Dispatching to OpenAICompat provider', {
                    prompt: request.prompt.substring(0, 50) + '...',
                    providerProfileUrl: request.providerProfileUrl
                });
                apiOpenAI.generate(request.prompt, request.providerProfileUrl, callbacks);
                break;
            default:
                handleGenerationFailure(`Unknown provider: ${request.provider}`, request.prompt, 'System');
        }
    }

    // --- EVENT HANDLERS & UI TRIGGERS ---

    async function onGenerateClick() {
        generateBtn.style.display = 'none';
        if (window.getSelection) window.getSelection().removeAllRanges();
        if (!currentSelection) {
            logger.logWarn('GENERATION', 'No text selected for generation');
            return;
        }

        logger.logInfo('GENERATION', 'User initiated image generation', {
            selectionLength: currentSelection.length,
            selectionPreview: currentSelection.substring(0, 100) + (currentSelection.length > 100 ? '...' : '')
        });

        const config = await storage.getConfig();

        if (config.selectedProvider === 'Google' && !config.googleApiKey) {
            logger.logWarn('GENERATION', 'Google provider selected but no API key provided');
            googleApiPrompt.show();
            return;
        }

        let finalPrompt = currentSelection;
        let prefix = '';

        if (config.customStyleEnabled && config.customStyleText) {
            prefix = config.customStyleText.trim();
            if (prefix && !prefix.endsWith(', ')) prefix += ', ';
        } else if (config.mainPromptStyle !== 'None') {
            prefix = (config.subPromptStyle && config.subPromptStyle !== 'none')
                ? config.subPromptStyle
                : `${config.mainPromptStyle} style, `;
        }
        finalPrompt = prefix + finalPrompt;

        if (config.enhancementEnabled) {
            const shouldUseProviderEnh = apiGemini.shouldUseProviderEnhancement(config.selectedProvider, config);
            const hasApiKey = config.enhancementApiKey.trim().length > 0;
            const shouldUseExternalEnhancement = (!shouldUseProviderEnh || config.enhancementOverrideProvider) && hasApiKey;

            if (shouldUseExternalEnhancement) {
                statusWidget.update('loading', 'Enhancing prompt...');
                try {
                    finalPrompt = await apiGemini.enhancePromptWithGemini(finalPrompt, config);
                    statusWidget.update('success', 'Prompt enhanced!');
                    setTimeout(() => updateSystemStatus(), 2000);
                } catch (error) {
                    logger.logError('ENHANCEMENT', 'External AI enhancement failed, falling back to original', { error: error.message });
                    statusWidget.update('error', 'Enhancement failed, using original prompt');
                    setTimeout(() => updateSystemStatus(), 3000);
                }
            }
        }

        if (config.enableNegPrompt && config.globalNegPrompt && config.selectedProvider !== 'AIHorde') {
            finalPrompt += `, negative prompt: ${config.globalNegPrompt}`;
            logger.logDebug('GENERATION', 'Global negative prompt applied', {
                negativePrompt: config.globalNegPrompt,
                originalLength: finalPrompt.length - config.globalNegPrompt.length - 18,
                finalLength: finalPrompt.length
            });
        }

        logger.logInfo('GENERATION', 'Prompt preparation completed, adding to queue', {
            provider: config.selectedProvider,
            finalPromptLength: finalPrompt.length,
            promptPreview: finalPrompt.substring(0, 100) + (finalPrompt.length > 100 ? '...' : ''),
            queueSystem: 'FIFO'
        });

        addToGenerationQueue(finalPrompt, config.selectedProvider, config.openAICompatActiveProfileUrl);
    }

    function handleSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            if(generateBtn) generateBtn.style.display = 'none';
            return;
        }
        const selectedText = selection.toString().trim();

        if (selectedText.length > 5) {
            currentSelection = selectedText;
            const range = selection.getRangeAt(0);
            const rects = range.getClientRects();
            if (rects.length === 0) {
                generateBtn.style.display = 'none';
                return;
            }
            const firstRect = rects[0];
            generateBtn.style.display = 'block';
            const buttonHeight = generateBtn.offsetHeight || 30;
            let topPosition = window.scrollY + firstRect.top - buttonHeight - 5;
            if (topPosition < window.scrollY) {
                const lastRect = rects[rects.length - 1];
                topPosition = window.scrollY + lastRect.bottom + 5;
            }
            generateBtn.style.top = `${topPosition}px`;
            generateBtn.style.left = `${window.scrollX + firstRect.left}px`;
        } else {
            if(generateBtn) generateBtn.style.display = 'none';
        }
    }

    // --- INITIALIZATION ---
    async function init() {
        await logger.updateLoggingStatus();

        // Create the main UI button
        const materialSymbolsLink = document.createElement('link');
        materialSymbolsLink.rel = 'stylesheet';
        materialSymbolsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
        document.head.appendChild(materialSymbolsLink);
        generateBtn = document.createElement('button');
        generateBtn.className = 'nig-button';
        generateBtn.innerHTML = '🎨 Generate Image';
        generateBtn.addEventListener('click', onGenerateClick);
        document.body.appendChild(generateBtn);

        // Create and initialize all components
        statusWidget.create();
        imageViewer.create();
        errorModal.create();
        configPanel.create();
        errorModal.init({
            onRetry: retryGeneration,
            onDismiss: handleErrorModalDismiss
        });

        // Register global event listeners
        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('selectionchange', handleSelection);
        GM_registerMenuCommand('Image Generator Settings', configPanel.show);

        logger.logInfo('INIT', 'WTR LAB Novel Image Generator initialized successfully', {
            config: await storage.getConfig()
        });
    }

    init();

})();