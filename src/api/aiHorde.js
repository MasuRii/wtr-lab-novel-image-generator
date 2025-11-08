import { getConfig } from '../utils/storage.js';
import { clearCachedModels } from '../utils/cache.js';
import { logInfo, logDebug, logError } from '../utils/logger.js';

function checkStatus(id, prompt, startTime, model, { onSuccess, onFailure, updateStatus }) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    
    logDebug('AIHORDE', 'Checking AI Horde generation status', {
        generationId: id,
        elapsedTimeMs: elapsedTime,
        promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')
    });

    if (elapsedTime > 300000) { // 5 minute timeout
        logError('AIHORDE', 'Generation timed out after 5 minutes', {
            generationId: id,
            elapsedTimeMs: elapsedTime
        });
        onFailure('Timed out after 5 minutes.', prompt, 'AIHorde');
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://aihorde.net/api/v2/generate/status/${id}`,
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                logDebug('AIHORDE', 'AI Horde status response received', {
                    generationId: id,
                    responseData: data,
                    isDone: data.done,
                    queuePosition: data.queue_position,
                    processing: data.processing,
                    waitTime: data.wait_time
                });

                if (data.done) {
                    const finalElapsedTime = Date.now() - startTime;
                    logInfo('AIHORDE', 'AI Horde generation completed successfully', {
                        generationId: id,
                        imagesGenerated: data.generations ? data.generations.length : 0,
                        totalElapsedTime: finalElapsedTime
                    });
                    
                    if (!data.generations || data.generations.length === 0) {
                        logError('AIHORDE', 'Generation completed but no images returned', {
                            generationId: id,
                            data: data
                        });
                        onFailure('Generation completed but no images were returned', prompt, 'AIHorde');
                        return;
                    }
                    
                    // Clear the status text when completing to prevent stale status
                    updateStatus('Completed!');
                    
                    const imageUrls = data.generations.map((gen) => gen.img);
                    onSuccess(imageUrls, prompt, 'AIHorde', model);
                } else {
                    let statusText = 'Waiting for worker...';
                    if (data.queue_position > 0) {
                        statusText = `Queue: ${data.queue_position}. Est: ${data.wait_time}s.`;
                        logInfo('AIHORDE', 'AI Horde generation waiting in queue', {
                            generationId: id,
                            queuePosition: data.queue_position,
                            estimatedWaitTime: data.wait_time,
                            statusText: statusText
                        });
                    } else if (data.processing > 0) {
                        // More user-friendly status with elapsed time
                        const elapsedSeconds = Math.floor(elapsedTime / 1000);
                        const minutes = Math.floor(elapsedSeconds / 60);
                        const seconds = elapsedSeconds % 60;
                        const timeStr = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
                        
                        statusText = `AI Horde: Generating... (${timeStr})`;
                        logInfo('AIHORDE', 'AI Horde generation actively processing', {
                            generationId: id,
                            processingWorkers: data.processing,
                            elapsedTime: timeStr,
                            statusText: statusText
                        });
                    } else {
                        logInfo('AIHORDE', 'AI Horde generation waiting for worker', {
                            generationId: id,
                            statusText: statusText
                        });
                    }
                    
                    // Call updateStatus with the detailed status information
                    // This ensures the status widget shows the specific AI Horde status
                    logDebug('AIHORDE', 'Calling updateStatus callback', {
                        generationId: id,
                        statusText: statusText,
                        elapsedTimeMs: elapsedTime
                    });
                    
                    updateStatus(statusText);
                    
                    setTimeout(() => checkStatus(id, prompt, startTime, model, { onSuccess, onFailure, updateStatus }), 5000);
                }
            } catch (e) {
                logError('AIHORDE', 'Error checking AI Horde status', {
                    generationId: id,
                    error: e.message,
                    responseText: response.responseText
                });
                onFailure(`Error checking status: ${e.message}`, prompt, 'AIHorde');
            }
        },
        onerror: (error) => {
            logError('AIHORDE', 'Failed to get status from AI Horde', {
                generationId: id,
                error: error
            });
            onFailure('Failed to get status from AI Horde.', prompt, 'AIHorde');
        },
    });
}

export async function generate(prompt, { onSuccess, onFailure, updateStatus }) {
    const config = await getConfig();
    const { aiHordeApiKey, aiHordeModel, aiHordeSampler, aiHordeCfgScale, aiHordeSteps, aiHordeWidth, aiHordeHeight, aiHordeSeed, aiHordePostProcessing, enableNegPrompt, globalNegPrompt } = config;
    
    logInfo('AIHORDE', 'Starting AI Horde generation', {
        promptLength: prompt.length,
        promptPreview: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        model: aiHordeModel,
        apiKeyProvided: !!aiHordeApiKey,
        hasNegativePrompt: enableNegPrompt && !!globalNegPrompt
    });

    const params = {
        sampler_name: aiHordeSampler,
        cfg_scale: parseFloat(aiHordeCfgScale),
        steps: parseInt(aiHordeSteps, 10),
        width: parseInt(aiHordeWidth, 10),
        height: parseInt(aiHordeHeight, 10),
    };
    if (aiHordeSeed) params.seed = aiHordeSeed;
    if (aiHordePostProcessing.length > 0) params.post_processing = aiHordePostProcessing;

    const payload = { prompt, params, models: [aiHordeModel] };
    if (enableNegPrompt && globalNegPrompt) {
        payload.negative_prompt = globalNegPrompt;
    }

    logDebug('AIHORDE', 'Sending generation request to AI Horde', {
        url: 'https://aihorde.net/api/v2/generate/async',
        model: aiHordeModel,
        params: params,
        hasNegativePrompt: !!payload.negative_prompt
    });

    updateStatus('Requesting...');

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://aihorde.net/api/v2/generate/async',
        headers: { 'Content-Type': 'application/json', apikey: aiHordeApiKey || '0000000000' },
        data: JSON.stringify(payload),
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                logDebug('AIHORDE', 'AI Horde API response received', {
                    status: response.status,
                    hasGenerationId: !!data.id,
                    message: data.message,
                    error: data.error
                });

                if (data.id) {
                    logInfo('AIHORDE', 'AI Horde generation request accepted', {
                        generationId: data.id,
                        model: aiHordeModel
                    });
                    
                    updateStatus('Waiting for status...');
                    checkStatus(data.id, prompt, Date.now(), aiHordeModel, { onSuccess, onFailure, updateStatus });
                } else {
                    if (data.message && data.message.toLowerCase().includes('model')) {
                        logError('AIHORDE', 'Model error from AI Horde API', {
                            error: data.message,
                            willRefreshModels: true
                        });
                        onFailure(`Model error: ${data.message}. Refreshing model list.`, prompt, 'AIHorde');
                        clearCachedModels('aiHorde');
                        return;
                    }
                    logError('AIHORDE', 'Failed to initiate generation', {
                        error: data.message || 'Unknown error',
                        responseData: data
                    });
                    throw new Error(data.message || 'Failed to initiate generation.');
                }
            } catch (e) {
                logError('AIHORDE', 'Error processing AI Horde response', {
                    error: e.message,
                    responseText: response.responseText
                });
                onFailure(e.message, prompt, 'AIHorde');
            }
        },
        onerror: (error) => {
            logError('AIHORDE', 'Network error during AI Horde request', {
                error: error
            });
            onFailure(JSON.stringify(error), prompt, 'AIHorde');
        },
    });
}