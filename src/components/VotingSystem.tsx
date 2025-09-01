'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { hasUserVoted } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface VotingSystemProps {
  problemId: string;
  votes: number;
  onVote: (problemId: string) => void;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const VotingSystem = ({ 
  problemId, 
  votes, 
  onVote, 
  size = 'md',
  orientation = 'vertical',
  className 
}: VotingSystemProps) => {
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setUserHasVoted(hasUserVoted(problemId));
  }, [problemId]);

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for UX
      onVote(problemId);
      setUserHasVoted(!userHasVoted);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'h-8 w-8 text-sm',
      votes: 'text-sm font-medium',
      container: 'gap-1'
    },
    md: {
      button: 'h-10 w-10 text-base',
      votes: 'text-base font-semibold',
      container: 'gap-2'
    },
    lg: {
      button: 'h-12 w-12 text-lg',
      votes: 'text-lg font-bold',
      container: 'gap-3'
    }
  };

  const orientationClasses = {
    vertical: 'flex flex-col items-center',
    horizontal: 'flex flex-row items-center'
  };

  return (
    <div className={cn(
      orientationClasses[orientation],
      sizeClasses[size].container,
      className
    )}>
      <Button
        onClick={handleVote}
        disabled={isVoting}
        variant={userHasVoted ? "default" : "outline"}
        size="sm"
        className={cn(
          sizeClasses[size].button,
          'rounded-full transition-all duration-200',
          userHasVoted 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-md' 
            : 'border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-600 hover:text-green-600',
          isVoting && 'scale-95 opacity-75'
        )}
      >
        {isVoting ? (
          <span className="animate-spin">⟳</span>
        ) : userHasVoted ? (
          '👍'
        ) : (
          '👍'
        )}
      </Button>

      <div className={cn(
        'text-center',
        sizeClasses[size].votes,
        userHasVoted ? 'text-green-600' : 'text-gray-700'
      )}>
        <div>{votes}</div>
        <div className={cn(
          'text-xs text-gray-500',
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        )}>
          {votes === 1 ? 'vote' : 'votes'}
        </div>
      </div>

      {userHasVoted && (
        <div className={cn(
          'text-xs text-green-600 font-medium',
          orientation === 'horizontal' && 'ml-2'
        )}>
          ✓ Voted
        </div>
      )}
    </div>
  );
};

export default VotingSystem;