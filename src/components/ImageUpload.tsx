'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload = ({ onImageSelect, currentImage, className }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null);
      onImageSelect(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Please select an image smaller than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    onImageSelect(null);
  }, [onImageSelect]);

  return (
    <div className={cn('w-full', className)}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Problem preview" 
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Click to change image
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">📷</span>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Add a photo of the problem
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported formats: JPG, PNG, GIF (max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;