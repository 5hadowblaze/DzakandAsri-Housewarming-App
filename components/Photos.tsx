import React, { useState, useCallback } from 'react';

const PhotoGrid: React.FC = () => {
    const images = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        src: `https://picsum.photos/seed/${i+10}/600/${Math.floor(Math.random() * 200) + 600}`,
        alt: `Housewarming party photo ${i + 1}`,
    }));

    return (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map(image => (
                <div key={image.id} className="overflow-hidden rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
                    <img src={image.src} alt={image.alt} className="w-full h-auto" />
                </div>
            ))}
        </div>
    );
};

const PhotoUpload: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

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
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            e.dataTransfer.clearData();
        }
    }, []);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files) {
        setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
      }
    }

    return (
        <div className="p-6 bg-gray-800 rounded-2xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-blue-300 mb-4 text-center">Share Your Snaps!</h3>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-2xl p-8 text-center transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-900/30' : 'border-gray-600 bg-gray-700/50'}`}
            >
                <input type="file" id="file-upload" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-gray-300">Drag & drop your photos here, or click to browse.</p>
                    <p className="text-sm text-gray-400 mt-1">Don't be shy, we want to see all the fun!</p>
                </label>
            </div>
            {files.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-200">Staged for Upload:</h4>
                    <ul className="list-disc list-inside text-gray-300">
                        {files.map((file, i) => <li key={i}>{file.name}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Photos: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <PhotoUpload />
            <PhotoGrid />
        </div>
    );
};

export default Photos;