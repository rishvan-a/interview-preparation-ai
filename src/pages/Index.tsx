
import React, { useState, useEffect } from 'react';
import { parseResume } from '@/components/ResumeParser';
import { useQuestionGenerator } from '@/components/QuestionGenerator';
import FileUpload from '@/components/FileUpload';
import QuestionDisplay from '@/components/QuestionDisplay';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { Loader2 } from 'lucide-react';

interface ResumeData {
  jobTitle: string;
  skills: string[];
  experience: string;
  education: string;
}

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { questions, isGenerating } = useQuestionGenerator(resumeData);
  
  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices - this helps with voice availability in some browsers
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
      };
    }
  }, []);
  
  const handleFileProcessed = (text: string, fileName: string) => {
    const extractedData = parseResume(text);
    setResumeData(extractedData);
    setFileName(fileName);
    
    // Scroll to chat section after a short delay
    setTimeout(() => {
      document.getElementById('chat-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prepare for Your Next Interview</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get personalized interview questions and expert answers
            tailored to your experience and skills. Our AI coach will help you practice with voice interaction.
          </p>
        </section>

        <section className="mb-12">
          <FileUpload onFileProcessed={handleFileProcessed} />
        </section>

        {resumeData && (
          <section id="chat-section" className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Chat with Your AI Interview Coach</h2>
            <ChatInterface jobTitle={resumeData.jobTitle} />
          </section>
        )}

        <section id="questions-section" className="mb-8">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Analyzing Your Resume</h3>
              <p className="text-gray-500">
                Generating personalized interview questions based on your profile...
              </p>
            </div>
          ) : questions ? (
            <QuestionDisplay questions={questions} jobTitle={resumeData?.jobTitle || ''} />
          ) : (
            <EmptyState />
          )}
        </section>
        
        {questions && (
          <section className="text-center mb-12">
            <p className="text-sm text-gray-500">
              Using these questions and answers, practice your responses to build confidence for your interview.
            </p>
          </section>
        )}
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>AI Interview Coach &copy; {new Date().getFullYear()} - Personalized interview preparation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
