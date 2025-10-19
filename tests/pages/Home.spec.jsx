import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../../src/pages/Home";

vi.mock("../../src/assets/calendar.png", () => ({ default: "calendar.png" }));

describe("Home", () => {
  it("renderiza el mensaje principal", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Plataforma dedicada a la organización.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Coordina tu agenda, coordina tu vida.")
    ).toBeInTheDocument();
  });
});
