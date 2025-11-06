import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
                <SparklesIcon className="w-8 h-8 text-purple-400" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Perfume AI Creative Generator
                </h1>
            </div>
            <p className="max-w-3xl mx-auto text-lg text-gray-400">
                Upload your perfume product image and click 'Generate'. You will receive 13 unique images: 4 aesthetic, 1 text ad, 5 with models, and 3 creative ads. Use 'Download All' or download individually. Use 'Regenerate' for new variations without changing the product.
            </p>
        </header>
    );
};