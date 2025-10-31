import React, { useState, useCallback } from 'react';
import { useEvents, useToasts } from '../../App';
import { Photo, PhotoStatus } from '../../types';

interface FileUpload {
  file: File;
  preview: string;
  status: 'waiting' | 'uploading' | 'done' | 'error';
  progress: number;
}

const UploadIcon: React.FC = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export const UploadsPage: React.FC = () => {
    const { events, addPhotosToEvent } = useEvents();
    const { addToast } = useToasts();
    const [selectedEventId, setSelectedEventId] = useState<string>(() => events.length > 0 ? events[0].id : '');
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback((selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const filesArray = Array.from(selectedFiles);
        // Prevent adding duplicates
        const newUploads = filesArray
            .filter(file => !files.some(f => f.file.name === file.name))
            .map(file => ({
                file,
                preview: '', // Placeholder, will be replaced by data URL
                status: 'waiting' as const,
                progress: 0,
            }));
        
        setFiles(prev => [...prev, ...newUploads]);

        // Use FileReader to create data URLs for previews
        newUploads.forEach(upload => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFiles(currentFiles => 
                    currentFiles.map(f => 
                        f.file.name === upload.file.name 
                        ? { ...f, preview: reader.result as string } 
                        : f
                    )
                );
            };
            reader.readAsDataURL(upload.file);
        });
    }, [files]);

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
            handleFileChange(e.dataTransfer.files);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(files.filter(f => f.file.name !== fileName));
    };

    const handleUpload = async () => {
        if (!selectedEventId) {
            addToast('Please select an event.', 'error');
            return;
        }
        if (files.filter(f => f.status === 'waiting').length === 0) {
            addToast('Please add files to upload.', 'error');
            return;
        }

        setIsUploading(true);
        const uploadedPhotos: Photo[] = [];
        const filesToUpload = files.filter(f => f.status === 'waiting');

        for (const fileUpload of filesToUpload) {
            // Simulate upload progress
            await new Promise(resolve => {
                setFiles(prev => prev.map(f => f.file.name === fileUpload.file.name ? { ...f, status: 'uploading' } : f));
                const interval = setInterval(() => {
                    setFiles(prev => {
                        const currentFile = prev.find(f => f.file.name === fileUpload.file.name);
                        if (!currentFile || currentFile.progress >= 100) {
                            clearInterval(interval);
                            resolve(true);
                            return prev;
                        }
                        return prev.map(f => {
                            if (f.file.name === fileUpload.file.name) {
                                return { ...f, progress: Math.min(f.progress + 20, 100) };
                            }
                            return f;
                        });
                    });
                }, 200);
            });

            // Create a new photo object using the data URL
            const newPhoto: Photo = {
                id: `${selectedEventId}-photo-${Date.now()}-${Math.random()}`,
                eventId: selectedEventId,
                objectKey: `events/${selectedEventId}/${fileUpload.file.name}`,
                url: fileUpload.preview, // Using data URL
                thumbUrl: fileUpload.preview, // Using data URL for thumb as well
                status: PhotoStatus.PENDING,
                tags: [],
                createdAt: new Date(),
            };
            uploadedPhotos.push(newPhoto);
            setFiles(prev => prev.map(f => f.file.name === fileUpload.file.name ? { ...f, status: 'done' } : f));
        }

        addPhotosToEvent(selectedEventId, uploadedPhotos);
        addToast(`${uploadedPhotos.length} photos added to "${events.find(e=>e.id === selectedEventId)?.name}"!`, 'success');
        setIsUploading(false);
        setFiles([]);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-five16-mint mb-6">Upload Photos</h1>
            <div className="bg-five16-dark p-8 rounded-lg">
                <div className="max-w-xl mx-auto">
                    {events.length > 0 ? (
                        <div className="mb-6">
                            <label htmlFor="event-select" className="block text-sm font-medium text-five16-mint mb-2">
                                1. Select Event to Upload To
                            </label>
                            <select
                                id="event-select"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                className="w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
                                disabled={isUploading}
                            >
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>{event.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-center text-yellow-400 mb-4">No events found. Please create an event before uploading photos.</p>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-five16-mint mb-2">
                           2. Add Photos
                        </label>
                        <div
                            onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop}
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md transition-colors ${isDragging ? 'bg-gray-700 border-five16-teal' : ''}`}
                        >
                            <div className="space-y-1 text-center">
                                <UploadIcon />
                                <div className="flex text-sm text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-five16-dark rounded-md font-medium text-five16-teal hover:text-five16-mint focus-within:outline-none">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={e => handleFileChange(e.target.files)} accept="image/*" disabled={isUploading} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF, etc.</p>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-five16-mint mb-2">Files to Upload</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {files.map(f => (
                                    <li key={f.file.name} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <img src={f.preview || 'https://via.placeholder.com/40'} alt="preview" className="h-10 w-10 rounded-md object-cover flex-shrink-0"/>
                                            <span className="text-sm text-gray-300 truncate">{f.file.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 flex-shrink-0">
                                            {f.status === 'uploading' && (
                                                <div className="w-20 bg-gray-600 rounded-full h-2.5">
                                                    <div className="bg-five16-teal h-2.5 rounded-full" style={{ width: `${f.progress}%` }}></div>
                                                </div>
                                            )}
                                            {f.status === 'done' && <span className="text-green-400 text-sm">Done!</span>}
                                            {!isUploading && f.status === 'waiting' && (
                                                <button onClick={() => removeFile(f.file.name)} className="text-red-400 hover:text-red-600 text-lg font-bold leading-none">&times;</button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || files.filter(f => f.status === 'waiting').length === 0 || !selectedEventId}
                        className="w-full bg-five16-teal text-five16-dark font-bold py-3 px-4 rounded-md hover:bg-five16-mint transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'waiting').length} File(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};