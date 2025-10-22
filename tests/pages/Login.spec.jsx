import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/Login";

// Mocks de Nav/Footer para simplificar el DOM
vi.mock("../../src/components/Nav", () => ({ default: () => <nav>Nav</nav> }));
vi.mock("../../src/components/Footer", () => ({ default: () => <footer>Footer</footer> }));

describe("Login", () => {
  it("muestra labels y el link para entrar", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /entrar/i });
    expect(link).toHaveAttribute("href", "/calendario");
  });

  it("muestra el link para registrarse", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const linkRegistro = screen.getByRole("link", { name: /regístrate aquí/i });
    expect(linkRegistro).toHaveAttribute("href", "/Registro"); // coincide con tu código
  });
});
