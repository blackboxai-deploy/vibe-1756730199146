'use client';

import Link from 'next/link';
import { Problem, PROBLEM_CATEGORIES, PROBLEM_STATUS_LABELS } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VotingSystem from './VotingSystem';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  problem: Problem;
  onVote: (problemId: string) => void;
  showFullDescription?: boolean;
  className?: string;
}

const ProblemCard = ({ problem, onVote, showFullDescription = false, className }: ProblemCardProps) => {
  const category = PROBLEM_CATEGORIES.find(c => c.value === problem.category);
  const timeAgo = getTimeAgo(problem.timestamp);

  const statusColors = {
    'reported': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'resolved': 'bg-green-100 text-green-800 border-green-200'
  };

  const categoryColors = {
    'pothole': 'bg-orange-100 text-orange-800',
    'streetlight': 'bg-purple-100 text-purple-800',
    'garbage': 'bg-red-100 text-red-800',
    'sidewalk': 'bg-gray-100 text-gray-800',
    'traffic-sign': 'bg-blue-100 text-blue-800',
    'public-facility': 'bg-green-100 text-green-800',
    'other': 'bg-slate-100 text-slate-800'
  };

  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow duration-200', className)}>
      <div className="flex">
        {/* Voting Section */}
        <div className="flex-shrink-0 p-4 bg-gray-50 border-r">
          <VotingSystem 
            problemId={problem.id}
            votes={problem.votes}
            onVote={onVote}
            size="md"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/problem/${problem.id}`}
                  className="block group"
                >
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {problem.title}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{timeAgo}</span>
                  <span>•</span>
                  <span>by {problem.reporterName || 'Anonymous'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Badge 
                  variant="outline" 
                  className={statusColors[problem.status]}
                >
                  {PROBLEM_STATUS_LABELS[problem.status]}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {problem.image && (
              <div className="mb-4">
                <Link href={`/problem/${problem.id}`}>
                  <img 
                    src={problem.image} 
                    alt={problem.title}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                  />
                </Link>
              </div>
            )}

            <p className={cn(
              'text-gray-700 leading-relaxed',
              !showFullDescription && 'line-clamp-3'
            )}>
              {problem.description}
            </p>

            {!showFullDescription && problem.description.length > 150 && (
              <Link 
                href={`/problem/${problem.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block mt-2"
              >
                Read more →
              </Link>
            )}
          </CardContent>

          <CardFooter className="pt-0 pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={categoryColors[problem.category]}
                >
                  {category?.label || problem.category}
                </Badge>
                
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span>📍</span>
                  <span className="line-clamp-1">{problem.location}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                #{problem.id.slice(-6)}
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

// Helper function to calculate time ago
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}

export default ProblemCard;