'use client';

import { useState, useEffect } from 'react';
import { Problem } from '@/lib/types';
import { 
  getProblems, 
  addProblem, 
  updateProblem, 
  hasUserVoted, 
  addUserVote, 
  removeUserVote,
  initializeSampleData 
} from '@/lib/storage';

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load problems
    const loadedProblems = getProblems();
    setProblems(loadedProblems);
    setLoading(false);
  }, []);

  const refreshProblems = () => {
    const loadedProblems = getProblems();
    setProblems(loadedProblems);
  };

  const submitProblem = (problem: Problem) => {
    addProblem(problem);
    refreshProblems();
  };

  const voteProblem = (problemId: string) => {
    const hasVoted = hasUserVoted(problemId);
    const problem = problems.find(p => p.id === problemId);
    
    if (!problem) return;

    if (hasVoted) {
      // Remove vote
      updateProblem(problemId, { 
        votes: Math.max(0, problem.votes - 1),
        votedBy: problem.votedBy.filter(id => id !== 'current_user')
      });
      removeUserVote(problemId);
    } else {
      // Add vote
      updateProblem(problemId, { 
        votes: problem.votes + 1,
        votedBy: [...problem.votedBy, 'current_user']
      });
      addUserVote(problemId);
    }
    
    refreshProblems();
  };

  const getSortedProblems = () => {
    return [...problems].sort((a, b) => {
      // First sort by votes (descending)
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      // Then by timestamp (most recent first)
      return b.timestamp - a.timestamp;
    });
  };

  const getProblemsByCategory = (category: string) => {
    return problems.filter(p => p.category === category);
  };

  const getProblemsByStatus = (status: string) => {
    return problems.filter(p => p.status === status);
  };

  const getTopProblems = (limit: number = 5) => {
    return getSortedProblems().slice(0, limit);
  };

  const searchProblems = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return problems.filter(p => 
      p.title.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.location.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    problems,
    loading,
    submitProblem,
    voteProblem,
    refreshProblems,
    getSortedProblems,
    getProblemsByCategory,
    getProblemsByStatus,
    getTopProblems,
    searchProblems,
    hasUserVoted
  };
};