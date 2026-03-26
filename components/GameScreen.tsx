'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from './MemoryGame';

interface GameScreenProps {
  userName: string;
  gameState: GameState;
  time: number;
  score: number;
  moves: number;
  onPause: () => void;
  onRestart: () => void;
  onFinish: () => void;
  onHome: () => void;
  onMatch: () => void;
  onMove: () => void;
}

interface CardData {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FRUITS = ['🍍', '🍎', '🍌', '🍉', '🍇', '🍓', '🍊', '🥝'];

const GameScreen: React.FC<GameScreenProps> = ({ 
  userName, gameState, time, score, moves, onPause, onRestart, onFinish, onHome, onMatch, onMove 
}) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const initGame = useCallback(() => {
    const doubledFruits = [...FRUITS, ...FRUITS];
    const shuffled = doubledFruits
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (index: number) => {
    if (
      gameState !== 'PLAYING' || 
      isProcessing || 
      cards[index].isFlipped || 
      cards[index].isMatched ||
      flippedIndices.includes(index)
    ) return;

    const newIndices = [...flippedIndices, index];
    
    // Flip the card
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedIndices(newIndices);

    if (newIndices.length === 2) {
      setIsProcessing(true);
      onMove();
      
      const [firstIndex, secondIndex] = newIndices;
      
      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        // Match
        onMatch();
        setCards(prev => prev.map((card, idx) => 
          idx === firstIndex || idx === secondIndex 
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        ));
        setFlippedIndices([]);
        setIsProcessing(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const onFinishRef = React.useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      const timer = setTimeout(() => onFinishRef.current(), 1000);
      return () => clearTimeout(timer);
    }
  }, [cards]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center min-h-[90vh]">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="text-primary text-xl">🍊</span>
          <span className="font-black text-foreground text-xl">Fruit Match</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-full shadow-md text-white font-bold">
            <span className="text-sm">🕒</span>
            <span className="text-sm">{formatTime(time)}</span>
          </div>
          <button onClick={onRestart} className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:scale-110 transition-transform">
            <span>⟳</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-300 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center w-full max-w-lg mt-20 px-4 space-y-12 pb-32">
        {/* Stats Pods */}
        <div className="flex gap-4 w-full">
          <div className="stat-bubble flex-1 bg-[#fbe7d1]">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Score</span>
            <p className="text-2xl font-black text-foreground">{score.toLocaleString()}</p>
          </div>
          <div className="stat-bubble flex-1 bg-[#f4ff81]/40">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Moves</span>
            <p className="text-2xl font-black text-foreground">{moves}</p>
          </div>
        </div>

        {/* Game Board Container */}
        <div className="bg-[#fce4ce] p-6 rounded-[2.5rem] shadow-inner relative">
          {gameState === 'PAUSED' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm rounded-[2.5rem]">
              <span className="text-2xl font-black uppercase tracking-widest opacity-20">Paused</span>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
              >
                <div className="card-wrapper">
                  <div className={`card-inner ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}>
                    {/* Back side */}
                    <div className="card-face card-back">
                      <span className="text-white/40 font-bold text-xl">?</span>
                    </div>
                    {/* Front side */}
                    <div className="card-face card-front text-4xl">
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Control Pill */}
        <div className="control-bar shadow-lg">
          <button onClick={onPause} className="px-6 py-2 rounded-full bg-[#7a551b] text-white text-xs font-black tracking-widest hover:opacity-90 transition-opacity">
            {gameState === 'PAUSED' ? 'RESUME ▶️' : 'PAUSE ⏸️'}
          </button>
          <button onClick={onRestart} className="p-2 text-primary hover:rotate-180 transition-transform duration-500">
             <span>⟳</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-[2.5rem] flex justify-around items-center z-20">
        <div className="nav-item active">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-1 shadow-lg shadow-primary/30">
            🎮
          </div>
          PLAY
        </div>
        <div className="nav-item">
          <span className="text-2xl">🏆</span>
          LEADERBOARD
        </div>
        <div className="nav-item" onClick={onHome}>
          <span className="text-2xl">⚙️</span>
          SETTINGS
        </div>
      </footer>
    </div>
  );
};

export default GameScreen;
