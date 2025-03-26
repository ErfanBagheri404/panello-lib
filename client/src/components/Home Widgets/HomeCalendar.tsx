import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "../theme-provider"; 

const HomeCalendar = () => {
  const { theme } = useTheme(); 
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(
    new Date(today.setDate(today.getDate() - 3))
  );

  const events = [
    {
      date: today.toDateString(),
      title: "Meeting with VP",
      time: "10:30 - 11:30 am",
      platform: "Google Meet",
      attendees: ["", "", ""],
      extraCount: 2,
    },
  ];

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
    newStartDate.setDate(startDate.getDate() + (direction === "next" ? 1 : -1));
    setStartDate(newStartDate);
  };

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 w-full border transition-all duration-300 ${
        theme === "dark"
          ? "border-white/30 bg-black text-white"
          : "border-black/30 bg-white text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center text-lg sm:text-xl font-semibold">
          <FaRegCalendarAlt className="text-purple-500 mr-2" /> Calendar
        </h2>
        <div className="flex items-center space-x-1">
          <span className="text-gray-700 text-sm sm:text-base">
            {selectedDate.toLocaleString("en-US", { month: "long" })}
          </span>
          <FaChevronRight className="text-gray-500 cursor-pointer" />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <FaChevronLeft
          className="text-gray-500 cursor-pointer"
          onClick={() => shiftDates("prev")}
        />
        <div className="flex space-x-2 overflow-x-auto">
          {getNextDays().map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateChange(date)}
              className={`p-2 w-12 sm:w-14 text-center rounded-lg ${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-purple-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <div className="text-xs sm:text-sm">
                {date.toLocaleString("en-US", { weekday: "short" })}
              </div>
              <div className="font-semibold">{date.getDate()}</div>
            </button>
          ))}
        </div>
        <FaChevronRight
          className="text-gray-500 cursor-pointer"
          onClick={() => shiftDates("next")}
        />
      </div>
      {events
        .filter((event) => event.date === selectedDate.toDateString())
        .map((event, index) => (
          <div
            key={index}
            className={`p-4 ${
              theme === "dark" ? "bg-purple-900" : "bg-purple-200"
            } rounded-lg`}
          >
            <h3 className="font-semibold text-sm sm:text-base">
              {event.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Today • {event.time}
            </p>
            <div className="flex items-center mt-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Google_Meet_icon_%282020%29.svg"
                alt="Google Meet"
                className="w-6 h-6 mr-2"
              />
              <span className="text-xs sm:text-sm font-medium">
                {event.platform}
              </span>
            </div>
            <div className="flex mt-3 -space-x-2">
              {event.attendees.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
              {event.extraCount > 0 && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-xs font-semibold border-2 border-white">
                  +{event.extraCount}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HomeCalendar;
