export interface ApplicationForm {
  // Step 1 — Identity
  fullName: string;
  email: string;
  googleScholarId: string;
  orcid?: string;
  // Step 2 — Background
  institution: string;
  role: string;
  expertise: string;
  hIndex?: number;
  // Step 3 — Intent
  statementOfIntent: string;
  targetTier: "Q1" | "Q2" | "Open/Pre-print";
  motivation?: string;
  // Metadata
  batchId: string;
  submittedAt: string;
  status: "pending" | "under_review" | "approved" | "rejected";
}

export type BatchStatus = "open" | "closed" | "full";

export interface Batch {
  id: string;
  number: number;
  status: BatchStatus;
  seatsTotal: number;
  seatsRemaining: number;
  openDate: string;
  closeDate: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  abstract: string;
  methodology: string;
  requiredExpertise: string[];
  status: "draft" | "pending" | "published" | "archived";
  visibility: "public" | "private";
  leadName: string;
  leadInstitution: string;
  tags: string[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface EventSpeaker {
  name: string;
  role: string;
  avatar: string;
  badges: string[];
}

export interface EventBlock {
  heading: string;
  paragraphs?: string[];
  checkmarks?: string[];
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  duration?: string;
  location: string;
  format?: string;
  language?: string;
  status: "upcoming" | "live" | "ended";
  isPaid: boolean;
  capacity: number;
  registrantsCount: number;
  type?: string;
  category?: string;
  tags?: string[];
  blocks?: EventBlock[];
  schedule?: EventScheduleItem[];
  speaker?: EventSpeaker;
  benefits?: string[];
  targetAudience?: string[];
}
