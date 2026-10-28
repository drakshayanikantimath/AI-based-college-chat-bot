export interface CollegeInfo {
  id: string;
  collegeName: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string;
  accreditation: string[];
  ranking: string;
  establishedYear: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  website: string;
  admissionEmail: string;
  admissionPhone: string;
  workingHours: string;
  updatedAt: string;
}

export interface Campus {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  establishedYear: number;
  areaAcres: number;
  highlight: string;
  keySpecializations: string[];
  isMain: boolean;
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  degree: string;
  department: string;
  duration: string;
  eligibility: string;
  seats: number;
  feesPerYear: number;
  currency: string;
  description: string;
  curriculumHighlights: string[];
  careerProspects: string[];
  campuses: string[];
  isActive: boolean;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  displayOrder: number;
  timesAsked: number;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  refNumber: string;
  studentName: string;
  email: string;
  phone: string;
  campus: string;
  courseOfInterest: string;
  category: string;
  message: string;
  preferredContact: 'Email' | 'Phone' | 'WhatsApp';
  status: 'pending' | 'in_progress' | 'resolved';
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileType: string;
  content: string;
  chunkCount: number;
  status: 'indexed' | 'processing' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface DashboardStats {
  totalEnquiries: number;
  todayEnquiries: number;
  pendingEnquiries: number;
  resolvedEnquiries: number;
  totalCourses: number;
  totalDocs: number;
  totalChunks: number;
  totalFAQs: number;
  enquiriesByCategory: Record<string, number>;
  topFAQs: { id: string; question: string; timesAsked: number; category: string }[];
  totalChatInteractions: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  campus?: string;
  sources?: string[];
  suggestedFollowUps?: string[];
  confidence?: 'verified' | 'unverified' | 'general';
}
