export type GuestbookEntry = {
  /** Kept short: the note is a 4:3 card, roughly 4 lines of mono. */
  message: string;
  name: string;
  /** ISO date, rendered per locale. */
  date: string;
};

/**
 * Real signatures only. Nothing here is invented, which is why it starts
 * empty: fabricated notes on a portfolio are fabricated social proof.
 *
 * To add one, paste the message and name a visitor sent you. To let visitors
 * write directly, this array needs to move behind a small API route backed by
 * a database (Supabase would fit the existing stack).
 */
export const guestbook: GuestbookEntry[] = [];
