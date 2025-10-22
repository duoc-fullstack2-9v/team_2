import { render, screen } from "@testing-library/react";
import Footer from "../../src/components/Footer";

describe("Footer", () => {
  it("muestra los datos de contacto", () => {
    render(<Footer />);
    expect(screen.getByText(/contacto@tuturno\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+56 9 1234 5678/)).toBeInTheDocument();
  });
});
