
import React from 'react';
import type { GeneratedImageData, OutputConfig } from '../types';
import { DownloadIcon } from './icons';

interface ImageCardProps {
    src: string;
    alt: string;
    index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, index }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `${alt}_${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-105">
            <img src={src} alt={`${alt} ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Download image"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
            </div>
        </div>
    );
};

interface GeneratedImagesGridProps {
    generatedData: GeneratedImageData;
    configs: OutputConfig[];
}

export const GeneratedImagesGrid: React.FC<GeneratedImagesGridProps> = ({ generatedData, configs }) => {
    return (
        <div className="space-y-12">
            {configs.map(config => {
                const images = generatedData[config.id];
                if (!images || images.length === 0) return null;

                return (
                    <section key={config.id}>
                        <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">{config.title} ({images.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {images.map((image, index) => (
                                <ImageCard key={`${image.id}-${index}`} src={image.src} alt={config.title} index={index} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};
