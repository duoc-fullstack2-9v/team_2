import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Nav from "../components/Nav";
import Footer from "../components/Footer";



function Calendario() {
  const calendarRef = useRef(null);

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
    <>
      <Nav></Nav>
        <main>
          <div className="calendario" style={{minHeight: "70vh"}}>
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
            />
          </div>
        </main>
      <Footer></Footer>
    </>
  );
}
export default Calendario;
