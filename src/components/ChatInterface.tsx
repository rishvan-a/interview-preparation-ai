
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserRound, Send } from 'lucide-react';

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

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hi! I'm your AI Interview Coach. I see you're preparing for a ${jobTitle} position. Would you like to start practicing interview questions?`,
          sender: 'coach',
          timestamp: new Date()
        }
      ]);
    }
  }, [jobTitle]);

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

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        id: messages.length + 2,
        text: "Great! Let's focus on your technical skills first. Are you ready for the first question?",
        sender: 'coach',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardContent className="p-6">
        <div className="space-y-4">
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
                    <AvatarFallback className="bg-coach-500 text-white">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
