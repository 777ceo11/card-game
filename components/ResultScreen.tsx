'use client';

import React from 'react';

interface ResultScreenProps {
  userName: string;
  time: number;
  score: number;
  moves: number;
  ranking: any[];
  onRestart: () => void;
  onHome: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ userName, time, score, moves, ranking, onRestart, onHome }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-10 min-h-[70vh] justify-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-black text-primary drop-shadow-sm">Amazing!</h1>
        <p className="text-xl text-foreground/80 font-bold">{userName}, you finished the game!</p>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center w-full max-w-md">
        <div className="stat-bubble bg-[#fbe7d1] flex-1 min-w-[120px]">
          <span className="text-[10px] font-black uppercase opacity-40">Score</span>
          <p className="text-3xl font-black">{score.toLocaleString()}</p>
        </div>
        <div className="stat-bubble bg-[#f4ff81]/40 flex-1 min-w-[120px]">
          <span className="text-[10px] font-black uppercase opacity-40">Moves</span>
          <p className="text-3xl font-black">{moves}</p>
        </div>
        <div className="stat-bubble bg-white flex-1 min-w-[120px]">
          <span className="text-[10px] font-black uppercase opacity-40">Time</span>
          <p className="text-3xl font-black">{time}s</p>
        </div>
      </div>

      {ranking.length > 0 && (
        <div className="w-full max-w-sm space-y-3 bg-white/50 p-6 rounded-[2.5rem] border-2 border-primary/10">
          <h2 className="text-xl font-black text-primary/60 flex items-center justify-center gap-2">
            🏆 TOP 3 RANKING
          </h2>
          <div className="space-y-2">
            {ranking.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 rounded-2xl ${
                  idx === 0 ? 'bg-primary text-white scale-105 shadow-lg' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-black opacity-60 w-4">{idx + 1}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    idx === 0 ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    {item.name?.[0].toUpperCase() || '?'}
                  </div>
                  <span className="font-bold">{item.name}</span>
                </div>
                <span className="font-black text-sm">{item.finishTime}s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ranking.length === 0 && (
        <p className="text-primary/40 font-bold animate-pulse">Loading ranking...</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-4">
        <button onClick={onRestart} className="btn-start flex-1">
          Play Again
        </button>
        <button onClick={onHome} className="btn-secondary flex-1 rounded-[2rem] py-3 font-bold border-2 border-[#d7ccc8] text-[#8d6e63]">
          Home
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
