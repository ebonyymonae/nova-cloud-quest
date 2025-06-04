
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface WordPuzzleChallengeProps {
  onComplete: (success: boolean) => void;
}

const WordPuzzleChallenge: React.FC<WordPuzzleChallengeProps> = ({ onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState<boolean[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  const puzzles = [
    {
      scrambled: "3CE2",
      answer: "EC2",
      hint: "Elastic Compute Cloud - Virtual servers in AWS",
      clue: "Nova needs virtual machines to host her applications. What AWS service provides scalable computing capacity?",
      category: "Compute"
    },
    {
      scrambled: "MAI",
      answer: "IAM",
      hint: "Identity and Access Management - Controls who can access what",
      clue: "Echo is setting up security policies to control access. What service manages users and permissions?",
      category: "Security"
    },
    {
      scrambled: "3S",
      answer: "S3",
      hint: "Simple Storage Service - Object storage for the cloud",
      clue: "Nova needs to store her website's images and files. What AWS storage service should she use?",
      category: "Storage"
    },
    {
      scrambled: "CPV",
      answer: "VPC",
      hint: "Virtual Private Cloud - Your own isolated network in AWS",
      clue: "Echo wants to create a secure, isolated network for Nova's resources. What should they set up?",
      category: "Networking"
    },
    {
      scrambled: "BDALMA",
      answer: "LAMBDA",
      hint: "Serverless compute service - Run code without managing servers",
      clue: "Nova wants to run code without worrying about servers. What serverless service should she use?",
      category: "Compute"
    }
  ];

  const currentPuz = puzzles[currentPuzzle];

  useEffect(() => {
    setSolvedPuzzles(new Array(puzzles.length).fill(false));
  }, []);

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase() === currentPuz.answer.toLowerCase();
    
    if (isCorrect) {
      const newSolved = [...solvedPuzzles];
      newSolved[currentPuzzle] = true;
      setSolvedPuzzles(newSolved);
      
      if (currentPuzzle === puzzles.length - 1) {
        setGameComplete(true);
        setTimeout(() => onComplete(true), 2000);
      } else {
        setTimeout(() => {
          setCurrentPuzzle(currentPuzzle + 1);
          setUserAnswer('');
          setShowHint(false);
          setAttempts(0);
        }, 1500);
      }
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  const handleSkip = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setUserAnswer('');
      setShowHint(false);
      setAttempts(0);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Compute': return 'text-blue-400';
      case 'Security': return 'text-red-400';
      case 'Storage': return 'text-green-400';
      case 'Networking': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  const scrambleAnimation = {
    display: 'inline-block',
    animation: 'bounce 1s infinite'
  };

  if (gameComplete) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-bold text-cyan-400">Decryption Complete!</h3>
        <p className="text-xl text-gray-300">
          Nova has successfully decoded all the AWS terminology! The secret messages have been unlocked.
        </p>
        <div className="text-lg text-green-400">
          Mission Accomplished! +500 XP
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">AWS Code Breaker</h3>
        <p className="text-gray-300">Help Nova decode the scrambled AWS terminology!</p>
        <div className="text-sm text-gray-400 mt-2">
          Puzzle {currentPuzzle + 1} of {puzzles.length}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center space-x-2 mb-6">
        {puzzles.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-colors ${
              index < currentPuzzle
                ? 'bg-green-500'
                : index === currentPuzzle
                ? 'bg-cyan-400'
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      <Card className="bg-black/30 border-cyan-500/30">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className={`text-sm font-semibold mb-2 ${getCategoryColor(currentPuz.category)}`}>
              {currentPuz.category}
            </div>
            <p className="text-lg text-gray-300 mb-4">{currentPuz.clue}</p>
          </div>

          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-2">Scrambled Code:</div>
            <div className="text-4xl font-mono font-bold text-cyan-400 tracking-wider" style={scrambleAnimation}>
              {currentPuz.scrambled}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter decoded answer..."
                className="text-center text-lg font-mono uppercase bg-black/50 border-cyan-500/50 text-cyan-400 max-w-xs"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {showHint && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="text-yellow-400 font-semibold mb-1">💡 Hint:</div>
                <div className="text-gray-300">{currentPuz.hint}</div>
              </div>
            )}

            {attempts > 0 && userAnswer && userAnswer.toLowerCase() !== currentPuz.answer.toLowerCase() && (
              <div className="text-red-400 text-center">
                Not quite right! Try again... ({attempts}/2 attempts)
              </div>
            )}

            {userAnswer.toLowerCase() === currentPuz.answer.toLowerCase() && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-green-400 font-bold text-lg">🎉 Correct!</div>
                <div className="text-gray-300 mt-2">{currentPuz.hint}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold disabled:opacity-50"
        >
          Decode
        </Button>
        
        {attempts >= 2 && (
          <Button 
            onClick={handleSkip}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-800"
          >
            Skip
          </Button>
        )}
      </div>

      {/* Echo's Tips */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">🧙‍♂️ Echo's Decoding Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Think about common AWS service abbreviations</li>
            <li>• Consider what the service actually does</li>
            <li>• Look for patterns in the scrambled letters</li>
            <li>• Remember: AWS loves 2-3 letter service names!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordPuzzleChallenge;
