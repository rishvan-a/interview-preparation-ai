
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, BookText } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: string;
  tips: string;
}

interface GeneratedQuestions {
  technical: Question[];
  behavioral: Question[];
}

interface QuestionDisplayProps {
  questions: GeneratedQuestions;
  jobTitle: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questions, jobTitle }) => {
  const [activeTab, setActiveTab] = useState<string>('technical');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Your Interview Preparation</CardTitle>
        <CardDescription>
          Personalized questions based on your {jobTitle} resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="technical" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="technical">Technical Questions</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical" className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              These technical questions are tailored to your skills and experience.
            </p>
            {questions.technical.map((question, index) => (
              <QuestionItem 
                key={question.id} 
                question={question} 
                index={index} 
                type="technical"
              />
            ))}
          </TabsContent>
          
          <TabsContent value="behavioral" className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              These behavioral questions help assess your soft skills and cultural fit.
            </p>
            {questions.behavioral.map((question, index) => (
              <QuestionItem 
                key={question.id} 
                question={question} 
                index={index}
                type="behavioral" 
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface QuestionItemProps {
  question: Question;
  index: number;
  type: 'technical' | 'behavioral';
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, index, type }) => {
  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value={`question-${question.id}`} className="border-none">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-start text-left">
            <span className="bg-coach-100 text-coach-700 rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">
              {index + 1}
            </span>
            <span>{question.question}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="flex items-center mb-2">
              <Check className="w-5 h-5 text-coach-500 mr-2" />
              <h4 className="font-medium text-gray-900">Sample Answer</h4>
            </div>
            <p className="text-gray-700">{question.answer}</p>
          </div>
          
          <div className="bg-coach-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <BookText className="w-5 h-5 text-coach-500 mr-2" />
              <h4 className="font-medium text-gray-900">Interview Tips</h4>
            </div>
            <p className="text-gray-700">{question.tips}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default QuestionDisplay;
