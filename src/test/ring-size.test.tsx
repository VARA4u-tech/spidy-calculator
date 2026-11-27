import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RingSizeCalculator } from "@/components/calculators/RingSizeCalculator";

class MockPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;

  constructor(type: string, params: PointerEventInit = {}) {
    super(type, params);
    this.pointerId = params.pointerId ?? 1;
    this.pointerType = params.pointerType ?? "touch";
  }
}

describe("RingSizeCalculator component", () => {
  const originalPointerEvent = globalThis.PointerEvent;

  beforeAll(() => {
    if (!globalThis.PointerEvent) {
      globalThis.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
    }
  });

  afterAll(() => {
    globalThis.PointerEvent = originalPointerEvent;
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("removes upper size limit and converts arbitrary large and small values", () => {
    render(<RingSizeCalculator />);
    const input = screen.getByRole("spinbutton", {
      name: /inside diameter/i,
    }) as HTMLInputElement;

    expect(input.getAttribute("max")).toBeNull();
    expect(input.value).toBe("17.3");

    // Enter value beyond previous 30mm / US 13 limit
    fireEvent.change(input, { target: { value: "42" } });
    expect(input.value).toBe("42");
    expect(screen.getByText("42mm")).toBeDefined();
    expect(screen.getByText(/UNLIMITED CUSTOM SIZE/i)).toBeDefined();

    // Enter value below previous 10mm / US 3 limit
    fireEvent.change(input, { target: { value: "7.5" } });
    expect(input.value).toBe("7.5");
    expect(screen.getByText("7.5mm")).toBeDefined();
  });

  it("increases ring size when swiping up and decreases when swiping down on the sidebar", () => {
    render(<RingSizeCalculator />);
    const sidebar = screen.getByTestId("ring-swipe-sidebar");
    const input = screen.getByRole("spinbutton", {
      name: /inside diameter/i,
    }) as HTMLInputElement;

    expect(input.value).toBe("17.3");

    // Swipe UP: clientY decreases (300 -> 250 = +50px up => +1.0mm diameter)
    fireEvent.pointerDown(sidebar, { pointerId: 1, pointerType: "touch", clientY: 300 });
    fireEvent.pointerMove(sidebar, { pointerId: 1, pointerType: "touch", clientY: 250 });
    fireEvent.pointerUp(sidebar, { pointerId: 1, pointerType: "touch", clientY: 250 });

    expect(parseFloat(input.value)).toBe(18.3);

    // Swipe DOWN: clientY increases (200 -> 275 = -75px down => -1.5mm diameter)
    fireEvent.pointerDown(sidebar, { pointerId: 2, pointerType: "touch", clientY: 200 });
    fireEvent.pointerMove(sidebar, { pointerId: 2, pointerType: "touch", clientY: 275 });
    fireEvent.pointerUp(sidebar, { pointerId: 2, pointerType: "touch", clientY: 275 });

    expect(parseFloat(input.value)).toBe(16.8);
  });

  it("supports + UP, - DOWN buttons and Arrow keys on the swipe sidebar", () => {
    render(<RingSizeCalculator />);
    const sidebar = screen.getByTestId("ring-swipe-sidebar");
    const upBtn = screen.getByRole("button", { name: /increase ring size/i });
    const downBtn = screen.getByRole("button", { name: /decrease ring size/i });
    const input = screen.getByRole("spinbutton", {
      name: /inside diameter/i,
    }) as HTMLInputElement;

    expect(input.value).toBe("17.3");

    fireEvent.click(upBtn);
    expect(parseFloat(input.value)).toBe(17.4);

    fireEvent.keyDown(sidebar, { key: "ArrowUp", shiftKey: true });
    expect(parseFloat(input.value)).toBe(18.4);

    fireEvent.click(downBtn);
    expect(parseFloat(input.value)).toBe(18.3);

    fireEvent.keyDown(sidebar, { key: "ArrowDown" });
    expect(parseFloat(input.value)).toBe(18.2);
  });
});
