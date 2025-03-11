import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CiFilter } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import grid from "../assets/Grid.svg";
import {
  CalendarEvent,
  formatTime,
  getRandomColor,
  hexToRgba,
  useClickOutside,
} from "../components/Calendar/helpers";
import { FilterPopup } from "../components/Calendar/FilterPopup";
import { OptionsPopup } from "../components/Calendar/OptionsPopup";
import { CalendarControls } from "../components/Calendar/CalendarControls";
import { ViewSwitcher } from "../components/Calendar/ViewSwitcher";
import { useTheme } from "../components/theme-provider";

export const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("timeGridWeek");  const { theme } = useTheme();

  const filterPopupRef = useRef<HTMLDivElement>(null);
  const optionsPopupRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);

  const [openPopup, setOpenPopup] = useState<"filter" | "options" | null>(null);

  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(Date.now() + 604800000),
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useClickOutside(filterPopupRef, filterButtonRef, () => {
    if (openPopup === "filter") setOpenPopup(null);
  });

  useClickOutside(optionsPopupRef, optionsButtonRef, () => {
    if (openPopup === "options") setOpenPopup(null);
  });

  const handleViewChange = (newView: typeof view) => {
    setView(newView);
    calendarRef.current?.getApi().changeView(newView);
  };

  const handleFilterApply = (start: Date, end: Date) => {
    setDateRange({ start, end });
    setOpenPopup(null);
  };

  const handleAddEvent = () => {
    const newEvent: CalendarEvent = {
      id: String(Date.now()),
      title: "New Event",
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      color: getRandomColor(),
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = () => {
    if (events.length > 0) {
      setEvents(events.slice(0, -1));
    }
  };

  const handleNav = (direction: "prev" | "next" | "today") => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (direction === "prev") calendarApi.prev();
      if (direction === "next") calendarApi.next();
      if (direction === "today") calendarApi.today();
    }
  };

  const formatDate = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const togglePopup = (popup: "filter" | "options") => {
    setOpenPopup((prev) => (prev === popup ? null : popup));
  };

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5 w-full">
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert  " : ""
          }`}
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>

      <div className="flex lg:flex-row flex-col items-center justify-between z-10">
        <div className="flex gap-5 items-center w-full justify-between lg:w-fit">
          <p className="font-medium text-xl">{formatDate()}</p>
          <button
            onClick={() => handleNav("today")}
            className="bg-black px-3 py-1 rounded-md text-white"
          >
            Today
          </button>
        </div>

        <div className="flex lg:flex-row flex-col items-center lg:gap-5 w-full lg:w-fit">
          <ViewSwitcher currentView={view} onChange={handleViewChange} />

          <div className="flex w-full lg:w-fit gap-2 lg:gap-5">
            {/* Filter Button & Popup */}
            <div className="relative z-10 w-full lg:w-fit">
              <button
                ref={filterButtonRef}
                onClick={() => togglePopup("filter")}
                className="flex items-center text-lg gap-2 border border-black/30 rounded-md px-3 py-0.5 bg-white w-full justify-center"
              >
                <CiFilter />
                Filter
              </button>
              <AnimatePresence>
                {openPopup === "filter" && (
                  <FilterPopup
                    dateRange={dateRange}
                    onApply={handleFilterApply}
                    onClose={() => setOpenPopup(null)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Options Button & Popup */}
            <div className="relative z-10">
              <button
                ref={optionsButtonRef}
                onClick={() => togglePopup("options")}
                className="flex items-center text-lg gap-2 border border-black/30 rounded-md p-1.5 bg-white"
              >
                <HiDotsHorizontal />
              </button>
              <AnimatePresence>
                {openPopup === "options" && (
                  <OptionsPopup
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white rounded-xl border border-black/30 w-full h-screen z-5 lg:overflow-hidden overflow-x-auto">
        <CalendarControls onNavigate={handleNav} />
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          editable={true}
          selectable={true}
          events={events}
          height="100%"
          allDaySlot={false}
          headerToolbar={false}
          eventMinHeight={20}
          validRange={{ start: dateRange.start, end: dateRange.end }}
          eventContent={(arg) => (
            <div
              style={{
                color: "#fff",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                borderBottomColor: "1px dashed",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  backgroundColor: arg.event.extendedProps.color,
                  borderBottom: "1px dashed black",
                  padding: "5px",
                }}
              >
                {formatTime(arg.event.start)} - {formatTime(arg.event.end)}
              </span>
              <div
                style={{
                  fontSize: "12px",
                  padding: "5px",
                  paddingTop: "1px",
                  backgroundColor: hexToRgba(arg.event.extendedProps.color, 0.3),
                }}
              >
                <div style={{ fontWeight: "bold" }}>{arg.event.title}</div>
              </div>
            </div>
          )}
        />
      </div>
    </main>
  );
};

export default Calendar;
