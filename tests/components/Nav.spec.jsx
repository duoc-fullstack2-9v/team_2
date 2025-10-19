import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nav from "../../src/components/Nav";

// mock del logo:
vi.mock("../../src/assets/calendar.png", () => ({ default: "calendar.png" }));

describe("Nav", () => {
  it("muestra el título y el botón de login", () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    expect(screen.getByText("Tu Turno")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /iniciar sesión/i });
    // En tests con MemoryRouter, el href será "/login"
    expect(link).toHaveAttribute("href", "/login");
  });
});
