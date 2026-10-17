"use client";

import { useEffect, useRef, useState } from "react";
import TurnstileWidget, { type TurnstileHandle } from "./TurnstileWidget";
import SparkleStar from "./SparkleStar";
import { CONTACT_OPTIONS, type ServiceKey, type SingleChoice } from "@/lib/contact-options";

type StepKey = "name" | "services" | SingleChoice | "email" | "message";

/** The order visitors see. Easy questions first, the email late, the note last. */
const STEPS: StepKey[] = ["name", "services", "org", "site", "budget", "timeline", "email", "message"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long a picked tag stays visible before a single-choice step moves on. */
const ADVANCE_DELAY_MS = 250;

export type FlowCopy = {
  progress: string;
  next: string;
  back: string;
  submit: string;
  sending: string;
  optional: string;
  done: string;
  doneBody: string;
  steps: Record<StepKey, { question: string; hint: string; placeholder?: string }>;
  options: { [Q in keyof typeof CONTACT_OPTIONS]: Record<(typeof CONTACT_OPTIONS)[Q][number], string> };
};

export type FlowErrors = {
  errorInvalid: string;
  errorTurnstile: string;
  errorRate: string;
  errorOffline: string;
  errorGeneric: string;
};

type Answers = {
  name: string;
  services: ServiceKey[];
  email: string;
  message: string;
} & { [Q in SingleChoice]: (typeof CONTACT_OPTIONS)[Q][number] | null };

const EMPTY: Answers = {
  name: "",
  services: [],
  org: null,
  site: null,
  budget: null,
  timeline: null,
  email: "",
  message: "",
};

type Status = "idle" | "sending" | "done" | "error";

function isSingle(step: StepKey): step is SingleChoice {
  return step === "org" || step === "site" || step === "budget" || step === "timeline";
}

export default function ContactFlow({
  copy,
  errors,
  maxName,
  maxEmail,
  maxMessage,
  turnstileSiteKey,
}: {
  copy: FlowCopy;
  errors: FlowErrors;
  maxName: number;
  maxEmail: number;
  maxMessage: number;
  turnstileSiteKey: string | null;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const fieldRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number | null>(null);
  // Focus only moves once the visitor has started; on page load it would
  // scroll the page down to the form.
  const started = useRef(false);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const valid = (() => {
    if (step === "name") return answers.name.trim().length > 0;
    if (step === "services") return answers.services.length > 0;
    if (isSingle(step)) return answers[step] !== null;
    if (step === "email") return EMAIL_RE.test(answers.email.trim());
    return true; // the note is optional
  })();

  useEffect(() => {
    if (!started.current) return;
    if (fieldRef.current) fieldRef.current.focus();
    else headingRef.current?.focus();
  }, [index]);

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    },
    [],
  );

  const go = (to: number) => {
    started.current = true;
    setDirection(to > index ? 1 : -1);
    setIndex(to);
    if (status === "error") setStatus("idle");
  };

  const pickSingle = (question: SingleChoice, value: string) => {
    if (advanceTimer.current) return; // already on its way to the next step
    setAnswers((a) => ({ ...a, [question]: value }));
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      go(index + 1);
    }, ADVANCE_DELAY_MS);
  };

  const toggleService = (value: ServiceKey) =>
    setAnswers((a) => ({
      ...a,
      services: a.services.includes(value)
        ? a.services.filter((s) => s !== value)
        : [...a.services, value],
    }));

  const submit = async () => {
    const data = new FormData(formRef.current ?? undefined);
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          name: answers.name.trim(),
          email: answers.email.trim(),
          message: answers.message.trim(),
          website: data.get("website"),
          token: data.get("cf-turnstile-response"),
        }),
      });

      turnstileRef.current?.reset();

      if (response.ok) {
        setStatus("done");
        return;
      }

      const { reason } = (await response.json().catch(() => ({}))) as { reason?: string };
      setError(
        reason === "invalid"
          ? errors.errorInvalid
          : reason === "turnstile"
            ? errors.errorTurnstile
            : reason === "rate-limited"
              ? errors.errorRate
              : reason === "unconfigured"
                ? errors.errorOffline
                : errors.errorGeneric,
      );
      setStatus("error");
    } catch {
      turnstileRef.current?.reset();
      setError(errors.errorGeneric);
      setStatus("error");
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid || status === "sending") return;
    if (isLast) void submit();
    else go(index + 1);
  };

  if (status === "done") {
    return (
      <div className="flow-card rounded-md p-8 text-center sm:p-10" role="status">
        <SparkleStar className="sparkle-twinkle mx-auto mb-4 h-6 w-6 text-[#ff0000]" />
        <p className="text-[1.1em] font-semibold">
          {copy.done.replace("{name}", answers.name.trim())}
        </p>
        <p className="mt-2 text-[0.8em] text-muted">{copy.doneBody}</p>
      </div>
    );
  }

  const text = copy.steps[step];
  const tag = (selected: boolean) =>
    `flow-tag flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[0.75em] ${
      selected ? "is-selected" : ""
    }`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flow-card rounded-md p-6 sm:p-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <div
            className="h-full rounded-full bg-fg transition-[width] duration-300 ease-out"
            style={{ width: `${((index + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="font-mono text-[0.65em] text-muted">
          {copy.progress.replace("{n}", String(index + 1)).replace("{total}", String(STEPS.length))}
        </p>
      </div>

      {/* Keyed by step so each question remounts and plays its slide-in. */}
      <div key={step} className="flow-step min-h-[180px]" data-dir={direction}>
        <h3 ref={headingRef} tabIndex={-1} className="text-[1.25em] font-semibold outline-none">
          {text.question}
          {step === "message" && (
            <span className="ml-2 font-mono text-[0.6em] font-normal text-muted">
              ({copy.optional})
            </span>
          )}
        </h3>
        <p className="mt-1 text-[0.75em] text-muted">{text.hint}</p>

        <div className="mt-6">
          {(step === "name" || step === "email") && (
            <input
              ref={fieldRef}
              type={step === "email" ? "email" : "text"}
              name={step}
              value={answers[step]}
              onChange={(e) => setAnswers((a) => ({ ...a, [step]: e.target.value }))}
              maxLength={step === "email" ? maxEmail : maxName}
              autoComplete={step}
              placeholder={text.placeholder}
              aria-label={text.question}
              className="w-full border-b border-line bg-transparent py-2 text-[1em] outline-none transition-colors placeholder:text-muted/50 focus:border-fg"
            />
          )}

          {step === "message" && (
            <>
              <textarea
                ref={fieldRef}
                name="message"
                rows={4}
                value={answers.message}
                onChange={(e) => setAnswers((a) => ({ ...a, message: e.target.value }))}
                maxLength={maxMessage}
                placeholder={text.placeholder}
                aria-label={text.question}
                className="w-full resize-y rounded-md bg-bg px-3 py-2 text-[0.8em] outline-none placeholder:text-muted/50"
              />
              <p className="mt-1 text-right font-mono text-[0.6em] text-muted">
                {answers.message.length}/{maxMessage}
              </p>
            </>
          )}

          {step === "services" && (
            <div className="flex flex-wrap gap-2">
              {CONTACT_OPTIONS.services.map((key) => {
                const selected = answers.services.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleService(key)}
                    className={tag(selected)}
                  >
                    <SparkleStar className="h-3 w-3 shrink-0 text-[#ff0000]" />
                    {copy.options.services[key]}
                  </button>
                );
              })}
            </div>
          )}

          {isSingle(step) && (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={text.question}>
              {CONTACT_OPTIONS[step].map((key: string) => {
                const selected = answers[step] === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => pickSingle(step, key)}
                    className={tag(selected)}
                  >
                    <SparkleStar className="h-3 w-3 shrink-0 text-[#ff0000]" />
                    {(copy.options[step] as Record<string, string>)[key]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="ct-website">Website</label>
        <input id="ct-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey && (
        <TurnstileWidget ref={turnstileRef} siteKey={turnstileSiteKey} action="contact" />
      )}

      {status === "error" && (
        <p className="mt-4 text-[0.75em] text-[#ff6b6b]" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="font-mono text-[0.75em] text-muted transition-colors hover:text-fg"
          >
            ← {copy.back}
          </button>
        ) : (
          <span />
        )}

        {/* Single-choice steps advance on click, so they only need a button
            when coming back to a step that already has an answer. */}
        {(!isSingle(step) || answers[step] !== null) && (
          <button
            type="submit"
            disabled={!valid || status === "sending"}
            className="btn-card btn-card-solid px-5 py-2.5 font-mono text-[0.8em] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "sending" ? copy.sending : isLast ? copy.submit : copy.next}
          </button>
        )}
      </div>
    </form>
  );
}
