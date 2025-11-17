export type UserRole = "WORKER" | "CLIENT";

export type SentimentTag = string;

export interface TrustBreakdown {
  total: number; // 0-100
  sentiment: number;
  referrals: number;
  verified: number;
}

export interface WorkerSummary {
  id: string;
  name: string;
  trade: string;
  city: string;
  area: string;
  locationLabel: string;
  trust: TrustBreakdown;
  sentimentTags: SentimentTag[];
  pathToYou?: string;
  inYourNetworkSteps?: number;
}

export interface NetworkStats {
  peopleConnected: number;
  workersVouching: number;
  reviewsWritten: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}


