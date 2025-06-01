
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TerraformChallengeProps {
  onComplete: (success: boolean) => void;
}

const TerraformChallenge: React.FC<TerraformChallengeProps> = ({ onComplete }) => {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedVPC, setSelectedVPC] = useState('');
  const [selectedSubnet, setSelectedSubnet] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = {
    order: {
      question: "What's the correct order for creating VPC infrastructure with Terraform?",
      options: [
        { id: 'wrong1', label: 'Subnets → VPC → Provider → Internet Gateway', explanation: 'Subnets cannot exist without a VPC being created first' },
        { id: 'correct', label: 'Provider → VPC → Internet Gateway → Subnets', explanation: 'Perfect! This follows proper dependency order' },
        { id: 'wrong2', label: 'Internet Gateway → Provider → VPC → Subnets', explanation: 'Internet Gateway needs a VPC to attach to' },
        { id: 'wrong3', label: 'VPC → Provider → Subnets → Internet Gateway', explanation: 'Provider configuration must come first' }
      ],
      correct: 'correct'
    },
    vpc: {
      question: "Which CIDR block is best for Nova's VPC?",
      options: [
        { id: '10.0.0.0/16', label: '10.0.0.0/16 (65,536 IPs)', explanation: 'Excellent choice! Provides plenty of IP addresses with good organization' },
        { id: '10.0.0.0/24', label: '10.0.0.0/24 (256 IPs)', explanation: 'Too small - not enough room for multiple subnets and growth' },
        { id: '0.0.0.0/0', label: '0.0.0.0/0 (All IPs)', explanation: 'Invalid for VPC - this represents the entire internet!' },
        { id: '192.168.1.0/16', label: '192.168.1.0/16 (65,536 IPs)', explanation: 'Good size but /16 networks typically start at .0.0, not .1.0' }
      ],
      correct: '10.0.0.0/16'
    },
    subnet: {
      question: "How should Nova configure her public subnet?",
      options: [
        { id: 'wrong1', label: 'map_public_ip_on_launch = false', explanation: 'This would make it private - instances won\'t get public IPs' },
        { id: 'correct', label: 'map_public_ip_on_launch = true + Internet Gateway route', explanation: 'Correct! This makes the subnet truly public with internet access' },
        { id: 'wrong2', label: 'Only create route table, no map_public_ip', explanation: 'Without map_public_ip, instances won\'t get public IPs automatically' },
        { id: 'wrong3', label: 'Use NAT Gateway instead of Internet Gateway', explanation: 'NAT Gateway is for private subnets to access internet, not for public access' }
      ],
      correct: 'correct'
    }
  };

  const checkAnswers = () => {
    const allCorrect = 
      selectedOrder === questions.order.correct &&
      selectedVPC === questions.vpc.correct &&
      selectedSubnet === questions.subnet.correct;
    
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
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Terraform VPC Configuration</h3>
        <p className="text-gray-300">Help Nova understand Infrastructure as Code best practices!</p>
      </div>

      {/* Resource Order */}
      <Card className="bg-black/30 border-blue-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">1. {questions.order.question}</h4>
          <RadioGroup value={selectedOrder} onValueChange={setSelectedOrder}>
            <div className="space-y-3">
              {questions.order.options.map((option) => (
                <div key={option.id} className={getOptionClassName('order', option.id, selectedOrder)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedOrder && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('order', selectedOrder).color}`}>
              {getAnswerFeedback('order', selectedOrder).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* VPC CIDR */}
      <Card className="bg-black/30 border-green-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-4">2. {questions.vpc.question}</h4>
          <RadioGroup value={selectedVPC} onValueChange={setSelectedVPC}>
            <div className="space-y-3">
              {questions.vpc.options.map((option) => (
                <div key={option.id} className={getOptionClassName('vpc', option.id, selectedVPC)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedVPC && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('vpc', selectedVPC).color}`}>
              {getAnswerFeedback('vpc', selectedVPC).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subnet Configuration */}
      <Card className="bg-black/30 border-purple-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-4">3. {questions.subnet.question}</h4>
          <RadioGroup value={selectedSubnet} onValueChange={setSelectedSubnet}>
            <div className="space-y-3">
              {questions.subnet.options.map((option) => (
                <div key={option.id} className={getOptionClassName('subnet', option.id, selectedSubnet)}>
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="text-gray-300 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          {showFeedback && selectedSubnet && (
            <div className={`mt-3 p-3 rounded-lg bg-black/40 ${getAnswerFeedback('subnet', selectedSubnet).color}`}>
              {getAnswerFeedback('subnet', selectedSubnet).explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkAnswers}
          disabled={!selectedOrder || !selectedVPC || !selectedSubnet || showFeedback}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
        >
          {showFeedback ? 'Checking Configuration...' : 'Apply Terraform Config!'}
        </Button>
      </div>

      {/* Hints */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's IaC Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Terraform resources must be created in dependency order</li>
            <li>• /16 networks provide good balance of size and organization</li>
            <li>• Public subnets need both public IP mapping and internet routes</li>
            <li>• Always plan your IP address space before creating infrastructure</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerraformChallenge;
