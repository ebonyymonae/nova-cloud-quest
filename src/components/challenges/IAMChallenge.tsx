
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface IAMChallengeProps {
  onComplete: (success: boolean) => void;
}

const IAMChallenge: React.FC<IAMChallengeProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      question: "Nova needs to create an IAM policy for developers to access only the 'dev-bucket' S3 bucket. Which principle should she follow?",
      options: [
        "Grant full S3 access to make development easier",
        "Apply the principle of least privilege - only grant necessary permissions",
        "Use the AWS managed PowerUserAccess policy",
        "Grant administrator access temporarily"
      ],
      correct: 1,
      explanations: [
        "This violates security principles and creates unnecessary risk",
        "Perfect! The principle of least privilege means granting only the minimum permissions necessary for users to perform their job functions",
        "PowerUserAccess is too broad for this specific requirement",
        "Administrator access should never be granted temporarily for specific resource access"
      ]
    },
    {
      question: "A developer can't access an S3 bucket despite having an IAM policy that allows it. What should Nova check first?",
      options: [
        "The bucket's public access settings",
        "If there's a conflicting bucket policy or explicit DENY statement",
        "The developer's internet connection",
        "The S3 service status page"
      ],
      correct: 1,
      explanations: [
        "Public access settings don't affect IAM user access",
        "Correct! IAM follows an explicit DENY model - if any policy contains an explicit DENY, it overrides all ALLOW statements",
        "Network connectivity wouldn't cause an access denied error specifically",
        "Service status issues would cause different types of errors"
      ]
    },
    {
      question: "Nova wants to allow a Lambda function to read from DynamoDB. What's the best approach?",
      options: [
        "Hardcode AWS credentials in the Lambda function code",
        "Create an IAM role with DynamoDB read permissions and attach it to Lambda",
        "Use the root account credentials",
        "Share IAM user credentials via environment variables"
      ],
      correct: 1,
      explanations: [
        "Never hardcode credentials - this is a major security risk",
        "Perfect! IAM roles are the secure way to grant AWS services permissions to access other services",
        "Root account credentials should never be used for applications",
        "Sharing IAM user credentials is insecure and not the intended pattern for services"
      ]
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex.toString();
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
    } else {
      // Check all answers
      const correctAnswers = questions.filter((q, index) => 
        selectedAnswers[index] === q.correct.toString()
      ).length;
      const passed = correctAnswers >= 2; // Need at least 2/3 correct
      setTimeout(() => onComplete(passed), 1000);
    }
  };

  const currentQ = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">IAM Security & Troubleshooting</h3>
        <p className="text-gray-300">Help Nova master IAM policies and solve access issues</p>
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
                onClick={() => !showFeedback && handleAnswerSelect(index)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswer === index.toString()
                    ? 'border-cyan-400 bg-cyan-500/20 ring-2 ring-cyan-400/50'
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                } ${showFeedback ? 'cursor-not-allowed' : ''}`}
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
            onClick={handleSubmit}
            disabled={!isAnswered}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold disabled:opacity-50"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Challenge' : 'Next Question'}
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
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
