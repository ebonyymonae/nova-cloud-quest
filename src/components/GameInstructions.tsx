
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const GameInstructions = () => {
  return (
    <Card className="bg-black/30 border-cyan-500/30 mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">🎯 How to Play</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="font-semibold text-purple-400 mb-2">Choose Your Path</h4>
            <p className="text-sm text-gray-300">Select from available challenges to learn AWS step by step</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="font-semibold text-green-400 mb-2">Learn by Doing</h4>
            <p className="text-sm text-gray-300">Answer multiple choice questions about real AWS scenarios</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-semibold text-yellow-400 mb-2">Earn Rewards</h4>
            <p className="text-sm text-gray-300">Gain XP and badges as you master cloud engineering</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-purple-900/30 rounded-lg">
          <p className="text-sm text-purple-200 text-center">
            <strong>💡 Tip:</strong> Selected answers will highlight in blue. Take your time and read Echo's hints!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInstructions;
