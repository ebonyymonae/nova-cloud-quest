
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameIntroProps {
  onStartGame: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStartGame }) => {
  const [currentDialogue, setCurrentDialogue] = useState(0);
  
  const dialogues = [
    {
      speaker: "Nova",
      text: "Hi there! I'm Nova, and today's my first day as a Junior Cloud Engineer at SkyStack! 🚀",
      avatar: "👩‍💻"
    },
    {
      speaker: "Echo",
      text: "Welcome to the team, Nova! I'm Echo, your senior mentor. Ready to learn the ropes of AWS cloud engineering?",
      avatar: "🧙‍♂️"
    },
    {
      speaker: "Nova",
      text: "I'm excited but a bit nervous! I've studied the theory, but this is my first real cloud project...",
      avatar: "👩‍💻"
    },
    {
      speaker: "Echo",
      text: "Don't worry! We'll start with the basics and work our way up. Every cloud engineer started where you are now. Let's begin your journey! ⚡",
      avatar: "🧙‍♂️"
    }
  ];

  const handleNext = () => {
    if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(currentDialogue + 1);
    } else {
      onStartGame();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Game Title */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            Nova's Cloud Quest
          </h1>
          <p className="text-xl text-gray-300">
            An Interactive AWS Learning Adventure
          </p>
        </div>

        {/* Character Dialogue */}
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-8 animate-scale-in">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="text-6xl">{dialogues[currentDialogue].avatar}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">
                  {dialogues[currentDialogue].speaker}
                </h3>
                <p className="text-lg text-gray-100 leading-relaxed">
                  {dialogues[currentDialogue].text}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-2">
                {dialogues.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentDialogue ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all hover:scale-105"
              >
                {currentDialogue < dialogues.length - 1 ? 'Next' : 'Start Quest!'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="bg-black/30 backdrop-blur-lg border-blue-500/30 text-center p-6">
            <div className="text-4xl mb-3">🧩</div>
            <h3 className="text-lg font-bold text-blue-400 mb-2">Interactive Challenges</h3>
            <p className="text-gray-300 text-sm">Solve real-world cloud puzzles</p>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-lg border-green-500/30 text-center p-6">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-lg font-bold text-green-400 mb-2">Skill Progression</h3>
            <p className="text-gray-300 text-sm">Earn XP and unlock badges</p>
          </Card>
          
          <Card className="bg-black/30 backdrop-blur-lg border-yellow-500/30 text-center p-6">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-bold text-yellow-400 mb-2">Mentorship</h3>
            <p className="text-gray-300 text-sm">Learn from Echo's guidance</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
