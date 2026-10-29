/**
 * Terms & Conditions Acceptance State & Storage Management
 * Handles first-time visitor detection and calculator route protection.
 */

import { useCallback, useEffect, useState } from "react";

export const TERMS_STORAGE_KEY = "spidy-terms-accepted";
export const TERMS_DATE_KEY = "spidy-terms-accepted-date";
export const TERMS_EVENT_NAME = "spidy-terms-changed";

export type TermsStatus = "accepted" | "declined" | "unseen";

/**
 * Dispatches a client-side event so any mounted component updates its state instantly.
 */
function notifyTermsChanged() {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(TERMS_EVENT_NAME));
  } catch {
    // Ignore in unsupported environments
  }
}

/**
 * Returns the current terms acceptance status from browser localStorage.
 * Safe for SSR (returns "unseen" when window is undefined).
 */
export function getTermsStatus(): TermsStatus {
  if (typeof window === "undefined") return "unseen";
  try {
    const val = window.localStorage.getItem(TERMS_STORAGE_KEY);
    if (val === "accepted") return "accepted";
    if (val === "declined") return "declined";
    return "unseen";
  } catch {
    return "unseen";
  }
}

/**
 * Returns true if the user has explicitly accepted the Terms & Conditions.
 */
export function hasAcceptedTerms(): boolean {
  return getTermsStatus() === "accepted";
}

/**
 * Returns the ISO date string of when terms were accepted, if available.
 */
export function getAcceptedDate(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TERMS_DATE_KEY);
  } catch {
    return null;
  }
}

/**
 * Records that the user accepted the terms and saves the timestamp.
 */
export function acceptTerms(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TERMS_STORAGE_KEY, "accepted");
    window.localStorage.setItem(TERMS_DATE_KEY, new Date().toISOString());
    notifyTermsChanged();
  } catch {
    // Storage quota or disabled
  }
}

/**
 * Records that the user declined the terms.
 */
export function declineTerms(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TERMS_STORAGE_KEY, "declined");
    notifyTermsChanged();
  } catch {
    // Storage quota or disabled
  }
}

/**
 * Resets terms status (useful for testing or revoking consent).
 */
export function resetTerms(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TERMS_STORAGE_KEY);
    window.localStorage.removeItem(TERMS_DATE_KEY);
    notifyTermsChanged();
  } catch {
    // Storage quota or disabled
  }
}

/**
 * React hook to listen for terms status updates and manage user acceptance state.
 */
export function useTermsStatus() {
  const [status, setStatus] = useState<TermsStatus>("unseen");
  const [acceptedDate, setAcceptedDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setStatus(getTermsStatus());
      setAcceptedDate(getAcceptedDate());
      setIsLoaded(true);
    };

    sync();

    window.addEventListener(TERMS_EVENT_NAME, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(TERMS_EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const accept = useCallback(() => {
    acceptTerms();
    setStatus("accepted");
    setAcceptedDate(new Date().toISOString());
  }, []);

  const decline = useCallback(() => {
    declineTerms();
    setStatus("declined");
  }, []);

  const reset = useCallback(() => {
    resetTerms();
    setStatus("unseen");
    setAcceptedDate(null);
  }, []);

  return {
    status,
    acceptedDate,
    hasAccepted: status === "accepted",
    isLoaded,
    accept,
    decline,
    reset,
  };
}
