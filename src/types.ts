export type UserRole = 'clinician' | 'patient' | 'arbitrator' | 'researcher' | 'owner' | 'psychologist' | 'guest';

export interface User {
  id: string;
  fullName: string;
  /** @deprecated Use fullName — kept for backward compatibility */
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string;
  specialization?: string;
  university?: string;
  clinicCode?: string;
  assignedPsychologistId?: string;
  patientCode?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  mainProblem: string;
  startDate: string;
  sessionsCount: number;
  lastActivity: string;
  moodHistory: { date: string; score: number }[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
}

export interface Question {
  id: string;
  text: string;
  dimension?: string; // New: Dimension/Factor name
  type: 'likert' | 'multiple-choice' | 'open';
  options?: { value: number; label: string }[];
  scoringKey?: number;
}

export interface ScaleTranslation {
  language: string;
  title: string;
  instructions: string;
  questions: { id: string; text: string }[];
}

export interface ExpertReview {
  expertId: string;
  expertName: string;
  ratings: { questionId: string; isAppropriate: boolean; comment?: string }[];
  overallComment?: string;
  submittedAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export type ResearcherRole = 
  | 'owner' 
  | 'associate_researcher' 
  | 'expert_reviewer' 
  | 'scientific_translator' 
  | 'statistical_analyst';

export interface ProjectComment {
  id: string;
  userId: string;
  userName: string;
  userRole: ResearcherRole;
  text: string;
  timestamp: string;
}

export interface PsychologicalScale {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  dimensions?: string[]; // New: List of dimensions
  likertPoints?: 3 | 5 | 7; // New: Likert scale type
  translations?: ScaleTranslation[]; // New: Back-translation support
  expertReviews?: ExpertReview[]; // New: Expert panel support
  norms?: {
    ageRange: string;
    gender: 'male' | 'female' | 'both';
    mean: number;
    stdDev: number;
    standardScoreType: 'T-Score' | 'Percentile';
    table?: { raw: number; percentile: number; tScore: number }[];
  }[];
  reliability?: {
    cronbachAlpha: number;
    omega?: number; // New: McDonald's Omega
    sampleSize: number;
  };
  validity?: string;
  authorId: string;
  isPublished: boolean;
  category: string;
  price?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: ResearcherRole;
  joinedAt: string;
}

export interface LabProject {
  id: string;
  shortCode: string;
  invitationCode: string;
  title: string;
  researchTopic: string;
  researchGoal: string;
  sampleDescription: string;
  psychometricConcept: string;
  methodology?: 'minnesota' | 'custom' | string;
  scaleId: string;
  status: 'draft' | 'translation' | 'arbitration' | 'pilot' | 'data-collection' | 'analysis' | 'published';
  participantsCount: number;
  responses: {
    participantId: string;
    answers: { questionId: string; value: number }[];
    timestamp: string;
    metadata: { age: number; gender: string; region?: string };
    isFlagged?: boolean; // New: For random response detection
  }[];
  teamMembers: TeamMember[];
  files: ProjectFile[];
  comments: ProjectComment[];
  subscriptionType: 'individual' | 'expert' | 'institution';
}

export interface Message {
  id: string;
  room: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  type: 'message' | 'appointment' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}
