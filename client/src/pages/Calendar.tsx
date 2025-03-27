import { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import EventDetailsModal from "../features/EventDetailsModal";

export const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("timeGridWeek");
  const { theme } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [openPopup, setOpenPopup] = useState<"filter" | "options" | null>(null);
  const filterPopupRef = useRef<HTMLDivElement>(null);
  const optionsPopupRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
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
  const handleEditClick = (event: CalendarEvent) => {
    setOpenPopup("options");

    const eventToEdit = events.find((e) => e.id === event.id);
    if (eventToEdit) {
      setEvents(
        events.map((e) => (e.id === event.id ? { ...e, color: e.color } : e))
      );
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEvents(
          response.data.map((e: any) => ({
            ...e,
            id: e._id,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Update event handlers to use API
  const handleAddEvent = async (
    eventData: Omit<CalendarEvent, "id" | "color">
  ) => {
    try {
      const response = await axios.post(
        "/api/events",
        {
          ...eventData,
          color: getRandomColor(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setEvents([
        ...events,
        {
          ...response.data,
          id: response.data._id,
          start: new Date(response.data.start),
          end: new Date(response.data.end),
        },
      ]);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = async (updatedEvent: CalendarEvent) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/events/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(
        events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const togglePopup = (popup: "filter" | "options") => {
    setOpenPopup((prev) => (prev === popup ? null : popup));
  };

  return (
    <main
      className={`relative border h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5 w-full ${
        theme === "dark"
          ? "bg-black text-white border-white/30"
          : "bg-white text-black border-black/30"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert" : ""
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
            className={`${
              theme === "dark" ? "bg-blue-500" : "bg-black"
            } px-3 py-1 rounded-md text-white`}
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
                className={`flex items-center text-lg gap-2 border rounded-md px-3 py-0.5 w-full justify-center ${
                  theme === "dark"
                    ? "bg-gray-900 text-white border-white/30"
                    : "bg-white text-black border-black/30"
                }`}
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
                className={`flex items-center text-lg gap-2 border rounded-md p-1.5 ${
                  theme === "dark"
                    ? "bg-gray-900 text-white border-white/30"
                    : "bg-white text-black border-black/30"
                }`}
              >
                <HiDotsHorizontal />
              </button>
              <AnimatePresence>
                {openPopup === "options" && (
                  <OptionsPopup
                    events={events}
                    onAddEvent={handleAddEvent}
                    onEditEvent={handleEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onClose={() => setOpenPopup(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative rounded-xl border w-full h-screen z-5 lg:overflow-hidden overflow-x-auto ${
          theme === "dark"
            ? "bg-gray-900 border-white/30"
            : "bg-white border-black/30"
        }`}
      >
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
              className="rounded-lg p-0.5 m-1  cursor-pointer"
              style={{
                backgroundColor: hexToRgba(arg.event.extendedProps.color, 0.9),
                border: `1px solid ${arg.event.extendedProps.color}`,
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="text-xs font-semibold text-white/90">
                  {formatTime(arg.event.start)} - {formatTime(arg.event.end)}
                </div>
                <div className="text-sm font-bold truncate text-white">
                  {arg.event.title}
                </div>
              </div>
            </div>
          )}
          eventClick={(info) =>
            setSelectedEvent(info.event as unknown as CalendarEvent)
          }
        />
      </div>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => {
            setOpenPopup("options");
            handleEditClick(selectedEvent);
            setSelectedEvent(null);
          }}
          onDelete={() => {
            handleDeleteEvent(selectedEvent.id);
            setSelectedEvent(null);
          }}
        />
      )}
    </main>
  );
};

export default Calendar;
