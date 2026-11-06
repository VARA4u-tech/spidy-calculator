import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LineSidebar, type LineSidebarItem } from "@/components/LineSidebar";

const TEST_CATEGORIES: LineSidebarItem[] = [
  {
    id: "core",
    label: "Basic & Scientific",
    badge: "123",
    subcategories: [
      { id: "basic", label: "Basic Arithmetic" },
      { id: "sci", label: "Scientific Trig" },
    ],
  },
  {
    id: "percentage",
    label: "Percentage Calculator",
    badge: "5 Tools",
    subcategories: [
      { id: "percentOf", label: "P% of X" },
      { id: "discount", label: "Discount & Sale" },
    ],
  },
  {
    id: "abacus",
    label: "Soroban Abacus",
    badge: "Tactile",
  },
];

describe("LineSidebar Component", () => {
  it("renders category items with zero-padded indices and labels", () => {
    render(<LineSidebar items={TEST_CATEGORIES} />);

    expect(screen.getByText("Basic & Scientific")).toBeInTheDocument();
    expect(screen.getByText("Percentage Calculator")).toBeInTheDocument();
    expect(screen.getByText("Soroban Abacus")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("handles category clicks and expands subcategories", () => {
    const onItemClick = vi.fn();
    render(<LineSidebar items={TEST_CATEGORIES} onItemClick={onItemClick} defaultActive={0} />);

    // Basic & Scientific is active by default, subcategories should be visible
    expect(screen.getByText("Basic Arithmetic")).toBeInTheDocument();
    expect(screen.getByText("Scientific Trig")).toBeInTheDocument();

    // Click on Percentage Calculator
    const percentItem = screen.getByText("Percentage Calculator");
    fireEvent.click(percentItem);

    expect(onItemClick).toHaveBeenCalledWith(1, TEST_CATEGORIES[1]);
    expect(screen.getByText("P% of X")).toBeInTheDocument();
    expect(screen.getByText("Discount & Sale")).toBeInTheDocument();
  });

  it("triggers onSubItemClick when a subcategory is clicked", () => {
    const onSubItemClick = vi.fn();
    render(
      <LineSidebar items={TEST_CATEGORIES} defaultActive={0} onSubItemClick={onSubItemClick} />,
    );

    const subItem = screen.getByText("Scientific Trig");
    fireEvent.click(subItem);

    expect(onSubItemClick).toHaveBeenCalledWith(0, {
      id: "sci",
      label: "Scientific Trig",
    });
  });

  it("supports keyboard navigation with Enter", () => {
    const onItemClick = vi.fn();
    render(<LineSidebar items={TEST_CATEGORIES} onItemClick={onItemClick} defaultActive={0} />);

    const abacusItem = screen.getByText("Soroban Abacus").closest("li")!;
    fireEvent.keyDown(abacusItem, { key: "Enter" });

    expect(onItemClick).toHaveBeenCalledWith(2, TEST_CATEGORIES[2]);
  });
});
