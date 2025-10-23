import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";





function Calendario() {
  const calendarRef = useRef(null);
  const navigate = useNavigate();


  const [showPanel, setShowPanel] = useState(false);
  // Turnos de ejemplo
  const [events, setEvents] = useState([
    { id: "1", title: "Turno", start: "2025-10-12T09:00:00", end: "2025-10-12T13:00:00" },
    { id: "2", title: "Turno", start: "2025-10-14" } // evento día completo
  ]);

  // Crea evento seleccionando en el calendarios
  const handleDateSelect = (selectInfo) => {
    const title = prompt("Título del evento:");
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const nuevoEvento = {
        id: String(Date.now()),
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay
      };
      setEvents((prev) => [...prev, nuevoEvento]);
    }
  };

  // Clic en evento (ej: eliminar o renombrar)
  const handleEventClick = (clickInfo) => {
    const accion = prompt(`Editar título o escribe "DEL" para borrar:\nActual: ${clickInfo.event.title}`);
    if (accion === null) return;

    if (accion?.toUpperCase() === "DEL") {
      clickInfo.event.remove();
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
    } else if (accion.trim() !== "") {
      clickInfo.event.setProp("title", accion.trim());
      setEvents((prev) =>
        prev.map((e) => (e.id === clickInfo.event.id ? { ...e, title: accion.trim() } : e))
      );
    }
  };

  // Arrastrar, soltar o redimensionar eventos
  const handleEventChange = (changeInfo) => {
    const ev = changeInfo.event;
  };

return (
  <>{/* Botón para abrir/cerrar el panel */}
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
          {new Date(ev.start).toLocaleDateString("es-CL", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {ev.end && (
            <> — {new Date(ev.end).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}</>
          )}
        </li>
      ))}
    </ul>
  )}

  {/* 👇 Botón al final */}
  <button
    className="logout-btn"
    onClick={() => navigate("/login")}
  >
    Cerrar sesión
  </button>
</div>
      <main>
        <div className="cal-box">

        <div className="calendario" >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              locale={esLocale}
              timeZone="local"
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                list: "Lista"
              }}
              firstDay={1}               // semana comienza el lunes
              selectable={true}          // permite seleccionar rangos para crear
              selectMirror={true}
              dayMaxEvents={true}        // agrega "más +" si hay muchos eventos
              editable={true}            // arrastrar/soltar y redimensionar
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventChange={handleEventChange}
              events={events}
              // Opcional: horarios laborales y slots
              businessHours={{ daysOfWeek: [1,2,3,4,5], startTime: "09:00", endTime: "18:00" }}
              slotMinTime="08:00:00"
              slotMaxTime="21:00:00"
              
    /*  Hacen que no se “estire” verticalmente */
    aspectRatio={1.35}         // tamaño “normal” de FullCalendar
    height="auto"              // evita ocupar toda la altura
    expandRows={false}         // no fuerza filas extra
    contentHeight="auto"
  />
</div>
            
          </div>
        </main>
      <Footer></Footer>
    </>
  );
}
export default Calendario;
