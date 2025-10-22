import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Calendario from "../../src/pages/Calendario";

// Espía para capturar props del mock
const fcPropsSpy = vi.fn();

// Mock FullCalendar
vi.mock("@fullcalendar/react", () => ({
  __esModule: true,
  default: (props) => {
    fcPropsSpy(props);
    return <div data-testid="fc-mock" />;
  },
}));

// Mock Nav/Footer
vi.mock("../../src/components/Nav", () => ({ default: () => <nav>Nav</nav> }));
vi.mock("../../src/components/Footer", () => ({ default: () => <footer>Footer</footer> }));

describe("Calendario (acciones del usuario)", () => {
  beforeEach(() => {
    fcPropsSpy.mockClear();
    vi.restoreAllMocks();
  });

  it("crea un nuevo evento cuando se selecciona una fecha y se confirma título", async () => {
    render(
      <MemoryRouter>
        <Calendario />
      </MemoryRouter>
    );

    const props = fcPropsSpy.mock.calls.at(-1)[0];
    expect(props.events.length).toBe(2);

    const unselect = vi.fn();
    vi.spyOn(window, "prompt").mockReturnValue("Nuevo turno");

    props.select({
      start: "2025-10-20T09:00:00",
      end: "2025-10-20T10:00:00",
      allDay: false,
      view: { calendar: { unselect } },
    });

    await waitFor(() => {
      const lastProps = fcPropsSpy.mock.calls.at(-1)[0];
      expect(lastProps.events.length).toBe(3);
      expect(unselect).toHaveBeenCalled();
    });
  });

  it('elimina un evento cuando el usuario escribe "DEL"', async () => {
    render(
      <MemoryRouter>
        <Calendario />
      </MemoryRouter>
    );

    const props = fcPropsSpy.mock.calls.at(-1)[0];
    vi.spyOn(window, "prompt").mockReturnValue("DEL");
    const remove = vi.fn();

    props.eventClick({ event: { id: "1", title: "Turno", remove, setProp: vi.fn() } });

    await waitFor(() => {
      const newProps = fcPropsSpy.mock.calls.at(-1)[0];
      expect(remove).toHaveBeenCalled();
      expect(newProps.events.some((e) => e.id === "1")).toBe(false);
    });
  });

  it("renombra un evento cuando el usuario ingresa un nuevo título", async () => {
    render(
      <MemoryRouter>
        <Calendario />
      </MemoryRouter>
    );

    const props = fcPropsSpy.mock.calls.at(-1)[0];
    vi.spyOn(window, "prompt").mockReturnValue("Editado");
    const setProp = vi.fn();

    props.eventClick({ event: { id: "2", title: "Turno", setProp, remove: vi.fn() } });

    await waitFor(() => {
      const updatedProps = fcPropsSpy.mock.calls.at(-1)[0];
      const edited = updatedProps.events.find((e) => e.id === "2");
      expect(setProp).toHaveBeenCalledWith("title", "Editado");
      expect(edited?.title).toBe("Editado");
    });
  });

  it("ejecuta handleEventChange correctamente (solo cobertura)", () => {
    render(
      <MemoryRouter>
        <Calendario />
      </MemoryRouter>
    );

    const props = fcPropsSpy.mock.calls.at(-1)[0];
    const event = { id: "1", title: "Turno", start: "2025-10-12" };
    expect(() => props.eventChange({ event })).not.toThrow();
  });
});
