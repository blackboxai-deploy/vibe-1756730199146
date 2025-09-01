'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import VotingSystem from '@/components/VotingSystem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Problem, PROBLEM_CATEGORIES, PROBLEM_STATUS_LABELS } from '@/lib/types';
import { getProblemById } from '@/lib/storage';
import { useProblems } from '@/hooks/use-problems';

export default function ProblemDetailPage() {
  const params = useParams();
  const { voteProblem } = useProblems();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const problemId = params.id as string;
    if (problemId) {
      const foundProblem = getProblemById(problemId);
      setProblem(foundProblem || null);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading problem details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The problem you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/feed">
                <Button variant="outline">
                  Browse All Problems
                </Button>
              </Link>
              <Link href="/report">
                <Button>
                  Report a Problem
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link href="/feed" className="hover:text-blue-600">Community Feed</Link>
            <span>›</span>
            <span className="text-gray-900">Problem Details</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Voting Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="pt-6 text-center">
                  <VotingSystem 
                    problemId={problem.id}
                    votes={problem.votes}
                    onVote={voteProblem}
                    size="lg"
                  />
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Problem ID:</strong>
                        <br />
                        #{problem.id.slice(-8)}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Reported:</strong>
                        <br />
                        {timeAgo}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>By:</strong>
                        <br />
                        {problem.reporterName || 'Anonymous'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                        {problem.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge 
                          variant="outline" 
                          className={statusColors[problem.status]}
                        >
                          {PROBLEM_STATUS_LABELS[problem.status]}
                        </Badge>
                        
                        <Badge 
                          variant="secondary" 
                          className={categoryColors[problem.category]}
                        >
                          {category?.label || problem.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Problem Image */}
                  {problem.image && (
                    <div className="mb-6">
                      <img 
                        src={problem.image} 
                        alt={problem.title}
                        className="w-full max-h-96 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {/* Location */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 flex items-center gap-2">
                      <span>📍</span>
                      Location
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {problem.location}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Problem Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {problem.description}
                    </p>
                  </div>

                  {/* Category Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Category Information
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant="secondary" 
                          className={categoryColors[problem.category]}
                        >
                          {category?.label || problem.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {category?.description || 'No category description available.'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <Link href="/feed" className="flex-1">
                      <Button variant="outline" className="w-full">
                        ← Back to Community Feed
                      </Button>
                    </Link>
                    
                    <Link href="/report" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Report Similar Problem
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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