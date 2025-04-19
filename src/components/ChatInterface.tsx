
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRound, Send, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

interface ChatInterfaceProps {
  jobTitle: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ jobTitle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample interview questions
  const interviewQuestions = [
    `Hi! I'm your AI Interview Coach. I see you're preparing for a ${jobTitle} position. Would you like to start practicing interview questions?`,
    `Great! Let's start with a common technical question: Can you explain the difference between HTTP and HTTPS?`,
    `Excellent explanation! Next question: What is the importance of version control systems like Git in software development?`,
    `Well articulated! Now let's move to algorithms: Can you explain what a binary search is and when you would use it?`,
    `Very good! Let's try a behavioral question: Tell me about a time when you faced a challenging technical problem and how you solved it.`,
    `Thank you for sharing that experience! Last question: Where do you see yourself professionally in five years?`
  ];

  // Sample expected answers and suggestions
  const answerGuidelines = [
    { // Welcome message - any affirmative answer is acceptable
      keywords: ['yes', 'ok', 'sure', 'ready', 'start'],
      feedback: "I don't recognize your response. Please type 'yes' or 'ok' if you'd like to continue.",
      suggestion: "To proceed with the interview practice, please confirm by typing 'yes', 'ok', or something similar."
    },
    { // HTTP vs HTTPS
      keywords: ['secure', 'encryption', 'ssl', 'tls', 'certificate', 'https encrypts', 'http is not encrypted'],
      feedback: "Your answer about HTTP vs HTTPS could be more comprehensive. HTTPS adds security through encryption.",
      suggestion: "A strong answer would mention that HTTPS uses SSL/TLS encryption to secure data transmission, while HTTP transmits in plaintext. HTTPS uses port 443 and requires certificates, protecting against man-in-the-middle attacks."
    },
    { // Git importance
      keywords: ['version control', 'track changes', 'collaboration', 'history', 'branch', 'merge', 'rollback', 'revert'],
      feedback: "Your answer about version control systems could be expanded with more specific benefits.",
      suggestion: "A strong answer would highlight how Git enables tracking code changes, collaboration among developers, branching for parallel development, conflict resolution, and the ability to revert to previous versions if needed."
    },
    { // Binary search
      keywords: ['log n', 'logarithmic', 'sorted', 'divide', 'middle', 'half', 'efficient', 'search algorithm'],
      feedback: "Your explanation of binary search could include more technical details.",
      suggestion: "A strong answer would explain that binary search is an efficient O(log n) algorithm for finding elements in sorted arrays. It repeatedly divides the search interval in half, comparing the middle element to the target value. It's ideal for large sorted datasets."
    },
    { // Technical challenge
      keywords: ['problem', 'solution', 'challenge', 'resolved', 'approach', 'teamwork', 'learned'],
      feedback: "Your response could be structured better using the STAR method (Situation, Task, Action, Result).",
      suggestion: "A strong answer would describe a specific technical challenge, your approach to solving it, actions taken, and the results achieved. Include technologies used, collaboration involved, and lessons learned."
    },
    { // Five-year plan
      keywords: ['goals', 'growth', 'learn', 'develop', 'lead', 'expertise', 'skills', 'career path'],
      feedback: "Your career goals could be more specific and aligned with growth in the tech industry.",
      suggestion: "A strong answer would balance ambition with realism, mentioning technical skills you want to develop, leadership aspirations, and how you plan to grow in your career. Consider discussing specific roles, technologies, or domains you're interested in."
    }
  ];

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      const initialMessage = {
        id: 1,
        text: interviewQuestions[0],
        sender: 'coach' as const,
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);
      speakMessage(initialMessage.text);
    }
  }, [jobTitle]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle text-to-speech
  const speakMessage = (text: string) => {
    // Stop any currently playing audio
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    // Use the Web Speech API if available
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Try to get a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') ||
        voice.name.includes('Female')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "There was a problem with the speech synthesis.",
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Speech synthesis is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  // Evaluate user's answer based on keywords
  const evaluateAnswer = (userInput: string, questionIndex: number) => {
    if (questionIndex >= answerGuidelines.length) return true;
    
    const currentGuideline = answerGuidelines[questionIndex];
    const userInputLower = userInput.toLowerCase();
    
    // For the first question (welcome), any affirmative response is fine
    if (questionIndex === 0) {
      return currentGuideline.keywords.some(keyword => userInputLower.includes(keyword));
    }
    
    // For other questions, check if the answer contains at least some of the expected keywords
    const matchCount = currentGuideline.keywords.filter(keyword => 
      userInputLower.includes(keyword.toLowerCase())
    ).length;
    
    // Require at least 2 keywords for a passing answer, except for the first question
    return matchCount >= 2;
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Stop any current speech before starting new one
    stopSpeaking();
    
    // Evaluate the user's answer
    const isAnswerAcceptable = evaluateAnswer(input, currentQuestion);
    
    setTimeout(() => {
      if (isAnswerAcceptable) {
        // Proceed to the next question if the answer is acceptable
        const nextQuestion = Math.min(currentQuestion + 1, interviewQuestions.length - 1);
        setCurrentQuestion(nextQuestion);
        
        const coachResponse: Message = {
          id: messages.length + 2,
          text: interviewQuestions[nextQuestion],
          sender: 'coach',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, coachResponse]);
        speakMessage(coachResponse.text);
      } else {
        // Provide feedback and suggestions if the answer needs improvement
        const feedbackText = answerGuidelines[currentQuestion].feedback;
        const suggestionText = answerGuidelines[currentQuestion].suggestion;
        
        const feedbackMessage: Message = {
          id: messages.length + 2,
          text: `${feedbackText}\n\n${suggestionText}\n\nWould you like to try answering this question again?`,
          sender: 'coach',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, feedbackMessage]);
        speakMessage(feedbackMessage.text);
      }
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === 'coach' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/coach-avatar.png" alt="AI Coach" />
                    <AvatarFallback className="bg-primary text-white">
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  {message.text}
                  {message.sender === 'coach' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 h-6 w-6 rounded-full p-0"
                      onClick={() => speakMessage(message.text)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-500 text-white">
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
          {isSpeaking && (
            <Button onClick={stopSpeaking} size="icon" variant="outline">
              <VolumeX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
