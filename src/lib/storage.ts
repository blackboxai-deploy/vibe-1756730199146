import { Problem, User } from './types';

const PROBLEMS_KEY = 'street_problems';
const USER_KEY = 'street_user';

// Problem storage functions
export const getProblems = (): Problem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PROBLEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading problems from localStorage:', error);
    return [];
  }
};

export const saveProblems = (problems: Problem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(problems));
  } catch (error) {
    console.error('Error saving problems to localStorage:', error);
  }
};

export const addProblem = (problem: Problem): void => {
  const problems = getProblems();
  problems.unshift(problem); // Add to beginning
  saveProblems(problems);
};

export const updateProblem = (problemId: string, updates: Partial<Problem>): void => {
  const problems = getProblems();
  const index = problems.findIndex(p => p.id === problemId);
  
  if (index !== -1) {
    problems[index] = { ...problems[index], ...updates };
    saveProblems(problems);
  }
};

export const getProblemById = (id: string): Problem | undefined => {
  return getProblems().find(p => p.id === id);
};

// User storage functions
export const getUser = (): User => {
  if (typeof window === 'undefined') {
    return { id: 'anonymous', name: 'Anonymous', votedProblems: [] };
  }
  
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
  }
  
  // Create default user
  const defaultUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: 'Anonymous',
    votedProblems: []
  };
  
  saveUser(defaultUser);
  return defaultUser;
};

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

export const hasUserVoted = (problemId: string): boolean => {
  const user = getUser();
  return user.votedProblems.includes(problemId);
};

export const addUserVote = (problemId: string): void => {
  const user = getUser();
  if (!user.votedProblems.includes(problemId)) {
    user.votedProblems.push(problemId);
    saveUser(user);
  }
};

export const removeUserVote = (problemId: string): void => {
  const user = getUser();
  user.votedProblems = user.votedProblems.filter(id => id !== problemId);
  saveUser(user);
};

// Utility functions
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// Initialize with sample data if empty
export const initializeSampleData = (): void => {
  const problems = getProblems();
  
  if (problems.length === 0) {
    const sampleProblems: Problem[] = [
      {
        id: generateId(),
        title: 'Large Pothole on Main Street',
        description: 'Deep pothole causing vehicle damage near the downtown intersection. Water collects here during rain making it even more dangerous.',
        category: 'pothole',
        location: 'Main Street & 3rd Avenue intersection',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3e35a4a9-edc9-41b2-b62b-15888cece640.png',
        votes: 23,
        votedBy: [],
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'reported',
        reporterName: 'Community Member'
      },
      {
        id: generateId(),
        title: 'Broken Street Light - Safety Concern',
        description: 'Street light has been out for 2 weeks, creating a dark spot that feels unsafe for pedestrians at night.',
        category: 'streetlight',
        location: 'Oak Street near the community park',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4c21ac3d-6198-4c07-8eab-69f6d0b802d6.png',
        votes: 18,
        votedBy: [],
        timestamp: Date.now() - 172800000, // 2 days ago
        status: 'reported',
        reporterName: 'Night Walker'
      },
      {
        id: generateId(),
        title: 'Illegal Garbage Dump Site',
        description: 'Large pile of household waste and construction debris dumped in the vacant lot. Attracting rodents and creating health hazards.',
        category: 'garbage',
        location: 'Empty lot behind Miller Avenue stores',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d2d1c620-e377-412f-8c47-70def73089bc.png',
        votes: 31,
        votedBy: [],
        timestamp: Date.now() - 259200000, // 3 days ago
        status: 'in-progress',
        reporterName: 'Concerned Resident'
      },
      {
        id: generateId(),
        title: 'Cracked Sidewalk - Trip Hazard',
        description: 'Multiple large cracks in the sidewalk creating uneven surface. Several people have tripped here already.',
        category: 'sidewalk',
        location: 'Elm Street sidewalk in front of apartment complex',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/22bb5667-1a98-4353-a5d1-d2a757ec570e.png',
        votes: 12,
        votedBy: [],
        timestamp: Date.now() - 432000000, // 5 days ago
        status: 'reported',
        reporterName: 'Daily Commuter'
      },
      {
        id: generateId(),
        title: 'Missing Stop Sign',
        description: 'Stop sign was knocked down in last storm and hasn\'t been replaced. This intersection is getting dangerous.',
        category: 'traffic-sign',
        location: 'Intersection of Pine Street and 2nd Avenue',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5d505dfc-68ab-464a-a12c-38c51833b8a9.png',
        votes: 27,
        votedBy: [],
        timestamp: Date.now() - 518400000, // 6 days ago
        status: 'reported',
        reporterName: 'Safety First'
      }
    ];
    
    saveProblems(sampleProblems);
  }
};