'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import SetupScreen from './SetupScreen';
import GameScreen from './GameScreen';
import ResultScreen from './ResultScreen';

export type GameState = 'HOME' | 'PLAYING' | 'PAUSED' | 'RESULT';

const MemoryGame = () => {
  // --- Google Sheets Integration ---
  const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxqNTgLYIpnp8xjtvVfWmVLpwdYPcCuovtE0T_-6eRCHbQO0nrt6Wiew3dCXwvfCTZHmQ/exec"; 

  const [gameState, setGameState] = useState<GameState>('HOME');
  const [userName, setUserName] = useState('');
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [ranking, setRanking] = useState<any[]>([]);

  // Periodically update timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'PLAYING') {
      interval = setInterval(() => {
        if (startTime) {
          const now = Date.now();
          setTime(Math.floor((now - startTime + pausedTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime, pausedTime]);

  const fetchRanking = useCallback(async () => {
    if (!GAS_WEB_APP_URL) return;
    try {
      const response = await fetch(GAS_WEB_APP_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched ranking data:', data);
      setRanking(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch ranking:', err);
    }
  }, [GAS_WEB_APP_URL]);

  const saveResultToSheet = useCallback(async (finalName: string, finalTime: number) => {
    if (!GAS_WEB_APP_URL) return;
    try {
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          finishTime: finalTime,
        }),
      });
      console.log('Result saved to Google Sheets');
      // Wait a bit before fetching to ensure script processed the new entry
      setTimeout(fetchRanking, 1500);
    } catch (err) {
      console.error('Failed to save to Google Sheets:', err);
    }
  }, [GAS_WEB_APP_URL, fetchRanking]);

  const handleStartGame = useCallback((name: string) => {
    setUserName(name);
    setGameState('PLAYING');
    setTime(0);
    setScore(0);
    setMoves(0);
    setPausedTime(0);
    setStartTime(Date.now());
  }, []);

  const handlePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
      if (startTime) {
        setPausedTime(prev => prev + (Date.now() - startTime));
      }
      setStartTime(null);
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
      setStartTime(Date.now());
    }
  }, [gameState, startTime]);

  const handleRestart = useCallback(() => {
    setGameState('PLAYING');
    setTime(0);
    setScore(0);
    setMoves(0);
    setPausedTime(0);
    setStartTime(Date.now());
    setRanking([]);
  }, []);

  const handleFinish = useCallback(() => {
    setGameState('RESULT');
    let finalTime = time;
    if (startTime) {
      const currentSessionTime = Math.floor((Date.now() - startTime) / 1000);
      finalTime = time + currentSessionTime;
      setPausedTime(prev => prev + (Date.now() - startTime));
    }
    setStartTime(null);
    saveResultToSheet(userName, finalTime);
  }, [time, startTime, userName, saveResultToSheet]);

  const handleGoToHome = useCallback(() => {
    setGameState('HOME');
    setUserName('');
    setTime(0);
    setScore(0);
    setMoves(0);
    setPausedTime(0);
    setStartTime(null);
    setRanking([]);
  }, []);

  const incrementScore = useCallback(() => setScore(prev => prev + 100), []);
  const incrementMoves = useCallback(() => setMoves(prev => prev + 1), []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        {gameState === 'HOME' && (
          <SetupScreen onStart={handleStartGame} />
        )}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <GameScreen 
            userName={userName}
            gameState={gameState}
            time={time}
            score={score}
            moves={moves}
            onPause={handlePause}
            onRestart={handleRestart}
            onFinish={handleFinish}
            onHome={handleGoToHome}
            onMatch={incrementScore}
            onMove={incrementMoves}
          />
        )}
        {gameState === 'RESULT' && (
          <ResultScreen 
            userName={userName}
            time={time}
            score={score}
            moves={moves}
            ranking={ranking}
            onRestart={handleRestart}
            onHome={handleGoToHome}
          />
        )}
      </div>
    </div>
  );
};

export default MemoryGame;
