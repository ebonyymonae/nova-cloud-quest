
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerProgress } from '../types/game';

interface CharacterProfileProps {
  progress: PlayerProgress;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ progress }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const skillBadges = [
    { name: 'EC2 Novice', icon: '🖥️', color: 'bg-blue-500' },
    { name: 'Security Conscious', icon: '🔒', color: 'bg-red-500' },
    { name: 'IaC Architect', icon: '🏗️', color: 'bg-green-500' },
    { name: 'Pipeline Pro', icon: '⚡', color: 'bg-yellow-500' },
    { name: 'Container Captain', icon: '🐳', color: 'bg-cyan-500' },
    { name: 'Cloud Architect', icon: '☁️', color: 'bg-purple-500' }
  ];

  const currentLevelXp = progress.level * 200;
  const nextLevelXp = (progress.level + 1) * 200;
  const xpProgress = ((progress.xp % 200) / 200) * 100;

  return (
    <div className="fixed top-4 left-4 z-50">
      <Card 
        className="bg-black/60 backdrop-blur-lg border-cyan-500/30 transition-all duration-300 cursor-pointer hover:border-cyan-400/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          {/* Collapsed View */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl">👩‍💻</div>
            <div>
              <h3 className="font-bold text-cyan-400">Nova</h3>
              <p className="text-xs text-gray-300">Level {progress.level} Engineer</p>
            </div>
            <div className="text-yellow-400 text-sm">
              {progress.xp} XP
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          
          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 animate-fade-in">
              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">
                  Earned Badges ({progress.badges.length}/6)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {skillBadges.map((badge, index) => {
                    const earned = progress.badges.includes(badge.name);
                    return (
                      <div 
                        key={badge.name}
                        className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                          earned 
                            ? 'bg-gradient-to-r from-gray-700 to-gray-600 border border-cyan-500/30' 
                            : 'bg-gray-800/50 opacity-50'
                        }`}
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-xs text-gray-300">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Next Level: {nextLevelXp - progress.xp} XP needed
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterProfile;
