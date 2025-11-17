import type { NetworkStats, WorkerSummary } from "./types";

export const sampleWorkers: WorkerSummary[] = [
  {
    id: "john-musa",
    name: "John Musa",
    trade: "Electrician",
    city: "Lagos",
    area: "Ikeja",
    locationLabel: "Ikeja, Lagos",
    trust: {
      total: 82,
      sentiment: 36,
      referrals: 44,
      verified: 20,
    },
    sentimentTags: ["punctual", "neat", "fair pricing"],
    pathToYou: "You → Aisha → John",
    inYourNetworkSteps: 2,
  },
  {
    id: "sade-okafor",
    name: "Sade Okafor",
    trade: "Electrician",
    city: "Lagos",
    area: "Yaba",
    locationLabel: "Yaba, Lagos",
    trust: {
      total: 75,
      sentiment: 38,
      referrals: 27,
      verified: 10,
    },
    sentimentTags: ["explains clearly", "tidy install"],
    pathToYou: "You → Chidi → Sade",
    inYourNetworkSteps: 1,
  },
  {
    id: "tunde-ademola",
    name: "Tunde Ademola",
    trade: "Electrician",
    city: "Lagos",
    area: "Surulere",
    locationLabel: "Surulere, Lagos",
    trust: {
      total: 68,
      sentiment: 30,
      referrals: 25,
      verified: 13,
    },
    sentimentTags: ["fast response", "good follow-up"],
    pathToYou: "You → Hassan → Tunde",
    inYourNetworkSteps: 2,
  },
  {
    id: "aisha-bello",
    name: "Aisha Bello",
    trade: "Cleaner",
    city: "Lagos",
    area: "Yaba",
    locationLabel: "Yaba, Lagos",
    trust: {
      total: 76,
      sentiment: 40,
      referrals: 26,
      verified: 10,
    },
    sentimentTags: ["thorough", "reliable"],
    pathToYou: "You → Farouk → Aisha",
    inYourNetworkSteps: 2,
  },
  {
    id: "michael-udo",
    name: "Michael Udo",
    trade: "Plumber",
    city: "Lagos",
    area: "Lekki",
    locationLabel: "Lekki, Lagos",
    trust: {
      total: 79,
      sentiment: 35,
      referrals: 30,
      verified: 14,
    },
    sentimentTags: ["honest", "no leaks after"],
    pathToYou: "You → Amaka → Michael",
    inYourNetworkSteps: 1,
  },
];

export const sampleNetworkStats: NetworkStats = {
  peopleConnected: 34,
  workersVouching: 9,
  reviewsWritten: 5,
};

export function getWorkersByTrade(trade: string): WorkerSummary[] {
  return sampleWorkers.filter((w) => w.trade === trade);
}
