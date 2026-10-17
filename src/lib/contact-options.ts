/**
 * The answer keys for each choice question in the contact flow. Shared by
 * the form (which renders a tag per key, labelled from messages/) and the
 * server (which rejects anything not listed here), so the two can't drift.
 */
export const CONTACT_OPTIONS = {
  services: ["web", "brand", "automation", "system", "consulting", "other"],
  org: ["business", "nonprofit", "startup", "personal"],
  site: ["yes", "redo", "no"],
  budget: ["lt500", "500-1500", "1500-5000", "5000+"],
  timeline: ["asap", "1-3m", "3m+", "exploring"],
} as const;

export type ContactOptions = typeof CONTACT_OPTIONS;
export type ServiceKey = ContactOptions["services"][number];
export type SingleChoice = Exclude<keyof ContactOptions, "services">;

export type ContactAnswers = {
  name: string;
  services: ServiceKey[];
  org: ContactOptions["org"][number];
  site: ContactOptions["site"][number];
  budget: ContactOptions["budget"][number];
  timeline: ContactOptions["timeline"][number];
  email: string;
  message: string;
};

export function isOption<K extends keyof ContactOptions>(
  question: K,
  value: unknown,
): value is ContactOptions[K][number] {
  return (
    typeof value === "string" &&
    (CONTACT_OPTIONS[question] as readonly string[]).includes(value)
  );
}
