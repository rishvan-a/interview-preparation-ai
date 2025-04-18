
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileType } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileType || (fileType !== 'pdf' && fileType !== 'docx')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, we would send this to a server for parsing
      // But for now, we'll use the FileReader API to read the file content
      const text = await readFileAsync(file);
      
      // This would normally be where parsing would happen on the backend
      // For now, we'll just pass the raw text
      onFileProcessed(text, file.name);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      toast.error('Failed to process file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = reject;
      
      reader.readAsText(file);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume to get personalized interview questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? 'border-coach-500 bg-coach-50' : 'border-gray-300'
          } transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-coach-500 mb-4" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your resume here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, DOCX
            </p>
            <Button disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Select File'}
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileInput}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 justify-center">
        Your resume information is used only to generate interview questions
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
