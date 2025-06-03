import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Level, PlayerProgress } from '../types/game';

interface LevelSelectProps {
  onLevelSelect: (level: Level) => void;
  playerProgress: PlayerProgress;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ onLevelSelect, playerProgress }) => {
  const levels: Level[] = [
    {
      id: 'ec2-basics',
      title: 'EC2 Instance Setup',
      description: 'Help Nova launch her first EC2 instance and configure security groups',
      difficulty: 'beginner',
      type: 'multiple-choice',
      xpReward: 100,
      badge: 'EC2 Novice'
    },
    {
      id: 'iam-policy',
      title: 'IAM Security & Troubleshooting',
      description: 'Master IAM policies, roles, and solve access issues',
      difficulty: 'beginner',
      type: 'multiple-choice',
      xpReward: 150,
      badge: 'Security Conscious',
      prereq: ['ec2-basics']
    },
    {
      id: 'terraform-vpc',
      title: 'Terraform VPC Configuration',
      description: 'Use Infrastructure as Code to create a VPC with proper dependencies',
      difficulty: 'intermediate',
      type: 'multiple-choice',
      xpReward: 200,
      badge: 'IaC Architect',
      prereq: ['iam-policy']
    },
    {
      id: 'troubleshooting',
      title: 'AWS Troubleshooting',
      description: 'Debug common AWS issues and learn systematic problem-solving',
      difficulty: 'intermediate',
      type: 'multiple-choice',
      xpReward: 250,
      badge: 'Problem Solver',
      prereq: ['terraform-vpc']
    },
    {
      id: 'infrastructure-design',
      title: 'Infrastructure Design',
      description: 'Design highly available and scalable cloud architectures',
      difficulty: 'advanced',
      type: 'multiple-choice',
      xpReward: 300,
      badge: 'Cloud Architect',
      prereq: ['troubleshooting']
    },
    {
      id: 'boss-presentation',
      title: 'Client Architecture Presentation',
      description: 'Present a complete cloud architecture to SkyStack\'s biggest client!',
      difficulty: 'advanced',
      type: 'multiple-choice',
      xpReward: 500,
      badge: 'Master Architect',
      prereq: ['infrastructure-design']
    }
  ];

  const isLevelUnlocked = (level: Level) => {
    if (!level.prereq) return true;
    return level.prereq.every(prereq => 
      playerProgress.completedLevels.includes(prereq)
    );
  };

  const isLevelCompleted = (levelId: string) => {
    return playerProgress.completedLevels.includes(levelId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Choose Your Challenge
        </h2>
        <p className="text-xl text-gray-300">
          Nova's ready for her next cloud engineering task!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const unlocked = isLevelUnlocked(level);
          const completed = isLevelCompleted(level.id);
          
          return (
            <Card 
              key={level.id} 
              className={`relative transition-all duration-300 ${
                unlocked 
                  ? 'bg-black/40 backdrop-blur-lg border-purple-500/30 hover:border-purple-400/50 hover:scale-105 cursor-pointer' 
                  : 'bg-black/20 backdrop-blur-lg border-gray-600/30 opacity-50'
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getDifficultyColor(level.difficulty)} text-white`}>
                    {level.difficulty}
                  </Badge>
                  {completed && (
                    <div className="text-2xl">✅</div>
                  )}
                  {!unlocked && (
                    <div className="text-2xl">🔒</div>
                  )}
                </div>
                <CardTitle className="text-xl text-cyan-400">
                  Level {index + 1}: {level.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {level.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-yellow-400">
                    🌟 {level.xpReward} XP
                  </div>
                  {level.badge && (
                    <div className="text-sm text-purple-400">
                      🏆 {level.badge}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => unlocked && onLevelSelect(level)}
                  disabled={!unlocked}
                  className={`w-full ${
                    unlocked
                      ? completed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                      : 'bg-gray-600 cursor-not-allowed'
                  } text-white font-semibold`}
                >
                  {completed ? 'Replay Level' : unlocked ? 'Start Challenge' : 'Locked'}
                </Button>
                
                {level.prereq && !unlocked && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Complete previous levels to unlock
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelect;
