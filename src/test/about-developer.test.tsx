import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AboutDeveloper } from "@/components/AboutDeveloper";

// Mock tanstack router hooks
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, onClick, className }: any) => (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  ),
  useRouterState: () => ({ pathname: "/" }),
  useNavigate: () => vi.fn(),
}));

describe("AboutDeveloper component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the floating About the Developer trigger button", () => {
    render(<AboutDeveloper />);
    const trigger = screen.getByRole("button", { name: /about the developer/i });
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the animated popover with four core actions when clicked", () => {
    render(<AboutDeveloper />);
    const trigger = screen.getByRole("button", { name: /about the developer/i });
    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("CREATOR'S DESK")).toBeDefined();
    expect(screen.getByText("Feedback Form")).toBeDefined();
    expect(screen.getByText("Developer Details")).toBeDefined();
    expect(screen.getByText("Quick Actions")).toBeDefined();
    expect(screen.getByText("Comic Art Preview")).toBeDefined();
  });

  it("navigates to Feedback Form, validates empty message, and allows typing", () => {
    render(<AboutDeveloper />);
    const trigger = screen.getByRole("button", { name: /about the developer/i });
    fireEvent.click(trigger);

    const feedbackBtn = screen.getByText("Feedback Form");
    fireEvent.click(feedbackBtn);

    expect(screen.getByText("MISSION FEEDBACK")).toBeDefined();
    const textarea = screen.getByPlaceholderText(/share your feedback/i) as HTMLTextAreaElement;
    expect(textarea).toBeDefined();

    // Attempt empty submit
    const submitBtn = screen.getByRole("button", { name: /submit feedback/i });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/hold on, hero!/i)).toBeDefined();

    // Type valid feedback
    fireEvent.change(textarea, { target: { value: "Great retro styling on the calculator!" } });
    expect(textarea.value).toBe("Great retro styling on the calculator!");
  });

  it("navigates to Developer Details and renders verified external profile links", () => {
    render(<AboutDeveloper />);
    const trigger = screen.getByRole("button", { name: /about the developer/i });
    fireEvent.click(trigger);

    const devDetailsBtn = screen.getByText("Developer Details");
    fireEvent.click(devDetailsBtn);

    expect(screen.getByText("DEVELOPER DOSSIER")).toBeDefined();
    expect(screen.getByText("Pappuri Durga Vara Prasad")).toBeDefined();

    const githubLink = screen.getByText("GitHub").closest("a");
    expect(githubLink?.getAttribute("href")).toBe("https://github.com/VARA4u-tech");

    const portfolioLink = screen.getByText("Live Portfolio").closest("a");
    expect(portfolioLink?.getAttribute("href")).toBe("https://vara-s-portfolio.vercel.app");

    const emailLink = screen.getByText("Direct Email").closest("a");
    expect(emailLink?.getAttribute("href")).toBe("mailto:pappuridurgavaraprasad4pl@gmail.com");
  });

  it("navigates to Quick Actions and allows sound toggle", () => {
    render(<AboutDeveloper />);
    const trigger = screen.getByRole("button", { name: /about the developer/i });
    fireEvent.click(trigger);

    const quickActionsBtn = screen.getByText("Quick Actions");
    fireEvent.click(quickActionsBtn);

    expect(screen.getByText("QUICK ACTIONS")).toBeDefined();
    expect(screen.getByText("Sound Effects (SFX)")).toBeDefined();
    expect(screen.getByText("Clear Case History")).toBeDefined();
  });
});

