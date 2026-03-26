'use client';

import React, { useState } from 'react';

interface SetupScreenProps {
  onStart: (name: string) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-10 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-12 h-12 bg-[#d4e157] rounded-full shadow-lg flex items-center justify-center animate-pop">
        <span className="text-xl">🌘</span>
      </div>
      <div className="absolute bottom-10 left-10 w-12 h-12 bg-[#d4e157] rounded-full shadow-lg flex items-center justify-center animate-pop" style={{ animationDelay: '1s' }}>
        <span className="text-lg">⭐</span>
      </div>

      {/* Logo Area */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl mb-4 border-4 border-white">
          <span className="text-4xl text-white">🍊</span>
        </div>
        <h1 className="text-5xl font-black text-foreground text-center leading-tight">
          Fruit<br />Match
        </h1>
      </div>
      
      {/* Welcome Card */}
      <div className="container-card w-full max-w-md text-center space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Welcome, Friend!</h2>
          <p className="text-sm opacity-60 font-medium">Ready to squeeze some points?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 pt-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's your name?"
              required
              className="input-playful"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl opacity-60">😊</span>
          </div>
          
          <button type="submit" className="btn-start w-full">
            START GAME
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current stroke-3">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;
