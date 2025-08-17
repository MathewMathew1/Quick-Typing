import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";

function Home() {
  return <h1>Hello World</h1>;
}

describe("Home component", () => {
  it("renders heading", () => {
    render(<Home />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
