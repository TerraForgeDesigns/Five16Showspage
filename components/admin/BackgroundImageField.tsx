import React, { useState, useRef, useCallback } from "react";
import { uploadEventImage } from "../../services/uploads";
import { useToasts } from "../../contexts/ToastContext";

interface BackgroundImageFieldProps {
  value?: string;
  onChange: (url?: string) => void;
  alt?: string;
  onAltChange: (alt: string) => void;
}

export function BackgroundImageField({ value, onChange, alt, onAltChange }: BackgroundImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToasts();

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadEventImage(file);
      onChange(url);
      addToast("Image uploaded successfully!", "success");
    } catch (error: any) {
      addToast(error.message || "Upload failed", "error");
      console.error(error);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-five16-mint">Event Background Image</label>

      {value ? (
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-gray-700">
          <div className="aspect-video bg-gray-900/50">
            <img src={value} alt={alt || "Event background preview"} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-3 p-3 bg-gray-800/50">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-gray-600 hover:bg-gray-700 transition-colors"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-red-600/80 hover:bg-red-600 transition-colors"
              onClick={() => onChange(undefined)}
              disabled={uploading}
            >
              Remove
            </button>
             <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="sr-only"
                disabled={uploading}
            />
          </div>
        </div>
      ) : (
        <div
            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
            className={`flex justify-center items-center w-full max-w-lg p-6 border-2 border-gray-600 border-dashed rounded-md transition-colors ${isDragging ? 'bg-gray-700 border-five16-teal' : 'bg-gray-900/50'}`}
        >
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-400">
              <button
                type="button"
                className="font-medium text-five16-teal hover:text-five16-mint"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                Click to upload
              </button>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 8MB</p>
            {uploading && <p className="text-sm text-gray-400 mt-2">Uploading...</p>}
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="sr-only"
                disabled={uploading}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="bg-alt" className="block text-sm font-medium text-five16-mint mb-2">Background Image Alt Text</label>
        <input
          id="bg-alt"
          className="w-full max-w-lg bg-gray-900/50 border-gray-700 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
          placeholder="e.g., A vibrant concert stage with lights"
          value={alt || ""}
          onChange={(e) => onAltChange(e.target.value)}
        />
      </div>
    </div>
  );
}
