import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
} from "react-icons/fa";

const HomeCalendar = () => {
  // Generate dates dynamically
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(
    new Date(today.setDate(today.getDate() - 3))
  ); // Start 3 days before today

  // Dummy event data (replace with API data)
  const events = [
    {
      date: today.toDateString(),
      title: "Meeting with VP",
      time: "10:30 - 11:30 am",
      platform: "Google Meet",
      attendees: [
        "/avatars/user1.jpg",
        "/avatars/user2.jpg",
        "/avatars/user3.jpg",
      ],
      extraCount: 2,
    },
  ];

  // Function to get 7 days dynamically (centered around selectedDate)
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
    <div className="border border-black/30 rounded-xl p-5 w-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center text-lg font-semibold">
          
          <FaRegCalendarAlt className="text-purple-500 mr-2" /> Calendar
        </h2>
        <div className="flex items-center space-x-1">
          <span className="text-gray-700">
            {selectedDate.toLocaleString("en-US", { month: "long" })}
          </span>
          <FaChevronRight className="text-gray-500 cursor-pointer" />
        </div>
      </div>

      {/* Date Selector (7 days) */}
      <div className="flex items-center justify-between mb-4">
        <FaChevronLeft
          className="text-gray-500 cursor-pointer"
          onClick={() => shiftDates("prev")}
        />
        <div className="flex space-x-2">
          {getNextDays().map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateChange(date)}
              className={`p-2 w-12 text-center rounded-lg ${
                selectedDate.toDateString() === date.toDateString()
                  ? "bg-purple-500 text-white"
                  : "text-gray-500"
              }`}
            >
              <div className="text-xs">
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

      {/* Event Details */}
      {events
        .filter((event) => event.date === selectedDate.toDateString())
        .map((event, index) => (
          <div key={index} className="p-4 bg-purple-100 rounded-lg">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500">Today • {event.time}</p>
            <div className="flex items-center mt-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Google_Meet_icon_%282020%29.svg"
                alt="Google Meet"
                className="w-6 h-6 mr-2"
              />
              <span className="text-sm font-medium">{event.platform}</span>
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
