
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ResumeData {
  jobTitle: string;
  skills: string[];
  experience: string;
  education: string;
}

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

export const useQuestionGenerator = (resumeData: ResumeData | null) => {
  const [questions, setQuestions] = useState<GeneratedQuestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateQuestions = async () => {
      if (!resumeData) return;
      
      setIsGenerating(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, we would make an API call to an AI service here
        const generatedQuestions = generateMockQuestions(resumeData);
        setQuestions(generatedQuestions);
      } catch (error) {
        console.error('Error generating questions:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate interview questions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsGenerating(false);
      }
    };

    if (resumeData) {
      generateQuestions();
    }
  }, [resumeData, toast]);

  return { questions, isGenerating };
};

// Mock question generator - in a real application, this would use Claude API
const generateMockQuestions = (resumeData: ResumeData): GeneratedQuestions => {
  const { jobTitle, skills } = resumeData;
  
  // Technical questions based on job title and skills
  const technicalQuestions: Question[] = [
    {
      id: 1,
      question: `Can you explain how you've used ${skills[0]} in your previous projects?`,
      answer: `When discussing my experience with ${skills[0]}, I emphasize specific projects where I applied this skill to solve real problems. For example, in my most recent role, I used ${skills[0]} to develop a solution that improved process efficiency by 30%. I focus on explaining my technical approach, the challenges I faced, and the measurable outcomes achieved.`,
      tips: "Be specific about your technical contributions and quantify the impact of your work whenever possible. Use the STAR method (Situation, Task, Action, Result) to structure your response."
    },
    {
      id: 2,
      question: `What's your approach to learning new technologies like ${skills.length > 1 ? skills[1] : "frameworks related to your field"}?`,
      answer: "My approach to learning new technologies involves a combination of structured learning and practical application. I typically start with documentation and tutorials to understand the fundamentals, then reinforce my learning by building small projects. I also participate in online communities and collaborate with peers to gain different perspectives and solve problems collaboratively.",
      tips: "Emphasize your self-motivation and systematic approach to acquiring new skills. Provide examples of technologies you've recently learned and how you applied them in real situations."
    },
    {
      id: 3,
      question: `Describe a challenging technical problem you've solved in your previous roles as a ${jobTitle}.`,
      answer: "When faced with challenging technical problems, I follow a systematic troubleshooting approach. In a recent project, we encountered [specific problem]. I first gathered all available information, broke down the issue into smaller components, and prioritized the most critical aspects. After identifying the root cause through [specific methods], I implemented [specific solution] which resulted in [specific outcome].",
      tips: "Choose an example that showcases your technical depth and problem-solving methodology. Explain your thought process and decision-making rationale clearly."
    },
    {
      id: 4,
      question: `How do you ensure code quality and best practices in your ${jobTitle} role?`,
      answer: "I ensure code quality through a multi-faceted approach that includes following established coding standards, implementing automated testing with high coverage, conducting regular code reviews, and using static analysis tools. I believe in the importance of documenting code for future maintainability and practicing continuous refactoring to improve design patterns and eliminate technical debt.",
      tips: "Mention specific tools or methodologies you've used for quality assurance. Discuss how you balance quality with delivery timelines and how you address technical debt."
    },
    {
      id: 5,
      question: `What metrics do you use to evaluate the success of your work as a ${jobTitle}?`,
      answer: "As a ${jobTitle}, I evaluate success using both technical and business metrics. Technical metrics include code quality measurements like test coverage, bug rates, and system performance indicators. Business metrics focus on user adoption, customer satisfaction, and how my technical solutions impact key business KPIs. I believe the most successful technical work directly contributes to business objectives while maintaining high technical standards.",
      tips: "Connect technical achievements to business outcomes. Show that you understand the bigger picture and how your role contributes to organizational goals."
    },
  ];
  
  // HR/Behavioral questions
  const behavioralQuestions: Question[] = [
    {
      id: 1,
      question: "Tell me about a time when you had to work under a tight deadline. How did you manage it?",
      answer: "When faced with tight deadlines, I prioritize work strategically and maintain clear communication. For example, in my previous role, we had an unexpected client request that needed to be completed within half the normal timeframe. I immediately assessed what was needed, broke down the work into manageable components, and collaborated with team members to distribute tasks based on individual strengths. I set up daily quick check-ins to monitor progress and address blockers. Through effective prioritization and team coordination, we delivered the project on time without compromising quality.",
      tips: "Emphasize your time management skills, ability to prioritize, and communication strategy. Provide a specific example with a clear beginning, middle, and successful conclusion."
    },
    {
      id: 2,
      question: "How do you handle conflicts within a team?",
      answer: "I approach conflicts with a focus on open communication and finding common ground. In one instance, there was disagreement in my team about the technical approach for a project. I organized a meeting where each person could express their perspective without interruption. Then, I guided the discussion toward identifying the strengths in each approach and the underlying concerns. By focusing on our shared goals and evaluating options objectively against project requirements, we developed a hybrid solution that incorporated the best elements from different perspectives and ultimately led to a successful project outcome.",
      tips: "Show that you view conflict as an opportunity for growth and better solutions. Demonstrate active listening skills and an ability to find win-win resolutions."
    },
    {
      id: 3,
      question: "Describe a situation where you had to adapt to a significant change at work.",
      answer: "Adaptability is essential in today's fast-paced work environment. When our company underwent a major reorganization last year, my role and reporting structure changed significantly. I embraced this change by first taking time to understand the new objectives and expectations. I scheduled meetings with new stakeholders to build relationships and gain clarity on priorities. I also identified skills gaps for my new responsibilities and created a personal development plan to address them. By maintaining a positive attitude and focusing on the opportunities rather than the challenges, I was able to transition smoothly and contribute effectively in the new structure within two months.",
      tips: "Show resilience and a positive attitude toward change. Highlight your proactive approach to understanding and navigating new situations."
    },
    {
      id: 4,
      question: "What's your approach to managing multiple competing priorities?",
      answer: "Managing competing priorities requires systematic organization and regular reassessment. I maintain a prioritization system based on urgency, importance, and strategic value. Each morning, I review and adjust my priorities based on any new developments. I communicate proactively with stakeholders about timelines and potential constraints. When truly overloaded, I work with my manager to realign expectations or resources. This approach helped me successfully juggle three major projects simultaneously in my last role, all of which were delivered on time and met their objectives.",
      tips: "Demonstrate your organizational skills and ability to make difficult decisions about what takes precedence. Mention tools or systems you use to stay organized."
    },
    {
      id: 5,
      question: "Where do you see yourself professionally in five years?",
      answer: "In five years, I aim to have deepened my expertise in [specific area related to job] while developing broader leadership capabilities. I'm particularly interested in growing toward [specific relevant role or responsibility] where I can combine technical excellence with strategic thinking. I'm committed to continuous learning, and over the next few years, I plan to develop skills in [relevant emerging area] which I believe will be increasingly important in this industry. Ultimately, I want to be in a position where I can make significant contributions to challenging projects while helping to mentor and develop others in the team.",
      tips: "Show ambition that's aligned with the potential career path at the company. Balance technical growth with leadership development, and demonstrate that you've given thoughtful consideration to your career trajectory."
    },
  ];
  
  return {
    technical: technicalQuestions,
    behavioral: behavioralQuestions,
  };
};
