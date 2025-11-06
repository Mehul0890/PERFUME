
import React, { useCallback, useState } from 'react';
import { UploadCloudIcon, ImagePlusIcon } from './icons';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    uploadedImage: string | null;
    onGenerate: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage, onGenerate }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    }, [onImageUpload]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center transition-all duration-300">
            {!uploadedImage ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className={`p-10 rounded-xl transition-colors duration-300 ${isDragging ? 'bg-gray-700' : ''}`}
                >
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 text-gray-400">
                        <UploadCloudIcon className="w-16 h-16 text-gray-500" />
                        <span className="text-xl font-semibold text-gray-300">Drag & Drop your image here</span>
                        <span className="text-gray-500">or</span>
                        <span className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Browse File
                        </span>
                        <p className="text-sm mt-2">PNG or JPG supported</p>
                    </label>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-semibold text-gray-200">Your Product Image</h2>
                    <div className="relative group">
                         <img src={uploadedImage} alt="Uploaded Perfume" className="max-h-80 rounded-lg shadow-lg shadow-black/30" />
                         <label htmlFor="file-upload-replace" className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg">
                            <ImagePlusIcon className="w-10 h-10 mb-2"/>
                            Change Image
                         </label>
                         <input
                            type="file"
                            id="file-upload-replace"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button
                        onClick={onGenerate}
                        className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg text-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
                    >
                        Generate Creatives
                    </button>
                </div>
            )}
        </div>
    );
};
