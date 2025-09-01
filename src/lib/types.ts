export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  location: string;
  image: string; // base64 encoded image
  votes: number;
  votedBy: string[]; // user IDs who voted
  timestamp: number;
  status: ProblemStatus;
  reporterName?: string;
}

export type ProblemCategory = 
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'sidewalk'
  | 'traffic-sign'
  | 'public-facility'
  | 'other';

export type ProblemStatus = 'reported' | 'in-progress' | 'resolved';

export interface User {
  id: string;
  name: string;
  votedProblems: string[]; // problem IDs user has voted on
}

export interface ProblemFormData {
  title: string;
  description: string;
  category: ProblemCategory;
  location: string;
  image?: File;
  reporterName: string;
}

export const PROBLEM_CATEGORIES: { value: ProblemCategory; label: string; description: string }[] = [
  { value: 'pothole', label: 'Potholes & Road Damage', description: 'Road surface issues, cracks, holes' },
  { value: 'streetlight', label: 'Broken Street Lights', description: 'Non-functioning street lighting' },
  { value: 'garbage', label: 'Garbage & Litter', description: 'Waste disposal issues, illegal dumping' },
  { value: 'sidewalk', label: 'Damaged Sidewalks', description: 'Broken or unsafe walkways' },
  { value: 'traffic-sign', label: 'Traffic Signs', description: 'Missing or damaged road signs' },
  { value: 'public-facility', label: 'Public Facilities', description: 'Parks, benches, public amenities' },
  { value: 'other', label: 'Other Issues', description: 'Other community problems' },
];

export const PROBLEM_STATUS_LABELS: Record<ProblemStatus, string> = {
  'reported': 'Reported',
  'in-progress': 'In Progress',
  'resolved': 'Resolved'
};