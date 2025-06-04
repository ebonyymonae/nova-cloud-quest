
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface IAMChallengeProps {
  onComplete: (success: boolean) => void;
}

const IAMChallenge: React.FC<IAMChallengeProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "Nova needs to create an IAM policy for developers to access only the 'dev-bucket' S3 bucket. Which principle should she follow?",
      options: [
        "Grant full S3 access to make development easier",
        "Apply the principle of least privilege - only grant necessary permissions",
        "Use the AWS managed PowerUserAccess policy",
        "Grant administrator access temporarily"
      ],
      correct: 1,
      explanation: "The principle of least privilege means granting only the minimum permissions necessary for users to perform their job functions. This reduces security risks."
    },
    {
      id: 2,
      question: "A developer can't access an S3 bucket despite having an IAM policy that allows it. What should Nova check first?",
      options: [
        "The bucket's public access settings",
        "If there's a conflicting bucket policy or explicit DENY statement",
        "The developer's internet connection",
        "The S3 service status page"
      ],
      correct: 1,
      explanation: "IAM follows an explicit DENY model - if any policy contains an explicit DENY, it overrides all ALLOW statements. Bucket policies can also restrict access."
    },
    {
      id: 3,
      question: "Nova wants to allow a Lambda function to read from DynamoDB. What's the best approach?",
      options: [
        "Hardcode AWS credentials in the Lambda function code",
        "Create an IAM role with DynamoDB read permissions and attach it to Lambda",
        "Use the root account credentials",
        "Share IAM user credentials via environment variables"
      ],
      correct: 1,
      explanation: "IAM roles are the secure way to grant AWS services permissions. Never hardcode credentials or use root account credentials for applications."
    },
    {
      id: 4,
      question: "A user gets 'Access Denied' when trying to assume an IAM role. What could be the issue?",
      options: [
        "The user's password has expired",
        "The role's trust policy doesn't allow the user to assume it",
        "The user needs to restart their computer",
        "The AWS region is incorrect"
      ],
      correct: 1,
      explanation: "The trust policy defines who can assume a role. If it doesn't include the user or their group, they can't assume the role even if they have the right permissions."
    },
    {
      id: 5,
      question: "Nova needs to grant temporary access to an external contractor. What's the most secure approach?",
      options: [
        "Create a permanent IAM user with full access",
        "Share the root account password",
        "Use AWS STS to create temporary credentials with specific permissions",
        "Create an IAM user and delete it manually later"
      ],
      correct: 2,
      explanation: "AWS STS (Security Token Service) provides temporary, limited-privilege credentials that automatically expire, making it perfect for temporary access scenarios."
    }
  ];

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const currentAnswer = selectedAnswers[currentQuestion];
    const isCorrect = currentAnswer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      // Challenge complete
      const passed = score >= 3; // Need at least 3/5 correct
      onComplete(passed);
    }
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const getOptionClassName = (optionIndex: number, selectedValue: number | undefined) => {
    const baseClasses = "flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer";
    const isSelected = selectedValue === optionIndex;
    
    if (isSelected) {
      return `${baseClasses} border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/50`;
    }
    
    return `${baseClasses} border-gray-600 hover:border-gray-500 hover:bg-gray-800/50`;
  };

  const getAnswerFeedback = (selectedValue: number) => {
    const isCorrect = selectedValue === currentQ.correct;
    
    return {
      isCorrect,
      explanation: currentQ.explanation,
      color: isCorrect ? 'text-green-400' : 'text-red-400'
    };
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">IAM Security & Troubleshooting</h3>
        <p className="text-gray-300">Help Nova master IAM policies and solve access issues</p>
        <div className="text-sm text-gray-400 mt-2">
          Question {currentQuestion + 1} of {questions.length} | Score: {score}/{currentQuestion + (showFeedback ? 1 : 0)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <Card className="bg-black/30 border-cyan-500/30">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold text-cyan-400 mb-4">{currentQ.question}</h4>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={getOptionClassName(index, selectedAnswer)}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswer === index
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-gray-500'
                }`}></div>
                <span className="text-gray-300">{option}</span>
              </div>
            ))}
          </div>

          {showFeedback && selectedAnswer !== undefined && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === currentQ.correct
                ? 'bg-green-900/50 border border-green-500/30'
                : 'bg-red-900/50 border border-red-500/30'
            }`}>
              <h5 className={`font-semibold mb-2 ${getAnswerFeedback(selectedAnswer).color}`}>
                {selectedAnswer === currentQ.correct ? '🎉 Correct!' : '❌ Not Quite'}
              </h5>
              <p className="text-gray-300">{getAnswerFeedback(selectedAnswer).explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        {!showFeedback ? (
          <Button 
            onClick={handleSubmit}
            disabled={selectedAnswer === undefined}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Challenge'}
          </Button>
        )}
      </div>

      {/* Echo's Tips */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">🧙‍♂️ Echo's IAM Security Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Always follow the principle of least privilege</li>
            <li>• Use IAM roles for AWS services, not hardcoded credentials</li>
            <li>• Check trust policies when role assumption fails</li>
            <li>• Remember: explicit DENY always overrides ALLOW</li>
            <li>• Use temporary credentials (STS) for external access</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default IAMChallenge;
