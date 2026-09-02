export type ResourceCategory =
  | "parks-recreation"
  | "civic-youth"
  | "family-services"
  | "business-workforce";

export type Audience =
  | "students"
  | "families"
  | "seniors"
  | "entrepreneurs"
  | "volunteers";

export interface OperatingHoursBlock {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  open: string; // 24h "HH:MM"
  close: string; // 24h "HH:MM"
}

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  address: string;
  zip: string;
  geo: { lat: number; lng: number };
  phone?: string;
  website?: string;
  hours: OperatingHoursBlock[] | "by-appointment" | "always-open";
  audience: Audience[];
  verifiedDate: string; // ISO date
  tags: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  venue: string;
  address: string;
  startDateTime: string; // ISO datetime
  endDateTime: string; // ISO datetime
  audience: Audience[];
  registrationLink?: string;
  tag: string;
  description: string;
}

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  "parks-recreation": "Parks & Recreation",
  "civic-youth": "Civic & Youth Engagement",
  "family-services": "Human & Family Services",
  "business-workforce": "Business & Workforce",
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  students: "Students",
  families: "Families",
  seniors: "Seniors",
  entrepreneurs: "Entrepreneurs",
  volunteers: "Volunteers",
};
