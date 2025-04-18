
import React from 'react';

// This is a mock parser - in a real application, this would be server-side logic
const parseResume = (text: string) => {
  // This is a very simplified implementation
  // In a real app, we'd use NLP or AI to extract information accurately
  
  const extractedInfo = {
    jobTitle: extractJobTitle(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
  };
  
  return extractedInfo;
};

// Mock extraction functions
const extractJobTitle = (text: string) => {
  const jobTitlePatterns = [
    /Software Engineer/i, 
    /Data Scientist/i, 
    /Product Manager/i,
    /UX Designer/i,
    /Marketing Manager/i,
    /Business Analyst/i
  ];
  
  for (const pattern of jobTitlePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return "Software Professional"; // Default fallback
};

const extractSkills = (text: string) => {
  const commonSkills = [
    "JavaScript", "Python", "React", "Node.js", "SQL", "Java", 
    "C\\+\\+", "Machine Learning", "Data Analysis", "Project Management",
    "UI/UX", "Figma", "Adobe", "Marketing", "SEO", "Content Creation"
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    new RegExp(`\\b${skill.replace(/[+]/g, '\\+')}\\b`, 'i').test(text)
  );
  
  return foundSkills.length > 0 ? foundSkills : ["JavaScript", "React", "Communication"];
};

const extractExperience = (text: string) => {
  // Very simplified - in reality we'd use more sophisticated NLP
  const lines = text.split('\n');
  const experienceLines = lines.filter(line => 
    /experience|work|job|position|role/i.test(line)
  );
  
  return experienceLines.length > 0 
    ? experienceLines.slice(0, 3).join('\n') 
    : "Previous work experience in software development";
};

const extractEducation = (text: string) => {
  // Very simplified
  const lines = text.split('\n');
  const educationLines = lines.filter(line => 
    /education|university|college|degree|bachelor|master|phd/i.test(line)
  );
  
  return educationLines.length > 0 
    ? educationLines.slice(0, 2).join('\n') 
    : "Bachelor's Degree";
};

export { parseResume };
