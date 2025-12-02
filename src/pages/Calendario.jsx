import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { turnosApi } from "../services/api";
import { getUserSession, clearUserSession } from "../services/session";

// Convierte un Date a "YYYY-MM-DDTHH:mm:00" en hora local
const toLocalDateTimeString = (date) => {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

// Devuelve "YYYY-MM-DD" desde un Date local
const formatDateForPrompt = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

// Devuelve "HH:mm" desde un Date local
const formatTimeForPrompt = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${hours}:${minutes}`;
};

function Calendario() {
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  const [showPanel, setShowPanel] = useState(false);
  const [events, setEvents] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Verificar sesión y cargar usuario
  useEffect(() => {
    const sesion = getUserSession();
    if (!sesion) {
      navigate("/login");
      return;
    }
    setUsuario(sesion);
  }, [navigate]);

  // Función para mapear TurnoResponse del backend a evento FullCalendar
  const mapTurnoToEvent = (t) => ({
    id: t.id.toString(),
    title: t.titulo,
    start: t.inicioTurno,
    end: t.finTurno,
    allDay: t.turnoDiaCompleto,
  });

  // Cargar turnos del backend
  const cargarTurnos = async (usuarioId) => {
    try {
      const turnos = await turnosApi.listarPorUsuario(usuarioId);
      const eventos = turnos.map(mapTurnoToEvent);
      setEvents(eventos);
    } catch (err) {
      console.error("Error al cargar turnos:", err);
      alert("Error al cargar los turnos del usuario.");
    }
  };

  // Cuando ya tenemos usuario, cargar sus turnos
  useEffect(() => {
    if (usuario && usuario.id) {
      cargarTurnos(usuario.id);
    }
  }, [usuario]);

  // Crear turno seleccionando en el calendario
  const handleDateSelect = async (selectInfo) => {
    if (!usuario) return;

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    // 1) Título
    const titulo = prompt("Título del turno:");
    if (!titulo) return;

    // 2) Calculamos inicio y fin
    let start = selectInfo.start;
    let end = selectInfo.end || selectInfo.start;
    let allDay = selectInfo.allDay;

    // Si el usuario selecciona en vista de mes (día completo),
    // pedimos hora de inicio y fin manualmente.
    if (selectInfo.allDay || selectInfo.view.type === "dayGridMonth") {
      const horaInicio = prompt(
        "Hora de inicio (formato 24h, ej: 09:00)",
        "09:00"
      );
      if (!horaInicio) return;

      const horaFin = prompt(
        "Hora de término (formato 24h, ej: 10:30)",
        "10:00"
      );
      if (!horaFin) return;

      const [hIni, mIni] = horaInicio.split(":").map(Number);
      const [hFin, mFin] = horaFin.split(":").map(Number);

      if (
        Number.isNaN(hIni) ||
        Number.isNaN(mIni) ||
        Number.isNaN(hFin) ||
        Number.isNaN(mFin)
      ) {
        alert("Formato de hora inválido. Usa HH:mm, por ejemplo 09:00.");
        return;
      }

      // Usamos la fecha inicial seleccionada y le fijamos las horas
      start = new Date(start);
      start.setHours(hIni, mIni, 0, 0);

      end = new Date(start);
      end.setHours(hFin, mFin, 0, 0);

      allDay = false; // ya no es día completo
    }

    // Validación simple por si el usuario pone fin antes que inicio
    if (end <= start) {
      alert("La hora de término debe ser posterior a la hora de inicio.");
      return;
    }

    const payload = {
      titulo,
      inicioTurno: toLocalDateTimeString(start),
      finTurno: toLocalDateTimeString(end),
      turnoDiaCompleto: allDay,
      usuarioId: usuario.id,
    };

    try {
      const nuevoTurno = await turnosApi.crear(payload);
      setEvents((prev) => [...prev, mapTurnoToEvent(nuevoTurno)]);
    } catch (err) {
      console.error("Error al crear turno:", err);
      alert(err.message || "Error al crear el turno.");
    }
  };

  // Clic en evento: editar título, fecha y horas, o borrar
  const handleEventClick = async (clickInfo) => {
    if (!usuario) return;

    const ev = clickInfo.event;

    const accion = prompt(
      `Acción para el turno:\n` +
        `- Escribe "DEL" para borrar.\n` +
        `- Escribe "EDIT" para modificar título, fecha y horas.\n` +
        `- O escribe un nuevo título directamente.\n\n` +
        `Actual: ${ev.title}`
    );

    if (accion === null) return;

    const turnoId = Number(ev.id);
    const accionUpper = accion.trim().toUpperCase();

    // 1) Borrar
    if (accionUpper === "DEL") {
      try {
        await turnosApi.eliminar(turnoId, usuario.id);
        setEvents((prev) => prev.filter((e) => e.id !== ev.id));
        ev.remove();
      } catch (err) {
        console.error("Error al eliminar turno:", err);
        alert(err.message || "Error al eliminar el turno.");
      }
      return;
    }

    // 2) Editar todo (título, fecha, horas)
    if (accionUpper === "EDIT") {
      const startActual = ev.start;
      const endActual = ev.end || ev.start;

      // Título
      const nuevoTitulo = prompt(
        "Nuevo título (deja vacío para mantener el actual):",
        ev.title
      );

      const tituloFinal =
        nuevoTitulo && nuevoTitulo.trim() !== ""
          ? nuevoTitulo.trim()
          : ev.title;

      // Fecha
      const fechaPorDefecto = formatDateForPrompt(startActual);
      const nuevaFechaStr = prompt(
        'Fecha del turno (formato "YYYY-MM-DD"):',
        fechaPorDefecto
      );
      if (!nuevaFechaStr) {
        alert("La fecha es obligatoria.");
        return;
      }

      const [y, m, d] = nuevaFechaStr.split("-").map(Number);
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) {
        alert(
          "Formato de fecha inválido. Usa YYYY-MM-DD, por ejemplo 2025-12-02."
        );
        return;
      }

      // Horas
      const horaInicioDef = formatTimeForPrompt(startActual);
      const horaFinDef = formatTimeForPrompt(endActual);

      const horaInicioStr = prompt(
        'Hora de inicio (formato "HH:mm"):',
        horaInicioDef
      );
      if (!horaInicioStr) {
        alert("La hora de inicio es obligatoria.");
        return;
      }

      const horaFinStr = prompt(
        'Hora de término (formato "HH:mm"):',
        horaFinDef
      );
      if (!horaFinStr) {
        alert("La hora de término es obligatoria.");
        return;
      }

      const [hIni, minIni] = horaInicioStr.split(":").map(Number);
      const [hFin, minFin] = horaFinStr.split(":").map(Number);

      if (
        Number.isNaN(hIni) ||
        Number.isNaN(minIni) ||
        Number.isNaN(hFin) ||
        Number.isNaN(minFin)
      ) {
        alert("Formato de hora inválido. Usa HH:mm, por ejemplo 09:00.");
        return;
      }

      // Construimos nuevos Date locales
      const nuevoStart = new Date(y, m - 1, d, hIni, minIni, 0, 0);
      const nuevoEnd = new Date(y, m - 1, d, hFin, minFin, 0, 0);

      if (nuevoEnd <= nuevoStart) {
        alert("La hora de término debe ser posterior a la hora de inicio.");
        return;
      }

      const payload = {
        titulo: tituloFinal,
        inicioTurno: toLocalDateTimeString(nuevoStart),
        finTurno: toLocalDateTimeString(nuevoEnd),
        turnoDiaCompleto: false, // si editas con horas, no es día completo
        usuarioId: usuario.id,
      };

      try {
        const actualizado = await turnosApi.actualizar(
          turnoId,
          payload,
          usuario.id
        );

        // Actualizamos el evento en el calendario
        ev.setProp("title", actualizado.titulo);
        ev.setStart(actualizado.inicioTurno);
        ev.setEnd(actualizado.finTurno);
        ev.setAllDay(actualizado.turnoDiaCompleto);

        // Actualizamos el estado local
        setEvents((prev) =>
          prev.map((e) => (e.id === ev.id ? mapTurnoToEvent(actualizado) : e))
        );
      } catch (err) {
        console.error("Error al actualizar turno:", err);
        alert(err.message || "Error al actualizar el turno.");
      }

      return;
    }

    // 3) Si no es DEL ni EDIT, lo tratamos como "cambiar solo el título"
    const nuevoTituloSimple = accion.trim();
    if (!nuevoTituloSimple) return;

    const start = ev.start;
    const end = ev.end || ev.start;
    const allDay = ev.allDay;

    const payload = {
      titulo: nuevoTituloSimple,
      inicioTurno: toLocalDateTimeString(start),
      finTurno: toLocalDateTimeString(end),
      turnoDiaCompleto: allDay,
      usuarioId: usuario.id,
    };

    try {
      const actualizado = await turnosApi.actualizar(
        turnoId,
        payload,
        usuario.id
      );

      ev.setProp("title", actualizado.titulo);

      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? mapTurnoToEvent(actualizado) : e))
      );
    } catch (err) {
      console.error("Error al actualizar turno:", err);
      alert(err.message || "Error al actualizar el turno.");
    }
  };

  // Arrastrar o redimensionar evento: actualizar en backend
  const handleEventChange = async (changeInfo) => {
    if (!usuario) return;

    const ev = changeInfo.event;
    const turnoId = Number(ev.id);

    const start = ev.start;
    const end = ev.end || ev.start;
    const allDay = ev.allDay;

    const payload = {
      titulo: ev.title,
      inicioTurno: toLocalDateTimeString(start),
      finTurno: toLocalDateTimeString(end),
      turnoDiaCompleto: allDay,
      usuarioId: usuario.id,
    };

    try {
      const actualizado = await turnosApi.actualizar(
        turnoId,
        payload,
        usuario.id
      );

      setEvents((prev) =>
        prev.map((e) => (e.id === ev.id ? mapTurnoToEvent(actualizado) : e))
      );
    } catch (err) {
      console.error("Error al actualizar turno al mover/redimensionar:", err);
      alert(err.message || "Error al actualizar el turno.");
      changeInfo.revert();
    }
  };

  const handleLogout = () => {
    clearUserSession();
    navigate("/login");
  };

  return (
    <>
      <button
        className={`toggle-btn ${showPanel ? "open" : ""}`}
        onClick={() => setShowPanel(!showPanel)}
      >
        {showPanel ? "Cerrar Turnos" : "Ver Turnos"}
      </button>

      <div className={`right-container ${showPanel ? "open" : ""}`}>
        <h2>Mis Turnos</h2>

        {events.length === 0 ? (
          <p>No tienes turnos asignados aún.</p>
        ) : (
          <ul className="turnos-lista">
            {events.map((ev) => (
              <li key={ev.id}>
                <strong>{ev.title}</strong>
                <br />
                {new Date(ev.start).toLocaleString("es-CL")}
              </li>
            ))}
          </ul>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <main>
        <div className="cal-box">
          <div className="calendario">
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              locale={esLocale}
              timeZone="local"
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                list: "Lista",
              }}
              firstDay={1}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              editable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventChange={handleEventChange}
              events={events}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: "09:00",
                endTime: "18:00",
              }}
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              aspectRatio={1.35}
              height="auto"
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Calendario;
