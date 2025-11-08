import { getConfig } from '../utils/storage.js';

export async function generate(prompt, providerProfileUrl, { onSuccess, onFailure }) {
    const config = await getConfig();
    const activeUrl = providerProfileUrl || config.openAICompatActiveProfileUrl;
    const activeProfile = config.openAICompatProfiles[activeUrl];

    if (!activeProfile) {
        onFailure(`No active or valid Openai Compatible profile found for URL: ${activeUrl}`, prompt, 'OpenAICompat');
        return;
    }

    const url = `${activeUrl}/images/generations`;
    const payload = {
        model: activeProfile.model,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
    };

    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeProfile.apiKey}`,
        },
        data: JSON.stringify(payload),
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                if (data?.data?.[0]) {
                    const imageUrls = data.data.map(item => item.b64_json ? `data:image/png;base64,${item.b64_json}` : item.url).filter(Boolean);
                    if (imageUrls.length > 0) {
                        onSuccess(imageUrls, prompt, 'OpenAICompat', activeProfile.model);
                    } else {
                        throw new Error('API response did not contain usable image data.');
                    }
                } else {
                    throw new Error(JSON.stringify(data));
                }
            } catch (e) {
                onFailure(e.message, prompt, 'OpenAICompat', activeUrl);
            }
        },
        onerror: (error) => onFailure(JSON.stringify(error), prompt, 'OpenAICompat', activeUrl),
    });
}