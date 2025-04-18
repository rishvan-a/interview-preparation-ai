
import React from 'react';
import { Briefcase } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-coach-500 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-2xl font-bold">AI Interview Coach</h1>
        </div>
        <div className="text-sm">Prepare with confidence</div>
      </div>
    </header>
  );
};

export default Header;
