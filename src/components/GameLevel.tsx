import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Level } from '../types/game';
import EC2Challenge from './challenges/EC2Challenge';
import IAMChallenge from './challenges/IAMChallenge';
import TerraformChallenge from './challenges/TerraformChallenge';
import TroubleshootingChallenge from './challenges/TroubleshootingChallenge';
import InfrastructureChallenge from './challenges/InfrastructureChallenge';
import WordPuzzleChallenge from './challenges/WordPuzzleChallenge';

interface GameLevelProps {
  level: Level;
  onComplete: (xpGained: number, badgeEarned?: string) => void;
  onBack: () => void;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, onComplete, onBack }) => {
  const [showDialogue, setShowDialogue] = useState(true);
  const [challengeComplete, setChallengeComplete] = useState(false);

  const getDialogue = () => {
    switch (level.id) {
      case 'word-puzzle':
        return {
          intro: "Echo: 'Nova, I've intercepted some encrypted AWS communications! Can you help me decode these scrambled service names?'",
          success: "Nova: 'That was like solving a digital puzzle! I feel much more confident with AWS terminology now.'"
        };
      case 'ec2-basics':
        return {
          intro: "Nova: 'Echo, I need to launch my first EC2 instance for our client. Can you guide me through the process?'",
          success: "Echo: 'Excellent work, Nova! You've successfully launched your first EC2 instance. Remember, choosing the right AMI and security groups is crucial for both performance and security.'"
        };
      case 'iam-policy':
        return {
          intro: "Echo: 'Now Nova, let's tackle IAM policies. Security is paramount in cloud engineering. You need to create a policy that grants necessary permissions without being overly permissive.'",
          success: "Nova: 'I'm getting the hang of this! Following the principle of least privilege really makes sense now.'"
        };
      case 'terraform-vpc':
        return {
          intro: "Nova: 'Infrastructure as Code sounds intimidating... How do I use Terraform to create a VPC?'",
          success: "Echo: 'Outstanding! You've just experienced the power of Infrastructure as Code. This VPC will be reproducible and version-controlled.'"
        };
      case 'troubleshooting':
        return {
          intro: "Echo: 'Time for some real-world problem solving, Nova. When things go wrong in production, you need to think fast and systematically.'",
          success: "Nova: 'I feel much more confident about handling AWS issues now. Troubleshooting is like detective work!'"
        };
      case 'infrastructure-design':
        return {
          intro: "Nova: 'This client needs a highly available architecture. How do I design something that won't fail?'",
          success: "Echo: 'Perfect! You're thinking like a true cloud architect now. High availability requires planning for failure at every level.'"
        };
      default:
        return {
          intro: "Echo: 'Ready for your next challenge, Nova?'",
          success: "Nova: 'Another challenge completed! I'm really learning a lot!'"
        };
    }
  };

  const renderChallenge = () => {
    switch (level.id) {
      case 'word-puzzle':
        return <WordPuzzleChallenge onComplete={(success) => setChallengeComplete(success)} />;
      case 'ec2-basics':
        return <EC2Challenge onComplete={(success) => setChallengeComplete(success)} />;
      case 'iam-policy':
        return <IAMChallenge onComplete={(success) => setChallengeComplete(success)} />;
      case 'terraform-vpc':
        return <TerraformChallenge onComplete={(success) => setChallengeComplete(success)} />;
      case 'troubleshooting':
        return <TroubleshootingChallenge onComplete={(success) => setChallengeComplete(success)} />;
      case 'infrastructure-design':
        return <InfrastructureChallenge onComplete={(success) => setChallengeComplete(success)} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-300 mb-4">This challenge is coming soon!</p>
            <Button onClick={() => setChallengeComplete(true)}>
              Mark as Complete (Demo)
            </Button>
          </div>
        );
    }
  };

  const dialogue = getDialogue();

  return (
    <div className="container mx-auto p-6">
      {/* Level Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">{level.title}</h1>
          <p className="text-gray-300">{level.description}</p>
        </div>
        <Button onClick={onBack} variant="outline" className="border-purple-500/30 text-purple-400">
          ← Back to Levels
        </Button>
      </div>

      {/* Dialogue Section */}
      {showDialogue && !challengeComplete && (
        <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🧙‍♂️</div>
              <div className="flex-1">
                <p className="text-lg text-gray-100 italic">"{dialogue.intro}"</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => setShowDialogue(false)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                Start Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Dialogue */}
      {challengeComplete && (
        <Card className="bg-black/40 backdrop-blur-lg border-green-500/30 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-400 mb-2">Challenge Complete!</h3>
                <p className="text-lg text-gray-100 italic">"{dialogue.success}"</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="text-yellow-400">🌟 +{level.xpReward} XP</div>
                  {level.badge && (
                    <div className="text-purple-400">🏆 Badge Earned: {level.badge}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => onComplete(level.xpReward, level.badge)}
                className="bg-green-500 hover:bg-green-600"
              >
                Continue Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge Content */}
      {!showDialogue && !challengeComplete && (
        <Card className="bg-black/40 backdrop-blur-lg border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Your Mission</CardTitle>
          </CardHeader>
          <CardContent>
            {renderChallenge()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameLevel;
