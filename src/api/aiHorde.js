import { getConfig } from '../utils/storage.js';
import { clearCachedModels } from '../utils/cache.js';

function checkStatus(id, prompt, startTime, model, { onSuccess, onFailure, updateStatus }) {
    if (Date.now() - startTime > 300000) { // 5 minute timeout
        onFailure('Timed out after 5 minutes.', prompt, 'AIHorde');
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://aihorde.net/api/v2/generate/status/${id}`,
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (data.done) {
                    const imageUrls = data.generations.map((gen) => gen.img);
                    onSuccess(imageUrls, prompt, 'AIHorde', model);
                } else {
                    let statusText = 'Waiting for worker...';
                    if (data.queue_position > 0) {
                        statusText = `Queue: ${data.queue_position}. Est: ${data.wait_time}s.`;
                    } else if (data.processing > 0) {
                        statusText = 'Generating...';
                    }
                    updateStatus(statusText);
                    setTimeout(() => checkStatus(id, prompt, startTime, model, { onSuccess, onFailure, updateStatus }), 5000);
                }
            } catch (e) {
                onFailure(`Error checking status: ${e.message}`, prompt, 'AIHorde');
            }
        },
        onerror: () => onFailure('Failed to get status from AI Horde.', prompt, 'AIHorde'),
    });
}

export async function generate(prompt, { onSuccess, onFailure, updateStatus }) {
    const config = await getConfig();
    const { aiHordeApiKey, aiHordeModel, aiHordeSampler, aiHordeCfgScale, aiHordeSteps, aiHordeWidth, aiHordeHeight, aiHordeSeed, aiHordePostProcessing, enableNegPrompt, globalNegPrompt } = config;
    
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

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://aihorde.net/api/v2/generate/async',
        headers: { 'Content-Type': 'application/json', apikey: aiHordeApiKey || '0000000000' },
        data: JSON.stringify(payload),
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (data.id) {
                    checkStatus(data.id, prompt, Date.now(), aiHordeModel, { onSuccess, onFailure, updateStatus });
                } else {
                    if (data.message && data.message.toLowerCase().includes('model')) {
                        onFailure(`Model error: ${data.message}. Refreshing model list.`, prompt, 'AIHorde');
                        clearCachedModels('aiHorde');
                        return;
                    }
                    throw new Error(data.message || 'Failed to initiate generation.');
                }
            } catch (e) {
                onFailure(e.message, prompt, 'AIHorde');
            }
        },
        onerror: (error) => onFailure(JSON.stringify(error), prompt, 'AIHorde'),
    });
}