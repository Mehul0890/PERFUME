import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImagesGrid } from './components/GeneratedImagesGrid';
import { Loader } from './components/Loader';
import { DownloadIcon, RefreshCwIcon } from './components/icons';
import { generateCreativeImages } from './services/geminiService';
// Fix: Import `GeneratedImage` to use it for type annotation.
import type { GeneratedImageData, OutputConfig, UploadedImage, GeneratedImage } from './types';

const OUTPUT_CONFIGS: OutputConfig[] = [
    {
      id: "aesthetic_images",
      count: 4,
      title: "Aesthetic Set",
      prompt: "Create 4 high-quality aesthetic images featuring ONLY the uploaded perfume bottle exactly as it is. Do NOT modify or distort the product. Use elegant, minimal, and cool-toned backgrounds with soft lighting. Highlight the perfume bottle. Each image should be visually appealing, professional, and suitable for social media promotion."
    },
    {
      id: "text_ad_image",
      count: 1,
      title: "Text Ad",
      prompt: "Generate 1 creative advertisement-style image featuring the same perfume bottle exactly as it is. Include modern, bold text related to perfume marketing, such as slogans or taglines. Design should be clean, eye-catching, and professional, suitable for ads or banners."
    },
    {
      id: "model_images",
      count: 5,
      title: "Models",
      prompt: "Generate 5 images with a single professional male OR female model promoting the uploaded perfume bottle. Each image must feature only one model (no multiple models together). The perfume bottle must remain unchanged and clearly visible. The model should look elegant, confident, and luxurious. Use professional studio-style lighting, realistic skin tones, and high-fashion poses. Each image should feel like a high-end perfume advertisement."
    },
    {
      id: "creative_ad_images",
      count: 3,
      title: "Creative Ads",
      prompt: "Generate 3 unique creative advertisement images for the same perfume bottle. Each image should have a completely different style: one artistic, one luxury lifestyle, one modern minimal. Do not alter the product. Images should be visually striking, professional, and ad-ready."
    }
];

const ErrorMessage: React.FC<{ message: string | null }> = ({ message }) => {
    if (!message) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(urlRegex);

    return (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
                {parts.map((part, i) =>
                    urlRegex.test(part) ? (
                        <a href={part} key={i} target="_blank" rel="noopener noreferrer" className="underline hover:text-red-100 font-medium">
                            {part}
                        </a>
                    ) : (
                       part
                    )
                )}
            </span>
        </div>
    );
};


const App: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage({
                base64: reader.result as string,
                mimeType: file.type,
            });
            setGeneratedImages(null);
            setError(null);
        };
        reader.onerror = () => {
            setError("Failed to read the image file.");
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = useCallback(async () => {
        if (!uploadedImage) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);

        try {
            const results = await generateCreativeImages(uploadedImage, OUTPUT_CONFIGS);
            setGeneratedImages(results);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
        } finally {
            setIsLoading(false);
        }
    }, [uploadedImage]);

    const handleDownloadAll = () => {
        if (!generatedImages) return;
        // Fix: Explicitly type `image` as `GeneratedImage` to resolve TypeScript errors
        // about properties 'src' and 'id' not existing on type 'unknown'.
        Object.values(generatedImages).flat().forEach((image: GeneratedImage, index) => {
            const link = document.createElement('a');
            link.href = image.src;
            link.download = `perfume_creative_${image.id}_${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <ErrorMessage message={error} />
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {!generatedImages && (
                             <ImageUploader 
                                onImageUpload={handleImageUpload} 
                                uploadedImage={uploadedImage?.base64 || null}
                                onGenerate={handleGenerate}
                            />
                        )}

                        {generatedImages && (
                           <div className="mt-8">
                                <div className="sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                     <div className="flex items-center gap-4">
                                        <h2 className="text-xl sm:text-2xl font-semibold">Your Creatives are Ready</h2>
                                        {uploadedImage && <img src={uploadedImage.base64} alt="Uploaded Perfume" className="w-12 h-12 object-cover rounded-md border-2 border-purple-500" />}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleGenerate}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <RefreshCwIcon className="w-5 h-5" />
                                            Regenerate
                                        </button>
                                        <button
                                            onClick={handleDownloadAll}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                        >
                                            <DownloadIcon className="w-5 h-5" />
                                            Download All
                                        </button>
                                    </div>
                                </div>
                                <GeneratedImagesGrid generatedData={generatedImages} configs={OUTPUT_CONFIGS} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default App;