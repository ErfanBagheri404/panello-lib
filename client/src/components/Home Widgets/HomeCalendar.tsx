import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "../theme-provider";
import axios from "axios";
import { useLanguage } from "../language-provider"; // Added import
import translations from "../../data/translations";
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color: string;
}

const HomeCalendar = () => {
  const { language } = useLanguage(); // Added useLanguage hook
  const { theme } = useTheme();
  const today = new Date();
  // Set initial start date to 3 days before today to center current day
  const initialStartDate = new Date(today);
  initialStartDate.setDate(today.getDate() - 3);

  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // The backend should now return both created and shared events
        const formattedEvents = response.data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          date: new Date(event.start).toDateString(),
        }));

        setEvents(formattedEvents);
      } catch (err) {
        setError("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  const getNextDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const shiftDates = (direction: "prev" | "next") => {
    const newStartDate = new Date(startDate);
    const dayOffset = direction === "next" ? 1 : -1;
    newStartDate.setDate(startDate.getDate() + dayOffset);

    // Update selected date to maintain center position
    const newSelectedDate = new Date(newStartDate);
    newSelectedDate.setDate(newStartDate.getDate() + 3);

    setStartDate(newStartDate);
    setSelectedDate(newSelectedDate);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get the 7-day window
  const weekDays = getNextDays();

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 w-full border  ${
        theme === "dark"
          ? "border-white/30 bg-black text-white"
          : "border-black/30 bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center text-lg sm:text-xl font-semibold">
          <FaRegCalendarAlt
            className={`text-purple-500 ${language === "fa" ? "ml-2" : "mr-2"}`}
          />
          {translations[language].calendar}
        </h2>
        <div className="flex items-center space-x-1">
          <span className="text-gray-700 text-sm sm:text-base">
            {translations[language].months[selectedDate.getMonth()]}{" "}
          </span>
          <FaChevronRight
            className={`text-gray-500 cursor-pointer transition-transform ${
              language === "fa" ? "rotate-180" : ""
            }`}
            onClick={() => shiftDates("next")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 scrollbar-hide">
        <FaChevronLeft
          className={`text-gray-500 cursor-pointer transition-transform ${
            language === "fa" ? "rotate-180" : ""
          }`}
          onClick={() => shiftDates("prev")}
        />

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {weekDays.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateChange(date)}
              className={`p-2 w-12 sm:w-14 text-center rounded-lg transition-colors ${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-purple-500 text-white"
                  : "text-gray-500 hover:bg-purple-100 dark:hover:bg-purple-200"
              }`}
            >
              <div className="text-xs sm:text-sm">
                {translations[language].days[date.getDay()]}
              </div>
              <div className="font-semibold">{date.getDate()}</div>
            </button>
          ))}
        </div>
        <FaChevronRight
          className={`text-gray-500 cursor-pointer transition-transform ${
            language === "fa" ? "rotate-180" : ""
          }`}
          onClick={() => shiftDates("next")}
        />
      </div>

      {events
        .filter(
          (event) =>
            new Date(event.start).toDateString() === selectedDate.toDateString()
        )
        .map((event) => (
          <div
            key={event.id}
            className={`p-4 mb-3 ${
              theme === "dark" ? "bg-purple-900" : "bg-purple-200"
            } rounded-lg `}
          >
            <h3 className="font-semibold text-sm sm:text-base">
              {event.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {formatTime(event.start)} - {formatTime(event.end)}
            </p>
            {event.description && (
              <p className="text-xs sm:text-sm mt-2 text-gray-600">
                {event.description}
              </p>
            )}
          </div>
        ))}

      {events.filter(
        (event) =>
          new Date(event.start).toDateString() === selectedDate.toDateString()
      ).length === 0 && (
        <div
          className={`p-4 text-center  ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {translations[language].noEventsMessage}
        </div>
      )}
    </div>
  );
};

export default HomeCalendar;
