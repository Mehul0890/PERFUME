import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage, OutputConfig, GeneratedImageData, GeneratedImage } from '../types';

const MODEL_NAME = 'gemini-2.5-flash-image';

// Fix: Per coding guidelines, initialize GoogleGenAI directly with the API key
// from environment variables, assuming it is always available.
console.log("process.env.API_KEY",import.meta.env.VITE_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY! });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64Data.split(',')[1],
            mimeType
        },
    };
};

const generateSingleImage = async (
    baseImage: UploadedImage,
    prompt: string
): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(baseImage.base64, baseImage.mimeType);

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [imagePart, { text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const newImagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (newImagePart?.inlineData) {
            const newBase64 = newImagePart.inlineData.data;
            const mimeType = newImagePart.inlineData.mimeType;
            return `data:${mimeType};base64,${newBase64}`;
        } else {
            throw new Error('No image was generated in the response.');
        }
    } catch (error: any) {
        console.error("Error generating single image:", error);
        // Stringify the error to robustly check for quota-related messages.
        const errorString = JSON.stringify(error);
        if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
             throw new Error(
                'You exceeded your current quota. Please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit.'
            );
        }
        throw new Error(`Failed to generate image. Please try again later.`);
    }
};

export const generateCreativeImages = async (
    baseImage: UploadedImage,
    configs: OutputConfig[]
): Promise<GeneratedImageData> => {
    const allPromises: Promise<GeneratedImage>[] = [];
    
    for (const config of configs) {
        for (let i = 0; i < config.count; i++) {
            const promise = generateSingleImage(baseImage, config.prompt)
                .then(src => ({ id: config.id, src }));
            allPromises.push(promise);
        }
    }

    const results = await Promise.allSettled(allPromises);

    const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<GeneratedImage> => result.status === 'fulfilled')
        .map(result => result.value);

    if (successfulResults.length === 0) {
        const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
        throw new Error(firstError?.reason?.message || "All image generation requests failed.");
    }
    
    const organizedResults: GeneratedImageData = {};
    for (const config of configs) {
        organizedResults[config.id] = successfulResults.filter(image => image.id === config.id);
    }
    
    return organizedResults;
};