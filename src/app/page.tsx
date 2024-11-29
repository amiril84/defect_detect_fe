'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';

interface AnalysisResult {
  imageName: string;
  imagePath: string;
  thumbnailPath: string;
  analysis: {
    object: string;
    defective: string;
    explanation: string;
  };
}

// Backend API URL
const API_URL = 'https://objects-defect-detection-backend-production.up.railway.app';

export default function Home() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    clearError();

    let files: FileList | null = null;
    if ('dataTransfer' in e) {
      files = e.dataTransfer.files;
    } else {
      files = e.target.files;
    }

    // Check if files were actually selected
    if (!files || files.length === 0) {
      setError("Please select at least one image file to analyze.");
      return;
    }

    // Validate file types
    const invalidFiles = Array.from(files).filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError("Please upload only image files (JPG, PNG).");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results.map((result: AnalysisResult) => ({
          ...result,
          imagePath: `${API_URL}/uploads/${result.imagePath}`,
          thumbnailPath: `${API_URL}/uploads/${result.thumbnailPath}`
        })));
        clearError();
      } else {
        throw new Error(data.error || 'Failed to analyze images');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if ('target' in e) {
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen p-8 bg-neutral-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center text-neutral-900">
            Object Defect Detection
          </h1>
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <p className="text-lg text-neutral-700">
              Upload images of objects to analyze them for defects. Our AI will:
            </p>
            <ul className="text-neutral-600 space-y-1">
              <li>✓ Identify the type of object</li>
              <li>✓ Detect if any defects are present</li>
              <li>✓ Provide a detailed explanation of the condition</li>
            </ul>
            <p className="text-sm text-neutral-500 mt-4">
              You can upload multiple images at once. Click on thumbnails to view full-size images.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            error 
              ? 'border-red-300 hover:border-red-400 bg-red-50' 
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
          onDrop={onDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onDrop}
          />
          <div className="space-y-4">
            <svg
              className={`mx-auto h-12 w-12 ${error ? 'text-red-400' : 'text-neutral-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-lg">
              Drop images here or click to upload
            </div>
            <p className={`${error ? 'text-red-500' : 'text-neutral-500'}`}>
              Supported formats: JPG, PNG
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isUploading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            <p className="mt-2">Analyzing images...</p>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate">
                    {result.imageName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative h-48 cursor-pointer">
                        <Image
                          src={result.thumbnailPath}
                          alt={result.imageName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogTitle className="sr-only">
                        {result.imageName}
                      </DialogTitle>
                      <div className="relative h-[600px]">
                        <Image
                          src={result.imagePath}
                          alt={result.imageName}
                          fill
                          sizes="100vw"
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Object:</span>
                      <span>{result.analysis.object}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        result.analysis.defective === 'yes' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {result.analysis.defective === 'yes' ? 'Defect Detected' : 'No Defect'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {result.analysis.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
