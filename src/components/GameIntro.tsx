
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GameInstructions from './GameInstructions';

interface GameIntroProps {
  onStartGame: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStartGame }) => {
  const [currentDialogue, setCurrentDialogue] = useState(0);

  const dialogues = [
    {
      speaker: "Echo",
      avatar: "🧙‍♂️",
      text: "Welcome to SkyStack Academy, Nova! I'm Echo, your cloud engineering mentor. Ready to master AWS together?"
    },
    {
      speaker: "Nova",
      avatar: "👩‍💻",
      text: "I'm excited but nervous, Echo! I've heard AWS can be overwhelming. Where do we start?"
    },
    {
      speaker: "Echo",
      avatar: "🧙‍♂️",
      text: "Perfect attitude! We'll start with the fundamentals - EC2, IAM, and Infrastructure as Code. Each challenge builds on the last."
    },
    {
      speaker: "Nova",
      avatar: "👩‍💻",
      text: "That sounds manageable! I'm ready to begin my cloud engineering journey!"
    }
  ];

  const handleNext = () => {
    if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(currentDialogue + 1);
    } else {
      onStartGame();
    }
  };

  const currentChar = dialogues[currentDialogue];

  return (
    <div className="container mx-auto p-6 pt-20">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          SkyStack Academy
        </h1>
        <p className="text-xl text-gray-300">Your Journey to Cloud Engineering Mastery</p>
      </div>

      {/* Instructions */}
      <GameInstructions />

      {/* Dialogue */}
      <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-6 max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="text-6xl">{currentChar.avatar}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-cyan-400 mb-3">{currentChar.speaker}</h3>
              <p className="text-lg text-gray-100 leading-relaxed italic">
                "{currentChar.text}"
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
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
            >
              {currentDialogue < dialogues.length - 1 ? 'Next' : 'Start Quest!'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Background Elements */}
      <div className="fixed bottom-10 right-10 text-6xl opacity-20 animate-pulse">
        ☁️
      </div>
      <div className="fixed bottom-20 left-10 text-4xl opacity-20 animate-pulse delay-1000">
        🖥️
      </div>
    </div>
  );
};

export default GameIntro;
