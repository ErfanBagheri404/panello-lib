import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CiFilter } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import grid from "../assets/Grid.svg";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  id: string;
}


const formatTime = (date: Date | null): string => {
  if (!date) return "Unknown time";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes}${period}`;
};
const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  excludedRef: React.RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !excludedRef.current?.contains(target)
      ) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, excludedRef, callback]);
};


const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : hex;
};

const Calendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("timeGridWeek");
  const [showFilter, setShowFilter] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const filterPopupRef = useRef<HTMLDivElement>(null);
  const optionsPopupRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const optionsButtonRef = useRef<HTMLButtonElement>(null);

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(Date.now() + 604800000),
  });
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Client Meeting Planning",
      start: new Date("2025-02-21T14:23:46"),
      end: new Date("2025-02-21T15:53:46"),
      color: getRandomColor(),
    },
    {
      id: "2",
      title: "Team Sync",
      start: new Date("2025-02-21T16:23:46"),
      end: new Date("2025-02-21T17:23:46"),
      color: getRandomColor(),
    },
    {
      id: "3",
      title: "Project Review",
      start: new Date("2025-02-22T22:23:46"),
      end: new Date("2025-02-22T23:53:46"),
      color: getRandomColor(),
    },
  ]);

  // View handling
  const handleViewChange = (newView: typeof view) => {
    setView(newView);
    calendarRef.current?.getApi().changeView(newView);
  };

  // Filter functionality
  const handleFilterApply = (start: Date, end: Date) => {
    setDateRange({ start, end });
    setShowFilter(false);
  };

  // Event management
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

  // Animation variants
  const popupVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  useClickOutside(filterPopupRef, filterButtonRef, () => {
    if (showFilter) setShowFilter(false);
  });

  useClickOutside(optionsPopupRef, optionsButtonRef, () => {
    if (showOptions) setShowOptions(false);
  });


  const FilterPopup = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      ref={filterPopupRef}
      variants={popupVariants}
      className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-[100] border"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Start Date:
          <input
            type="date"
            value={dateRange.start.toISOString().split("T")[0]}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                start: new Date(e.target.value),
              }))
            }
            className="ml-2 border rounded p-1"
          />
        </label>
        <label className="text-sm font-medium">
          End Date:
          <input
            type="date"
            value={dateRange.end.toISOString().split("T")[0]}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                end: new Date(e.target.value),
              }))
            }
            className="ml-2 border rounded p-1"
          />
        </label>
        <button
          onClick={() => handleFilterApply(dateRange.start, dateRange.end)}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </motion.div>
  );

  const OptionsPopup = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      ref={optionsPopupRef}
      variants={popupVariants}
      className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-[100] border"
    >
      <div className="flex flex-col gap-2">
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 text-sm hover:bg-gray-100 rounded text-left text-nowrap"
        >
          Add Event
        </button>
        <button
          onClick={handleDeleteEvent}
          className="px-4 py-2 text-sm hover:bg-gray-100 rounded text-left text-nowrap"
        >
          Remove Event
        </button>
      </div>
    </motion.div>
  );
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

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5 w-full">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
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
          <div className="rounded-md border w-full lg:w-fit border-black/30 overflow-hidden bg-gray-200 text-center my-2 lg:my-0">
            <button
              onClick={() => handleViewChange("timeGridDay")}
              className={`px-3 py-1 ${
                view === "timeGridDay" ? "bg-white rounded-md" : ""
              }`}
            >
              Day
            </button>
            <button
              onClick={() => handleViewChange("timeGridWeek")}
              className={`px-3 py-1 ${
                view === "timeGridWeek" ? "bg-white rounded-md" : ""
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange("dayGridMonth")}
              className={`px-3 py-1 ${
                view === "dayGridMonth" ? "bg-white rounded-md" : ""
              }`}
            >
              Month
            </button>
          </div>

          <div className="flex w-full lg:w-fit gap-2 lg:gap-5">
            <div className="relative z-10">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center text-lg gap-2 border border-black/30 rounded-md px-3 py-0.5 bg-white w-full justify-center"
              >
                <CiFilter />
                Filter
              </button>
              <AnimatePresence>{showFilter && <FilterPopup />}</AnimatePresence>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center text-lg gap-2 border border-black/30 rounded-md p-1.5 bg-white"
              >
                <HiDotsHorizontal />
              </button>
              <AnimatePresence>
                {showOptions && <OptionsPopup />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar component */}
      <div className="relative bg-white rounded-xl border border-black/30 w-full h-screen z-5 lg:overflow-hidden overflow-x-auto">
        <div className="absolute top-0 lg:top-0 lg:left-0 flex gap-2 z-10">
          <button
            onClick={() => handleNav("prev")}
            className=" py-1.5 px-0.75 "
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => handleNav("next")}
            className=" py-1.5 px-0.75 "
          >
            <IoChevronForward />
          </button>
        </div>

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
          validRange={{
            start: dateRange.start,
            end: dateRange.end,
          }}
          eventContent={(arg) => {
            const { event } = arg;
            return (
              <div
                style={{
                  color: "#fff",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  opacity: 1,
                  borderBottomColor: "1px dashed",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    backgroundColor: event.extendedProps.color,
                    borderBottom: "1px dashed black",
                    padding: "5px",
                  }}
                >
                  {formatTime(event.start ? new Date(event.start) : null)} -{" "}
                  {formatTime(event.end ? new Date(event.end) : null)}
                </span>

                <div
                  style={{
                    fontSize: "12px",
                    padding: "5px",
                    paddingTop: "1px",
                    backgroundColor: hexToRgba(event.extendedProps.color, 0.3),
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{event.title}</div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </main>
  );
};

export default Calendar;
