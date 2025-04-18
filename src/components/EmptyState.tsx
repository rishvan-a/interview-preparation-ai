
import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <FileQuestion className="h-16 w-16 text-coach-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">No Interview Questions Yet</h3>
      <p className="text-gray-500 max-w-md">
        Upload your resume to get personalized interview questions and sample answers tailored to your experience.
      </p>
    </div>
  );
};

export default EmptyState;
