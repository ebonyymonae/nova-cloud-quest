
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TerraformChallengeProps {
  onComplete: (success: boolean) => void;
}

const TerraformChallenge: React.FC<TerraformChallengeProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      question: "What's the correct order for creating VPC infrastructure with Terraform?",
      options: [
        "Subnets → VPC → Provider → Internet Gateway",
        "Provider → VPC → Internet Gateway → Subnets", 
        "Internet Gateway → Provider → VPC → Subnets",
        "VPC → Provider → Subnets → Internet Gateway"
      ],
      correct: 1,
      explanations: [
        "Subnets cannot exist without a VPC being created first",
        "Perfect! This follows proper dependency order in Terraform",
        "Internet Gateway needs a VPC to attach to",
        "Provider configuration must come first in Terraform"
      ]
    },
    {
      question: "Which CIDR block is best for Nova's VPC that needs room for growth?",
      options: [
        "10.0.0.0/16 (65,536 IPs)",
        "10.0.0.0/24 (256 IPs)", 
        "0.0.0.0/0 (All IPs)",
        "192.168.1.0/16 (65,536 IPs)"
      ],
      correct: 0,
      explanations: [
        "Excellent choice! Provides plenty of IP addresses with good organization",
        "Too small - not enough room for multiple subnets and growth",
        "Invalid for VPC - this represents the entire internet!",
        "Good size but /16 networks typically start at .0.0, not .1.0"
      ]
    },
    {
      question: "How should Nova configure her public subnet in Terraform?",
      options: [
        "map_public_ip_on_launch = false",
        "map_public_ip_on_launch = true + Internet Gateway route",
        "Only create route table, no map_public_ip setting",
        "Use NAT Gateway instead of Internet Gateway"
      ],
      correct: 1,
      explanations: [
        "This would make it private - instances won't get public IPs",
        "Correct! This makes the subnet truly public with internet access",
        "Without map_public_ip, instances won't get public IPs automatically", 
        "NAT Gateway is for private subnets to access internet, not for public access"
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex.toString();
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check all answers
      const allCorrect = questions.every((q, index) => 
        selectedAnswers[index] === q.correct.toString()
      );
      setShowFeedback(true);
      if (allCorrect) {
        setTimeout(() => onComplete(true), 2000);
      }
    }
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Terraform VPC Configuration</h3>
        <p className="text-gray-300">Help Nova master Infrastructure as Code!</p>
        <div className="text-sm text-gray-400 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <Card className="bg-black/30 border-cyan-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-6">{currentQ.question}</h4>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswer === index.toString()
                    ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400/50'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedAnswer === index.toString()
                      ? 'border-cyan-400 bg-cyan-400'
                      : 'border-gray-500'
                  }`}></div>
                  <span className="text-gray-300">{option}</span>
                </div>
              </div>
            ))}
          </div>

          {showFeedback && selectedAnswer && (
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === currentQ.correct.toString()
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {currentQ.explanations[parseInt(selectedAnswer)]}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        {!showFeedback ? (
          <Button 
            onClick={handleNext}
            disabled={!isAnswered}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold disabled:opacity-50"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Challenge' : 'Next Question'}
          </Button>
        ) : (
          <div className="text-cyan-400 text-lg font-semibold">
            {questions.every((q, index) => selectedAnswers[index] === q.correct.toString())
              ? '🎉 Terraform Configuration Complete!'
              : '❌ Some answers need review. Try again!'
            }
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Terraform Tips */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's Terraform Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Resources have dependencies - create providers first, then VPCs, then subnets</li>
            <li>• Plan your IP address space carefully with CIDR blocks</li>
            <li>• Public subnets need both IP mapping AND internet gateway routes</li>
            <li>• Always run 'terraform plan' before 'terraform apply'</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerraformChallenge;
