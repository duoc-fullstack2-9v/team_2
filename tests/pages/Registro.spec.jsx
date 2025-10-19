import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Registro from "../../src/pages/Registro";

// Mocks Nav/Footer
vi.mock("../../src/components/Nav", () => ({ default: () => <nav>Nav</nav> }));
vi.mock("../../src/components/Footer", () => ({ default: () => <footer>Footer</footer> }));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal();
  return { ...mod, useNavigate: () => mockNavigate };
});

describe("Registro", () => {
  beforeEach(() => mockNavigate.mockReset());

  it("muestra errores por campo y mantiene el botón deshabilitado", async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    // disparar errores sin escribir (si tu handleBlur no valida, forzamos handleChange)
    const nombre = screen.getByLabelText(/nombre/i);
    await userEvent.click(nombre);
    await userEvent.type(nombre, " ");
    await userEvent.clear(nombre);
    await userEvent.tab();
    expect(await screen.findByText(/este campo es obligatorio/i)).toBeInTheDocument();

    const rut = screen.getByLabelText(/rut/i);
    await userEvent.type(rut, "12.345-6");
    await userEvent.tab();
    expect(await screen.findByText(/debe tener 7 u 8 dígitos/i)).toBeInTheDocument();

    const correo = screen.getByLabelText(/correo electrónico/i);
    await userEvent.type(correo, "malcorreo");
    await userEvent.tab();
    expect(await screen.findByText(/formato de correo inválido/i)).toBeInTheDocument();

    const pass = screen.getByLabelText(/^contraseña:/i);
    await userEvent.type(pass, "abc12345");
    await userEvent.tab();
    expect(
      await screen.findByText(/mínimo 8 y debe incluir mayúscula, minúscula, número y símbolo/i)
    ).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /registrarse/i });
    expect(btn).toBeDisabled();
  });

  it("navega a /calendario con todos los campos válidos", async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/nombre/i), "Luis");
    await userEvent.type(screen.getByLabelText(/apellido/i), "Pérez");
    await userEvent.type(screen.getByLabelText(/rut/i), "12345678"); // 7 u 8 dígitos
    await userEvent.selectOptions(screen.getByLabelText(/sexo/i), "masculino");
    await userEvent.type(screen.getByLabelText(/edad/i), "30");
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "user@dominio.com");
    await userEvent.type(screen.getByLabelText(/^contraseña:/i), "Aa1@aaaa");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "Aa1@aaaa");

    const btn = screen.getByRole("button", { name: /registrarse/i });
    await waitFor(() => expect(btn).toBeEnabled());

    await userEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith("/calendario");
  });

  it("muestra error cuando las contraseñas no coinciden", async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/^contraseña:/i), "Aa1@aaaa");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "Aa1@aaab");
    await userEvent.tab();

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });
});
