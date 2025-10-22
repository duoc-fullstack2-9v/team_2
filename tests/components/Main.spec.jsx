import { render, screen } from "@testing-library/react";
import Main from "../../src/components/Main";

describe("Main", () => {
  it("renderiza las líneas recibidas por props", () => {
    render(<Main linea1="Plataforma" linea2="Coordina tu vida" />);
    expect(screen.getByText("Plataforma")).toBeInTheDocument();
    expect(screen.getByText("Coordina tu vida")).toBeInTheDocument();
  });
});
