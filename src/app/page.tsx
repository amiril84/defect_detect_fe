'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';

interface AnalysisResult {
  imageName: string;
  imagePath: string;
  thumbnailPath: string;
  defect: string;
  explanation: string;
}

export default function Home() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let files: FileList;
      if ('dataTransfer' in e) {
        files = e.dataTransfer.files;
      } else {
        files = e.target.files as FileList;
      }

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen p-8 bg-neutral-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-neutral-900">
          Wood Defect Detection
        </h1>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center cursor-pointer hover:border-neutral-400 transition-colors"
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
              className="mx-auto h-12 w-12 text-neutral-400"
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
            <p className="text-neutral-500">
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
                          src={`http://localhost:3001/uploads/${result.thumbnailPath}`}
                          alt={result.imageName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <div className="relative h-[600px]">
                        <Image
                          src={`http://localhost:3001/uploads/${result.imagePath}`}
                          alt={result.imageName}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        result.defect === 'yes' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {result.defect === 'yes' ? 'Defect Detected' : 'No Defect'}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      {result.explanation}
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
