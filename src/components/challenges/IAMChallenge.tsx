
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface IAMChallengeProps {
  onComplete: (success: boolean) => void;
}

const IAMChallenge: React.FC<IAMChallengeProps> = ({ onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::skystack-uploads/*"
    }
  ]
}`;

  const templatePolicy = `{
  "Version": "____-__-__",
  "Statement": [
    {
      "Effect": "______",
      "Action": [
        "__:_________",
        "__:_________"
      ],
      "Resource": "___:___:__:__________/*"
    }
  ]
}`;

  const checkPolicy = () => {
    // Simple validation - check for key components
    const hasVersion = userInput.includes('2012-10-17');
    const hasEffect = userInput.includes('"Allow"');
    const hasS3Actions = userInput.includes('s3:GetObject') && userInput.includes('s3:PutObject');
    const hasResource = userInput.includes('arn:aws:s3:::skystack-uploads/*');
    
    const correct = hasVersion && hasEffect && hasS3Actions && hasResource;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">IAM Policy Creation</h3>
        <p className="text-gray-300">Nova needs to create a policy for the file upload service</p>
      </div>

      {/* Scenario */}
      <Card className="bg-black/30 border-blue-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">📋 The Scenario</h4>
          <p className="text-gray-300 mb-4">
            SkyStack's web application needs to upload and download files from an S3 bucket called 
            <code className="bg-gray-700 px-2 py-1 rounded text-cyan-400 mx-1">skystack-uploads</code>. 
            Nova needs to create an IAM policy that allows:
          </p>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Reading objects from the bucket (s3:GetObject)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Writing objects to the bucket (s3:PutObject)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-red-400">✗</span>
              <span>NO other permissions (principle of least privilege)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Policy Template */}
      <Card className="bg-black/30 border-purple-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-3">🔧 Fill in the Policy</h4>
          <p className="text-gray-300 mb-4">Complete the IAM policy template below:</p>
          
          <div className="mb-4">
            <h5 className="text-sm font-semibold text-gray-400 mb-2">Template:</h5>
            <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
              {templatePolicy}
            </pre>
          </div>
          
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your completed IAM policy here..."
            className="min-h-[300px] bg-gray-800 border-gray-600 text-gray-100 font-mono text-sm"
          />
          
          {showFeedback && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-900/50 border border-green-500/30' : 'bg-red-900/50 border border-red-500/30'}`}>
              {isCorrect ? (
                <div>
                  <h5 className="text-green-400 font-semibold mb-2">🎉 Excellent Work!</h5>
                  <p className="text-green-300">
                    Perfect! Nova's policy follows the principle of least privilege by granting only the necessary S3 permissions.
                  </p>
                </div>
              ) : (
                <div>
                  <h5 className="text-red-400 font-semibold mb-2">🔍 Almost There!</h5>
                  <p className="text-red-300 mb-2">Check your policy for:</p>
                  <ul className="text-red-300 space-y-1 text-sm">
                    <li>• Correct version: "2012-10-17"</li>
                    <li>• Effect should be "Allow"</li>
                    <li>• Actions: "s3:GetObject" and "s3:PutObject"</li>
                    <li>• Resource: "arn:aws:s3:::skystack-uploads/*"</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkPolicy}
          disabled={!userInput.trim() || showFeedback}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8 py-3 text-lg font-semibold"
        >
          {showFeedback ? 'Validating Policy...' : 'Submit Policy'}
        </Button>
      </div>

      {/* Hints */}
      <Card className="bg-black/20 border-yellow-500/30">
        <CardContent className="p-4">
          <h5 className="text-yellow-400 font-semibold mb-2">💡 Echo's Security Tips:</h5>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Always use the latest policy version (2012-10-17)</li>
            <li>• Specify exact actions needed, not wildcards</li>
            <li>• Use specific resource ARNs when possible</li>
            <li>• Remember: "least privilege" = minimum permissions needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default IAMChallenge;
