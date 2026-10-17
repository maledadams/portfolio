-- Answers from the step-by-step contact flow. Stored as the option keys in
-- src/lib/contact-options.ts (e.g. budget = '1500-5000'), never free text.
-- Nullable so rows from the old single-form version stay valid.

ALTER TABLE messages ADD COLUMN services TEXT; -- comma-separated keys
ALTER TABLE messages ADD COLUMN org TEXT;
ALTER TABLE messages ADD COLUMN site TEXT;
ALTER TABLE messages ADD COLUMN budget TEXT;
ALTER TABLE messages ADD COLUMN timeline TEXT;
