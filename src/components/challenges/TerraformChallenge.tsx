
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TerraformChallengeProps {
  onComplete: (success: boolean) => void;
}

interface CodeBlock {
  id: string;
  content: string;
  type: 'provider' | 'vpc' | 'subnet-public' | 'subnet-private' | 'igw' | 'route-table';
}

const TerraformChallenge: React.FC<TerraformChallengeProps> = ({ onComplete }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [orderedBlocks, setOrderedBlocks] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const codeBlocks: CodeBlock[] = [
    {
      id: 'provider',
      content: `provider "aws" {
  region = "us-west-2"
}`,
      type: 'provider'
    },
    {
      id: 'vpc',
      content: `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "skystack-vpc"
  }
}`,
      type: 'vpc'
    },
    {
      id: 'igw',
      content: `resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "skystack-igw"
  }
}`,
      type: 'igw'
    },
    {
      id: 'subnet-public',
      content: `resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-west-2a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "skystack-public-subnet"
  }
}`,
      type: 'subnet-public'
    },
    {
      id: 'subnet-private',
      content: `resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-west-2b"
  
  tags = {
    Name = "skystack-private-subnet"
  }
}`,
      type: 'subnet-private'
    },
    {
      id: 'route-table',
      content: `resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "skystack-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}`,
      type: 'route-table'
    }
  ];

  const correctOrder = ['provider', 'vpc', 'igw', 'subnet-public', 'subnet-private', 'route-table'];

  const handleDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    setDraggedItem(blockId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      setOrderedBlocks(prev => {
        if (!prev.includes(draggedItem)) {
          return [...prev, draggedItem];
        }
        return prev;
      });
      setDraggedItem(null);
    }
  }, [draggedItem]);

  const removeBlock = (blockId: string) => {
    setOrderedBlocks(prev => prev.filter(id => id !== blockId));
  };

  const checkOrder = () => {
    const isCorrect = orderedBlocks.length === correctOrder.length && 
                     orderedBlocks.every((block, index) => block === correctOrder[index]);
    
    setShowFeedback(true);
    
    if (isCorrect) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const availableBlocks = codeBlocks.filter(block => !orderedBlocks.includes(block.id));
  const getBlockTypeColor = (type: string) => {
    const colors = {
      'provider': 'border-purple-500/50 bg-purple-500/10',
      'vpc': 'border-blue-500/50 bg-blue-500/10',
      'subnet-public': 'border-green-500/50 bg-green-500/10',
      'subnet-private': 'border-yellow-500/50 bg-yellow-500/10',
      'igw': 'border-cyan-500/50 bg-cyan-500/10',
      'route-table': 'border-red-500/50 bg-red-500/10'
    };
    return colors[type as keyof typeof colors] || 'border-gray-500/50 bg-gray-500/10';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-cyan-400 mb-2">Terraform VPC Configuration</h3>
        <p className="text-gray-300">Drag and drop the Terraform blocks in the correct order!</p>
      </div>

      {/* Instructions */}
      <Card className="bg-black/30 border-blue-500/30">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">📋 Your Mission</h4>
          <p className="text-gray-300 mb-4">
            Nova needs to create a VPC with both public and private subnets. Arrange the Terraform blocks in the logical order:
          </p>
          <ol className="text-gray-300 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm">1</span>
              <span>Provider configuration</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">2</span>
              <span>VPC creation</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-sm">3</span>
              <span>Internet Gateway</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">4</span>
              <span>Public subnet</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm">5</span>
              <span>Private subnet</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">6</span>
              <span>Route table and association</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Blocks */}
        <div>
          <h4 className="text-lg font-semibold text-gray-300 mb-4">Available Terraform Blocks</h4>
          <div className="space-y-3">
            {availableBlocks.map((block) => (
              <Card 
                key={block.id}
                className={`cursor-move transition-all hover:scale-105 ${getBlockTypeColor(block.type)}`}
                draggable
                onDragStart={(e) => handleDragStart(e, block.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-400 uppercase">
                      {block.type.replace('-', ' ')}
                    </span>
                    <span className="text-gray-500">📁</span>
                  </div>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {block.content}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div>
          <h4 className="text-lg font-semibold text-gray-300 mb-4">Your Terraform Configuration</h4>
          <div 
            className="min-h-[400px] border-2 border-dashed border-gray-600 rounded-lg p-4 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {orderedBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📥</div>
                  <p>Drag Terraform blocks here</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orderedBlocks.map((blockId, index) => {
                  const block = codeBlocks.find(b => b.id === blockId)!;
                  return (
                    <Card 
                      key={blockId}
                      className={`${getBlockTypeColor(block.type)} relative`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-gray-400 uppercase">
                              {block.type.replace('-', ' ')}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeBlock(blockId)}
                            className="text-red-400 border-red-400/30 hover:bg-red-500/20"
                          >
                            ✕
                          </Button>
                        </div>
                        <pre className="text-xs text-gray-300 overflow-x-auto">
                          {block.content}
                        </pre>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <Card className={`${orderedBlocks.length === correctOrder.length && 
          orderedBlocks.every((block, index) => block === correctOrder[index]) 
          ? 'bg-green-900/50 border-green-500/30' 
          : 'bg-red-900/50 border-red-500/30'}`}>
          <CardContent className="p-6">
            {orderedBlocks.length === correctOrder.length && 
             orderedBlocks.every((block, index) => block === correctOrder[index]) ? (
              <div>
                <h5 className="text-green-400 font-semibold mb-2">🎉 Perfect Infrastructure!</h5>
                <p className="text-green-300">
                  Excellent! Nova has created a well-structured VPC with proper dependencies. 
                  The provider comes first, then VPC, followed by the internet gateway, subnets, and finally routing.
                </p>
              </div>
            ) : (
              <div>
                <h5 className="text-red-400 font-semibold mb-2">🔧 Resource Dependencies</h5>
                <p className="text-red-300">
                  Remember: Terraform resources must be ordered by their dependencies. 
                  A subnet needs a VPC to exist first, and route tables need both VPC and internet gateway.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={checkOrder}
          disabled={orderedBlocks.length !== correctOrder.length || showFeedback}
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
            <li>• Provider configuration always comes first</li>
            <li>• Create foundational resources (VPC) before dependent ones</li>
            <li>• Internet Gateway needs VPC to exist</li>
            <li>• Subnets depend on VPC being created</li>
            <li>• Route tables reference other resources via interpolation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerraformChallenge;
