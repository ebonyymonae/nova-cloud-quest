
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface EC2ChallengeProps {
  onComplete: (success: boolean) => void;
}

const EC2Challenge: React.FC<EC2ChallengeProps> = ({ onComplete }) => {
  const [selectedAMI, setSelectedAMI] = useState('');
  const [selectedInstanceType, setSelectedInstanceType] = useState('');
  const [selectedSecurityGroup, setSelectedSecurityGroup] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = {
    ami: {
      question: "Which AMI should Nova choose for a basic web server?",
      options: [
        { id: 'windows', label: 'Windows Server 2022', explanation: 'Overkill for a simple web server and more expensive' },
        { id: 'amazon-linux', label: 'Amazon Linux 2023', explanation: 'Perfect! Optimized for AWS and great for web servers' },
        { id: 'deep-learning', label: 'Deep Learning AMI', explanation: 'This is for AI/ML workloads, not web servers' },
        { id: 'sap', label: 'SAP Business One', explanation: 'This is for enterprise SAP applications' }
      ],
      correct: 'amazon-linux'
    },
    instanceType: {
      question: "What instance type is best for Nova's small web server?",
      options: [
        { id: 't3.micro', label: 't3.micro', explanation: 'Perfect! Burstable performance for small workloads' },
        { id: 'c5.24xlarge', label: 'c5.24xlarge', explanation: 'Way too powerful (and expensive!) for a small web server' },
        { id: 'm5.large', label: 'm5.large', explanation: 'Good option but overkill for a small web server' },
        { id: 'r5.xlarge', label: 'r5.xlarge', explanation: 'Memory-optimized instances are for high-memory workloads' }
      ],
      correct: 't3.micro'
    },
    securityGroup: {
      question: "Which security group rule should Nova add for web traffic?",
      options: [
        { id: 'ssh-only', label: 'Allow SSH (port 22) only', explanation: 'This only allows SSH access, not web traffic' },
        { id: 'all-traffic', label: 'Allow all traffic from anywhere', explanation: 'Security risk! Never allow all traffic' },
        { id: 'http-https', label: 'Allow HTTP (80) and HTTPS (443)', explanation: 'Correct! This allows web traffic securely' },
        { id: 'database', label: 'Allow MySQL (3306)', explanation: 'This is for database access, not web traffic' }
      ],
      correct: 'http-https'
    }
  };

  const checkAnswers = () => {
    const allCorrect = 
      selectedAMI === questions.ami.correct &&
      selectedInstanceType === questions.instanceType.correct &&
      selectedSecurityGroup === questions.securityGroup.correct;
    
    setShowFeedback(true);
    
    if (allCorrect) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const getAnswerFeedback = (questionType: keyof typeof questions, selectedValue: string) => {
    const question = questions[questionType];
    const selectedOption = question.options.find(opt => opt.id === selectedValue);
    const isCorrect = selectedValue === question.correct;
    
    return {
      isCorrect,
      explanation: selectedOption?.explanation || '',
      color: isCorrect ? 'text-green-400' : 'text-red-400'
    };
  };

  const getOptionClassName = (questionType: keyof typeof questions, optionId: string, selectedValue: string) => {
    const baseClasses = "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer";
    const isSelected = selectedValue === optionId;
    
    if (isSelected) {
      return `${baseClasses} border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/50`;
    }
    
    return `${baseClasses} border-gray-600 hover:border-gray-500 hover:bg-gray-800/50`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">EC2 Instance Configuration</h3>
        <p className="text-gray-300">Help Nova make the right choices for her web server!</p>
      </div>

      {/* AMI Selection */}
      <Card className="bg-black/30 border-blue-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">1. {questions.ami.question}</h4>
          <RadioGroup value={selectedAMI} onValueChange={setSelectedAMI}>
            <div className="space-y-3">
              {questions.ami.options.map((option) => (
                <div key={option.id} className={getOptionClassName('ami', option.id, selectedAMI)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedAMI && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('ami', selectedAMI).color}`}>
              {getAnswerFeedback('ami', selectedAMI).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instance Type Selection */}
      <Card className="bg-black/30 border-green-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-4">2. {questions.instanceType.question}</h4>
          <RadioGroup value={selectedInstanceType} onValueChange={setSelectedInstanceType}>
            <div className="space-y-3">
              {questions.instanceType.options.map((option) => (
                <div key={option.id} className={getOptionClassName('instanceType', option.id, selectedInstanceType)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedInstanceType && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('instanceType', selectedInstanceType).color}`}>
              {getAnswerFeedback('instanceType', selectedInstanceType).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Group Selection */}
      <Card className="bg-black/30 border-purple-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-4">3. {questions.securityGroup.question}</h4>
          <RadioGroup value={selectedSecurityGroup} onValueChange={setSelectedSecurityGroup}>
            <div className="space-y-3">
              {questions.securityGroup.options.map((option) => (
                <div key={option.id} className={getOptionClassName('securityGroup', option.id, selectedSecurityGroup)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedSecurityGroup && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('securityGroup', selectedSecurityGroup).color}`}>
              {getAnswerFeedback('securityGroup', selectedSecurityGroup).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkAnswers}
          disabled={!selectedAMI || !selectedInstanceType || !selectedSecurityGroup || showFeedback}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
        >
          {showFeedback ? 'Checking Configuration...' : 'Launch Instance!'}
        </Button>
      </div>

      {/* Challenge Hints */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's Hints:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Choose an AMI optimized for AWS and web workloads</li>
            <li>• Small web servers don't need massive compute power</li>
            <li>• Security groups should allow necessary traffic only</li>
            <li>• Think about cost-effectiveness for a startup like SkyStack</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EC2Challenge;
