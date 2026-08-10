"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

type Status = "idle" | "sending" | "done" | "error";

type Labels = {
  name: string;
  message: string;
  submit: string;
  sending: string;
  done: string;
  errorInvalid: string;
  errorRate: string;
  errorOffline: string;
  errorGeneric: string;
};

export default function SignForm({
  labels,
  maxName,
  maxMessage,
}: {
  labels: Labels;
  maxName: number;
  maxMessage: number;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState("");
  const router = useRouter();

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
        }),
      });

      if (response.ok) {
        form.reset();
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
          : reason === "rate-limited"
            ? labels.errorRate
            : reason === "unconfigured"
              ? labels.errorOffline
              : labels.errorGeneric,
      );
      setStatus("error");
    } catch {
      setError(labels.errorGeneric);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="mt-6 text-[0.8em] text-muted" role="status">
        {labels.done}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-[420px] flex-col gap-4">
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
  );
}
