'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProblemCard from '@/components/ProblemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProblems } from '@/hooks/use-problems';
import { PROBLEM_CATEGORIES, ProblemStatus } from '@/lib/types';

export default function FeedPage() {
  const { problems, voteProblem, loading } = useProblems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'newest' | 'oldest'>('votes');

  // Filter and sort problems
  const filteredProblems = problems
    .filter(problem => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          problem.title.toLowerCase().includes(query) ||
          problem.description.toLowerCase().includes(query) ||
          problem.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && problem.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && problem.status !== selectedStatus) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          if (b.votes !== a.votes) {
            return b.votes - a.votes;
          }
          return b.timestamp - a.timestamp; // Secondary sort by newest
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('votes');
  };

  const getStatusLabel = (status: ProblemStatus): string => {
    const labels: Record<ProblemStatus, string> = {
      'reported': 'Reported',
      'in-progress': 'In Progress',
      'resolved': 'Resolved'
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading community problems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Feed
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse and vote on street problems reported by your community. 
              The most voted issues appear at the top to help prioritize fixes.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <Input
                  placeholder="Search problems, locations, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PROBLEM_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'votes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('votes')}
                  >
                    Most Voted
                  </Button>
                  <Button
                    variant={sortBy === 'newest' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('newest')}
                  >
                    Newest
                  </Button>
                  <Button
                    variant={sortBy === 'oldest' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('oldest')}
                  >
                    Oldest
                  </Button>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || sortBy !== 'votes') && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredProblems.length}</span> of{' '}
                <span className="font-semibold">{problems.length}</span> problems
              </p>
              
              {/* Active Filters */}
              <div className="flex gap-2">
                {searchQuery && (
                  <Badge variant="secondary">
                    Search: {searchQuery}
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary">
                    {PROBLEM_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                  </Badge>
                )}
                {selectedStatus !== 'all' && (
                  <Badge variant="secondary">
                    {getStatusLabel(selectedStatus as ProblemStatus)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Problems List */}
          {filteredProblems.length > 0 ? (
            <div className="space-y-6">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onVote={voteProblem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No problems found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Be the first to report a problem in your community!'}
              </p>
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' ? (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/report'}>
                  Report a Problem
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}