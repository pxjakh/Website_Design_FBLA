/**
 * Client-side pre-submission checks for community-submitted listings.
 *
 * This is the deterministic first pass of the moderation guard: it catches
 * missing mandatory fields, obvious spam patterns, and slurs/profanity
 * before anything is queued. A server-side model review runs after this in
 * production; this layer exists so a submitter gets instant, specific
 * feedback instead of a silent rejection hours later.
 */

export type FindingLevel = "error" | "warning";

export interface ModerationFinding {
  level: FindingLevel;
  field: string;
  message: string;
}

export interface ModerationResult {
  status: "pass" | "needs-review" | "blocked";
  findings: ModerationFinding[];
}

export interface SubmissionDraft {
  name: string;
  category: string;
  address: string;
  description: string;
  contactEmail: string;
}

// Deliberately narrow: profanity and slurs only. Kept small and explicit so
// the list can be reviewed by a human moderator.
const BLOCKED_TERMS = [
  "damn", "hell", "crap", "shit", "fuck", "bitch", "bastard", "asshole",
];

const SPAM_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /\b(?:free money|make \$?\d+|work from home|click here|buy now|limited time offer)\b/i, message: "Reads like promotional spam rather than a community resource." },
  { pattern: /(https?:\/\/[^\s]+){3,}/i, message: "Contains an unusual number of links." },
  { pattern: /\b(?:viagra|casino|crypto|bitcoin|forex|loan approval)\b/i, message: "Contains terms commonly associated with spam." },
  { pattern: /(.)\1{6,}/, message: "Contains repeated-character padding." },
];

const GA_ADDRESS = /\b(?:GA|Georgia)\b/i;
const ZIP = /\b3\d{4}\b/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function moderateSubmission(draft: SubmissionDraft): ModerationResult {
  const findings: ModerationFinding[] = [];
  const haystack = `${draft.name} ${draft.description}`.toLowerCase();

  // Mandatory fields
  if (!draft.name.trim()) {
    findings.push({ level: "error", field: "name", message: "Organization name is required." });
  }
  if (!draft.address.trim()) {
    findings.push({ level: "error", field: "address", message: "A street address is required so residents can find this." });
  } else {
    if (!ZIP.test(draft.address)) {
      findings.push({ level: "warning", field: "address", message: "No zip code detected — add one so location filtering works." });
    }
    if (!GA_ADDRESS.test(draft.address)) {
      findings.push({ level: "warning", field: "address", message: "Address doesn't look like it's in Georgia. This directory covers Forsyth County only." });
    }
  }
  if (!draft.description.trim()) {
    findings.push({ level: "error", field: "description", message: "A description is required." });
  } else if (draft.description.trim().length < 40) {
    findings.push({ level: "warning", field: "description", message: "Description is very short — residents need enough detail to know if this fits their need." });
  }
  if (draft.contactEmail.trim() && !EMAIL.test(draft.contactEmail.trim())) {
    findings.push({ level: "error", field: "contactEmail", message: "That email address doesn't look valid." });
  }

  // Profanity / slurs — hard block.
  const found = BLOCKED_TERMS.filter((t) =>
    new RegExp(`\\b${t}\\b`, "i").test(haystack)
  );
  if (found.length > 0) {
    findings.push({
      level: "error",
      field: "description",
      message: "Contains language that isn't appropriate for a public community directory.",
    });
  }

  // Spam heuristics
  for (const { pattern, message } of SPAM_PATTERNS) {
    if (pattern.test(`${draft.name} ${draft.description}`)) {
      findings.push({ level: "error", field: "description", message });
      break;
    }
  }

  // ALL CAPS shouting
  const letters = draft.description.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const caps = draft.description.replace(/[^A-Z]/g, "").length;
    if (caps / letters.length > 0.6) {
      findings.push({ level: "warning", field: "description", message: "Mostly capital letters — this reads as shouting to screen readers and visitors." });
    }
  }

  const hasError = findings.some((f) => f.level === "error");
  const hasWarning = findings.some((f) => f.level === "warning");

  return {
    status: hasError ? "blocked" : hasWarning ? "needs-review" : "pass",
    findings,
  };
}
