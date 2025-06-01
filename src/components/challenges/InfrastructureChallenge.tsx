
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InfrastructureChallengeProps {
  onComplete: (success: boolean) => void;
}

const InfrastructureChallenge: React.FC<InfrastructureChallengeProps> = ({ onComplete }) => {
  const [selectedLoadBalancer, setSelectedLoadBalancer] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [selectedMonitoring, setSelectedMonitoring] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = {
    loadBalancer: {
      question: "Nova needs to distribute traffic across multiple EC2 instances. Which AWS service should she use?",
      options: [
        { id: 'wrong1', label: 'CloudFront', explanation: 'CloudFront is a CDN for content delivery, not load balancing servers' },
        { id: 'correct', label: 'Application Load Balancer (ALB)', explanation: 'Perfect! ALB distributes HTTP/HTTPS traffic across multiple targets' },
        { id: 'wrong2', label: 'Route 53', explanation: 'Route 53 is DNS service - it can do some routing but ALB is better for server load balancing' },
        { id: 'wrong3', label: 'API Gateway', explanation: 'API Gateway is for managing APIs, not distributing traffic to EC2 instances' }
      ],
      correct: 'correct'
    },
    database: {
      question: "Nova's app needs a managed database. Which RDS configuration is best for high availability?",
      options: [
        { id: 'wrong1', label: 'Single AZ deployment', explanation: 'Single AZ provides no redundancy - not good for high availability' },
        { id: 'correct', label: 'Multi-AZ deployment with automated backups', explanation: 'Excellent! Multi-AZ provides automatic failover and backups ensure data protection' },
        { id: 'wrong2', label: 'Read replica only', explanation: 'Read replicas help with performance but don\'t provide automatic failover' },
        { id: 'wrong3', label: 'DynamoDB instead of RDS', explanation: 'DynamoDB is NoSQL - depends on app requirements, but question asks about RDS specifically' }
      ],
      correct: 'correct'
    },
    monitoring: {
      question: "What should Nova set up to get alerted when her instances have issues?",
      options: [
        { id: 'wrong1', label: 'Just check AWS Console manually', explanation: 'Manual checking isn\'t scalable and delays response to issues' },
        { id: 'wrong2', label: 'Only use CloudTrail logs', explanation: 'CloudTrail tracks API calls, not performance or health metrics' },
        { id: 'correct', label: 'CloudWatch Alarms with SNS notifications', explanation: 'Perfect! This provides automated monitoring with immediate notifications' },
        { id: 'wrong3', label: 'Set up custom scripts on each instance', explanation: 'This creates more complexity and maintenance overhead than needed' }
      ],
      correct: 'correct'
    }
  };

  const checkAnswers = () => {
    const allCorrect = 
      selectedLoadBalancer === questions.loadBalancer.correct &&
      selectedDatabase === questions.database.correct &&
      selectedMonitoring === questions.monitoring.correct;
    
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
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Infrastructure Design</h3>
        <p className="text-gray-300">Help Nova build a robust, scalable architecture!</p>
      </div>

      {/* Load Balancer */}
      <Card className="bg-black/30 border-blue-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">1. {questions.loadBalancer.question}</h4>
          <RadioGroup value={selectedLoadBalancer} onValueChange={setSelectedLoadBalancer}>
            <div className="space-y-3">
              {questions.loadBalancer.options.map((option) => (
                <div key={option.id} className={getOptionClassName('loadBalancer', option.id, selectedLoadBalancer)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedLoadBalancer && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('loadBalancer', selectedLoadBalancer).color}`}>
              {getAnswerFeedback('loadBalancer', selectedLoadBalancer).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database */}
      <Card className="bg-black/30 border-green-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-4">2. {questions.database.question}</h4>
          <RadioGroup value={selectedDatabase} onValueChange={setSelectedDatabase}>
            <div className="space-y-3">
              {questions.database.options.map((option) => (
                <div key={option.id} className={getOptionClassName('database', option.id, selectedDatabase)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedDatabase && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('database', selectedDatabase).color}`}>
              {getAnswerFeedback('database', selectedDatabase).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitoring */}
      <Card className="bg-black/30 border-purple-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-4">3. {questions.monitoring.question}</h4>
          <RadioGroup value={selectedMonitoring} onValueChange={setSelectedMonitoring}>
            <div className="space-y-3">
              {questions.monitoring.options.map((option) => (
                <div key={option.id} className={getOptionClassName('monitoring', option.id, selectedMonitoring)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedMonitoring && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('monitoring', selectedMonitoring).color}`}>
              {getAnswerFeedback('monitoring', selectedMonitoring).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkAnswers}
          disabled={!selectedLoadBalancer || !selectedDatabase || !selectedMonitoring || showFeedback}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
        >
          {showFeedback ? 'Building Infrastructure...' : 'Deploy Architecture!'}
        </Button>
      </div>

      {/* Hints */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's Architecture Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Load balancers improve both availability and performance</li>
            <li>• Multi-AZ deployments protect against data center failures</li>
            <li>• Proactive monitoring prevents small issues from becoming big problems</li>
            <li>• Always plan for failure - assume components will break</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureChallenge;
