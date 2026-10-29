import { describe, it, expect, beforeEach } from "vitest";
import {
  getTermsStatus,
  hasAcceptedTerms,
  acceptTerms,
  declineTerms,
  resetTerms,
  getAcceptedDate,
  TERMS_STORAGE_KEY,
  TERMS_DATE_KEY,
} from "@/lib/terms";

describe("Terms & Conditions visitor flow and storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to unseen and hasAcceptedTerms false for first-time visitors", () => {
    expect(getTermsStatus()).toBe("unseen");
    expect(hasAcceptedTerms()).toBe(false);
    expect(getAcceptedDate()).toBeNull();
  });

  it("records acceptance properly and saves acceptance timestamp", () => {
    acceptTerms();
    expect(getTermsStatus()).toBe("accepted");
    expect(hasAcceptedTerms()).toBe(true);
    expect(window.localStorage.getItem(TERMS_STORAGE_KEY)).toBe("accepted");
    expect(getAcceptedDate()).toBeTruthy();
  });

  it("records decline properly and keeps calculator access restricted", () => {
    declineTerms();
    expect(getTermsStatus()).toBe("declined");
    expect(hasAcceptedTerms()).toBe(false);
    expect(window.localStorage.getItem(TERMS_STORAGE_KEY)).toBe("declined");
  });

  it("resets terms status when revoked or tested", () => {
    acceptTerms();
    expect(hasAcceptedTerms()).toBe(true);

    resetTerms();
    expect(getTermsStatus()).toBe("unseen");
    expect(hasAcceptedTerms()).toBe(false);
    expect(window.localStorage.getItem(TERMS_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(TERMS_DATE_KEY)).toBeNull();
  });

  it("allows transition from declined to accepted when user changes their mind", () => {
    declineTerms();
    expect(getTermsStatus()).toBe("declined");
    expect(hasAcceptedTerms()).toBe(false);

    acceptTerms();
    expect(getTermsStatus()).toBe("accepted");
    expect(hasAcceptedTerms()).toBe(true);
  });
});
