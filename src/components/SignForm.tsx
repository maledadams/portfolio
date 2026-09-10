"use client";

import { useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import TurnstileWidget, { type TurnstileHandle } from "./TurnstileWidget";

type Status = "idle" | "sending" | "done" | "error";

type Labels = {
  name: string;
  message: string;
  submit: string;
  sending: string;
  done: string;
  errorInvalid: string;
  errorTurnstile: string;
  errorRate: string;
  errorOffline: string;
  errorGeneric: string;
  previewTitle: string;
  previewEmptyName: string;
  previewEmptyMessage: string;
};

export default function SignForm({
  labels,
  maxName,
  maxMessage,
  turnstileSiteKey,
}: {
  labels: Labels;
  maxName: number;
  maxMessage: number;
  turnstileSiteKey: string | null;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const turnstileRef = useRef<TurnstileHandle>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          message: data.get("message"),
          website: data.get("website"),
          token: data.get("cf-turnstile-response"),
        }),
      });

      turnstileRef.current?.reset();

      if (response.ok) {
        form.reset();
        setName("");
        setMessage("");
        setStatus("done");
        // Pull the new signature down from the server.
        router.refresh();
        return;
      }

      const { reason } = (await response.json().catch(() => ({}))) as {
        reason?: string;
      };
      setError(
        reason === "invalid"
          ? labels.errorInvalid
          : reason === "turnstile"
            ? labels.errorTurnstile
            : reason === "rate-limited"
              ? labels.errorRate
              : reason === "unconfigured"
                ? labels.errorOffline
                : labels.errorGeneric,
      );
      setStatus("error");
    } catch {
      turnstileRef.current?.reset();
      setError(labels.errorGeneric);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div
        className="notecard flex max-w-[380px] flex-col justify-between border border-line p-5"
        style={{ ["--rotation" as string]: "-1.2deg", ["--note-tint" as string]: "#f2f6ee" }}
      >
        <p className="font-mono text-[0.7em] leading-relaxed text-[#111]" role="status">
          {labels.done}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-8 lg:flex-row">
      <form onSubmit={onSubmit} className="flex w-full max-w-[420px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="gb-name" className="font-mono text-[0.7em] text-muted">
            {labels.name}
          </label>
          <input
            id="gb-name"
            name="name"
            required
            maxLength={maxName}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-line bg-bg px-3 py-2 text-[0.8em] focus-visible:border-fg"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="gb-message"
            className="font-mono text-[0.7em] text-muted"
          >
            {labels.message}
          </label>
          <textarea
            id="gb-message"
            name="message"
            required
            rows={4}
            maxLength={maxMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-y border border-line bg-bg px-3 py-2 text-[0.8em] focus-visible:border-fg"
          />
          <p className="text-right font-mono text-[0.65em] text-muted">
            {message.length}/{maxMessage}
          </p>
        </div>

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="gb-website">Website</label>
          <input id="gb-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {turnstileSiteKey && (
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            action="guestbook"
          />
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="border border-line bg-surface px-5 py-2.5 text-[0.8em] transition-colors hover:border-fg disabled:opacity-60"
          >
            {status === "sending" ? labels.sending : labels.submit}
          </button>

          {status === "error" && (
            <p className="text-[0.75em] text-muted" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Live preview: the note fills in as the fields are typed. */}
      <div className="w-full max-w-[300px] shrink-0 sm:max-w-[340px]">
        <p className="mb-2 font-mono text-[0.65em] text-muted">{labels.previewTitle}</p>
        <div
          className="notecard flex min-h-[200px] flex-col justify-between border border-line p-5"
          style={{ ["--rotation" as string]: "1.4deg", ["--note-tint" as string]: "#fdf6e3" }}
        >
          <p className="font-mono text-[0.66em] leading-relaxed whitespace-pre-line text-[#111]">
            {message || (
              <span className="text-[#111]/45">{labels.previewEmptyMessage}</span>
            )}
          </p>
          <p className="mt-4 text-right font-mono text-[0.6em] text-[#111]/60">
            {name || labels.previewEmptyName}
          </p>
        </div>
      </div>
    </div>
  );
}
