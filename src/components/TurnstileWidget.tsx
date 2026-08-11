"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("turnstile script failed"));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * A Cloudflare Turnstile challenge, rendered so it stays out of the way
 * ("interaction-only": no visible UI unless Cloudflare actually needs to
 * challenge the visitor). Renders a hidden `cf-turnstile-response` input
 * inside itself, which the surrounding form reads on submit like any other
 * field. Tokens are single-use, so callers reset the widget via the ref
 * after every submit attempt to get a fresh one for a retry.
 */
const TurnstileWidget = forwardRef<
  TurnstileHandle,
  { siteKey: string; action: string }
>(function TurnstileWidget({ siteKey, action }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    reset() {
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;

    loadScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        appearance: "interaction-only",
      });
    });

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [siteKey, action]);

  return <div ref={containerRef} />;
});

export default TurnstileWidget;
