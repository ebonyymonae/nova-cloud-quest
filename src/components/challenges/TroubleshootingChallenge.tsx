
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TroubleshootingChallengeProps {
  onComplete: (success: boolean) => void;
}

const TroubleshootingChallenge: React.FC<TroubleshootingChallengeProps> = ({ onComplete }) => {
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const [selectedSecurity, setSelectedSecurity] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = {
    connection: {
      question: "Nova can't SSH to her EC2 instance. What's the most likely cause?",
      options: [
        { id: 'wrong1', label: 'Instance is in wrong AZ', explanation: 'Availability Zone doesn\'t affect SSH connectivity' },
        { id: 'correct', label: 'Security group missing SSH rule (port 22)', explanation: 'Correct! Security groups act as firewalls - SSH needs port 22 open' },
        { id: 'wrong2', label: 'Instance type is too small', explanation: 'Instance size doesn\'t affect SSH connectivity' },
        { id: 'wrong3', label: 'AMI is corrupted', explanation: 'A corrupted AMI would prevent the instance from starting entirely' }
      ],
      correct: 'correct'
    },
    performance: {
      question: "Nova's web app is slow. Which CloudWatch metric should she check first?",
      options: [
        { id: 'wrong1', label: 'NetworkPacketsIn', explanation: 'Network packets don\'t directly indicate performance issues' },
        { id: 'correct', label: 'CPUUtilization', explanation: 'Perfect! High CPU is often the first sign of performance issues' },
        { id: 'wrong2', label: 'StatusCheckFailed', explanation: 'Status checks indicate health, not performance bottlenecks' },
        { id: 'wrong3', label: 'DiskReadBytes', explanation: 'Disk reads are important but CPU is typically checked first for web apps' }
      ],
      correct: 'correct'
    },
    security: {
      question: "Nova found suspicious API calls in CloudTrail. What should she do first?",
      options: [
        { id: 'wrong1', label: 'Delete all IAM users immediately', explanation: 'Too extreme - this could break legitimate access' },
        { id: 'wrong2', label: 'Ignore it if apps are working', explanation: 'Never ignore suspicious activity in security logs!' },
        { id: 'correct', label: 'Rotate credentials for affected users/roles', explanation: 'Correct! Rotating credentials prevents further unauthorized access' },
        { id: 'wrong3', label: 'Turn off CloudTrail logging', explanation: 'This would make the security situation worse, not better!' }
      ],
      correct: 'correct'
    }
  };

  const checkAnswers = () => {
    const allCorrect = 
      selectedConnection === questions.connection.correct &&
      selectedPerformance === questions.performance.correct &&
      selectedSecurity === questions.security.correct;
    
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
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">AWS Troubleshooting</h3>
        <p className="text-gray-300">Help Nova solve common AWS problems!</p>
      </div>

      {/* Connection Issue */}
      <Card className="bg-black/30 border-red-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-red-400 mb-4">1. {questions.connection.question}</h4>
          <RadioGroup value={selectedConnection} onValueChange={setSelectedConnection}>
            <div className="space-y-3">
              {questions.connection.options.map((option) => (
                <div key={option.id} className={getOptionClassName('connection', option.id, selectedConnection)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedConnection && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('connection', selectedConnection).color}`}>
              {getAnswerFeedback('connection', selectedConnection).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Issue */}
      <Card className="bg-black/30 border-orange-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-400 mb-4">2. {questions.performance.question}</h4>
          <RadioGroup value={selectedPerformance} onValueChange={setSelectedPerformance}>
            <div className="space-y-3">
              {questions.performance.options.map((option) => (
                <div key={option.id} className={getOptionClassName('performance', option.id, selectedPerformance)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedPerformance && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('performance', selectedPerformance).color}`}>
              {getAnswerFeedback('performance', selectedPerformance).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Issue */}
      <Card className="bg-black/30 border-red-600/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-red-300 mb-4">3. {questions.security.question}</h4>
          <RadioGroup value={selectedSecurity} onValueChange={setSelectedSecurity}>
            <div className="space-y-3">
              {questions.security.options.map((option) => (
                <div key={option.id} className={getOptionClassName('security', option.id, selectedSecurity)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedSecurity && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('security', selectedSecurity).color}`}>
              {getAnswerFeedback('security', selectedSecurity).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkAnswers}
          disabled={!selectedConnection || !selectedPerformance || !selectedSecurity || showFeedback}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
        >
          {showFeedback ? 'Analyzing Issues...' : 'Submit Solutions!'}
        </Button>
      </div>

      {/* Hints */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's Troubleshooting Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Security groups are the first thing to check for connectivity issues</li>
            <li>• CloudWatch metrics help identify performance bottlenecks</li>
            <li>• Always respond quickly to security incidents</li>
            <li>• Credential rotation is a key security best practice</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TroubleshootingChallenge;
