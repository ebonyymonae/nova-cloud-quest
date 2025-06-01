
import React, { useState } from 'react';
import GameIntro from '../components/GameIntro';
import LevelSelect from '../components/LevelSelect';
import GameLevel from '../components/GameLevel';
import CharacterProfile from '../components/CharacterProfile';
import { GameState, Level } from '../types/game';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [playerProgress, setPlayerProgress] = useState({
    xp: 0,
    level: 1,
    badges: [],
    completedLevels: []
  });

  const handleStartGame = () => {
    setGameState('levelSelect');
  };

  const handleLevelSelect = (level: Level) => {
    setCurrentLevel(level);
    setGameState('playing');
  };

  const handleLevelComplete = (xpGained: number, badgeEarned?: string) => {
    setPlayerProgress(prev => ({
      ...prev,
      xp: prev.xp + xpGained,
      badges: badgeEarned ? [...prev.badges, badgeEarned] : prev.badges,
      completedLevels: currentLevel ? [...prev.completedLevels, currentLevel.id] : prev.completedLevels
    }));
    setGameState('levelSelect');
    setCurrentLevel(null);
  };

  const handleBackToMenu = () => {
    setGameState('levelSelect');
    setCurrentLevel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Character Profile - Always visible */}
        <CharacterProfile progress={playerProgress} />

        {/* Main Game Content */}
        <div className="relative z-10">
          {gameState === 'intro' && (
            <GameIntro onStartGame={handleStartGame} />
          )}
          
          {gameState === 'levelSelect' && (
            <LevelSelect 
              onLevelSelect={handleLevelSelect}
              playerProgress={playerProgress}
            />
          )}
          
          {gameState === 'playing' && currentLevel && (
            <GameLevel 
              level={currentLevel}
              onComplete={handleLevelComplete}
              onBack={handleBackToMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
