import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "applications.json");

export interface Application {
  id: string;
  company: string;
  role: string;
  jobLink: string;
  location: string;
  dateApplied: string;
  status: "Applied" | "Assessment" | "Interview" | "HR Round" | "Rejected" | "Offer Received";
  notes: string;
}

const SEED_DATA: Application[] = [
  {
    id: "1",
    company: "Google",
    role: "Senior Frontend Engineer",
    jobLink: "https://careers.google.com",
    location: "Bangalore, India",
    dateApplied: "2025-01-15",
    status: "Interview",
    notes: "Technical round scheduled for next week",
  },
  {
    id: "2",
    company: "Microsoft",
    role: "Software Engineer II",
    jobLink: "https://careers.microsoft.com",
    location: "Hyderabad, India",
    dateApplied: "2025-01-10",
    status: "Assessment",
    notes: "Online assessment completed",
  },
  {
    id: "3",
    company: "Amazon",
    role: "SDE-2",
    jobLink: "https://amazon.jobs",
    location: "Bangalore, India",
    dateApplied: "2025-01-20",
    status: "Applied",
    notes: "Applied through referral",
  },
  {
    id: "4",
    company: "Stripe",
    role: "Frontend Developer",
    jobLink: "https://stripe.com/jobs",
    location: "Remote",
    dateApplied: "2024-12-28",
    status: "Offer Received",
    notes: "Offer letter received, reviewing compensation",
  },
  {
    id: "5",
    company: "Meta",
    role: "React Developer",
    jobLink: "https://metacareers.com",
    location: "Menlo Park, CA",
    dateApplied: "2025-01-05",
    status: "Rejected",
    notes: "Rejected after system design round",
  },
  {
    id: "6",
    company: "Flipkart",
    role: "Lead Frontend",
    jobLink: "https://flipkart.careers",
    location: "Bangalore, India",
    dateApplied: "2025-01-18",
    status: "HR Round",
    notes: "HR discussion scheduled for Friday",
  },
];

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
  } else {
    // Check if file is empty or has empty array
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8").trim();
      if (!content || content === "[]" || content === "null") {
        fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      }
    } catch {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
    }
  }
}

export function getApplications(): Application[] {
  ensureDataFile();
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

export function addApplication(app: Omit<Application, "id">): Application {
  const applications = getApplications();
  const newApp: Application = {
    ...app,
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
  };
  applications.push(newApp);
  fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2), "utf-8");
  return newApp;
}

export function updateApplication(id: string, updates: Partial<Application>): Application | null {
  const applications = getApplications();
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return null;
  applications[index] = { ...applications[index], ...updates };
  fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2), "utf-8");
  return applications[index];
}

export function deleteApplication(id: string): boolean {
  const applications = getApplications();
  const filtered = applications.filter((app) => app.id !== id);
  if (filtered.length === applications.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

export function clearAllApplications(): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
}
