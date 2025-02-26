import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CiFilter } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import grid from "../assets/Grid.svg";

// Random color generator
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to format time in 12-hour format (e.g., 10am)
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes}${period}`;
};

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);

  const events = [
    {
      title: "Client Meeting Planning",
      start: new Date("2025-02-21T14:23:46"), // Starts 1 hour from now
      end: new Date("2025-02-21T15:53:46"), // Ends 2.5 hours from now
      color: getRandomColor(),
    },
    {
      title: "Team Sync",
      start: new Date("2025-02-21T16:23:46"), // Starts 3 hours from now
      end: new Date("2025-02-21T17:23:46"), // Ends 4 hours from now
      color: getRandomColor(),
    },
    {
      title: "Project Review",
      start: new Date("2025-02-22T22:23:46"), // Starts 9 AM tomorrow
      end: new Date("2025-02-22T23:53:46"), // Ends 10:30 AM tomorrow
      color: getRandomColor(),
    },
  ];

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

  const handleNav = (direction: "prev" | "next" | "today") => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (direction === "prev") calendarApi.prev();
      if (direction === "next") calendarApi.next();
      if (direction === "today") calendarApi.today();
    }
  };
  // Helper function to convert hex color to rgba
  const hexToRgba = (hex: string, opacity: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(
          result[2],
          16
        )}, ${parseInt(result[3], 16)}, ${opacity})`
      : hex;
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
            <button className="px-3 py-1">Day</button>
            <button className="px-3 py-1 bg-white rounded-md">Week</button>
            <button className="px-3 py-1">Month</button>
          </div>
          <div className="flex w-full lg:w-fit gap-2 lg:gap-5">
            <button className="flex items-center text-lg gap-2 border border-black/30 rounded-md px-3 py-0.5 bg-white w-full justify-center">
              <CiFilter />
              Filter
            </button>
            <button className="flex items-center text-lg gap-2 border border-black/30 rounded-md p-1.5 bg-white">
              <HiDotsHorizontal />
            </button>
          </div>
        </div>
      </div>
      <div className="relative bg-white rounded-xl border border-black/30 w-full h-screen z-10 lg:overflow-hidden overflow-x-auto">
        <div className="absolute top-0 lg:top-0 lg:left-0 flex gap-2 z-20">
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
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          events={events}
          height="100%"
          allDaySlot={false}
          headerToolbar={false}
          eventMinHeight={20}
          eventContent={(arg) => {
            const { event } = arg;
            const startTime = event.start
              ? formatTime(event.start)
              : "Unknown start time";
            const endTime = event.end
              ? formatTime(event.end)
              : "Unknown end time";
            const backgroundColor = event.extendedProps.color;
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
                {/* Top part with start/end time */}
                <span
                  style={{
                    fontSize: "10px",
                    backgroundColor: backgroundColor, // Full opacity for the first part
                    borderBottom: "1px dashed black",
                    padding: "5px",
                  }}
                >
                  {startTime} - {endTime}
                </span>

                {/* Bottom part with title and lowered opacity */}
                <div
                  style={{
                    fontSize: "12px",
                    padding: "5px",
                    paddingTop: "1px",
                    backgroundColor: hexToRgba(backgroundColor, 0.3),
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
