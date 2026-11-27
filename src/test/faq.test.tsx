import type { MouseEventHandler, ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAQSection } from "@/components/FAQSection";
import { FAQS } from "@/lib/faq";

interface MockLinkProps {
  children?: ReactNode;
  to?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, onClick, className }: MockLinkProps) => (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  ),
  useRouterState: () => ({ pathname: "/" }),
}));

describe("FAQSection component", () => {
  it("renders the section header and all 7 FAQ questions", () => {
    render(<FAQSection />);
    expect(screen.getByText("GOT QUESTIONS?")).toBeDefined();
    expect(screen.getByText("WE'VE GOT ANSWERS!")).toBeDefined();

    expect(FAQS).toHaveLength(7);
    for (const faq of FAQS) {
      expect(screen.getByText(faq.question)).toBeDefined();
    }
  });

  it("has the first FAQ question open by default and shows answer text", () => {
    render(<FAQSection />);
    const firstFaq = FAQS[0]!;
    const triggerBtn = screen.getByText(firstFaq.question).closest("button");
    expect(triggerBtn?.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/zero banner ads/i)).toBeDefined();
  });

  it("toggles an accordion item open and closed when clicked", () => {
    render(<FAQSection />);
    const secondFaq = FAQS[1]!;
    const triggerBtn = screen.getByText(secondFaq.question).closest("button")!;

    expect(triggerBtn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(triggerBtn);
    expect(triggerBtn.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/Progressive Web App/i)).toBeDefined();

    fireEvent.click(triggerBtn);
    expect(triggerBtn.getAttribute("aria-expanded")).toBe("false");
  });
});
