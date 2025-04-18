
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
    
    // Progress to the next question when user responds
    setTimeout(() => {
      // Increment the question counter but don't exceed the available questions
      const nextQuestion = Math.min(currentQuestion + 1, interviewQuestions.length - 1);
      setCurrentQuestion(nextQuestion);
      
      const coachResponse: Message = {
        id: messages.length + 2,
        text: interviewQuestions[nextQuestion],
        sender: 'coach',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachResponse]);
      
      // Speak the coach's response
      speakMessage(coachResponse.text);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
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
