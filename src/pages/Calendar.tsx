import grid from "../assets/Grid.svg";
import { CiFilter } from "react-icons/ci";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";

const Calendar = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const events = [{ title: "Client Meeting", start: new Date() }];
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

  return (
    <main className="relative border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt=""
        />
      </div>
      <div className="flex items-center justify-between z-10">
        <div className="flex gap-5 items-center">
          <p className="font-medium text-xl">{formatDate()}</p>
          <button
            onClick={() => handleNav("today")}
            className="bg-black px-3 py-1 rounded-md text-white"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-5">
          <div className="rounded-md border border-black/30 overflow-hidden bg-gray-200">
            <button className="px-3 py-1">Day</button>
            <button className="px-3 py-1 bg-white rounded-md">Week</button>
            <button className="px-3 py-1">Month</button>
          </div>
          <button className="flex items-center text-lg gap-2 border border-black/30 rounded-md px-3 py-0.5 bg-white">
            <CiFilter />
            Filter
          </button>
          <button className="flex items-center text-lg gap-2 border border-black/30 rounded-md p-1.5 bg-white">
            <HiDotsHorizontal />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-black/30 w-full h-screen z-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 flex gap-1 z-20">
          <button
            onClick={() => handleNav("prev")}
            className=" p-1.5 hover:bg-gray-100"
          >
            <IoChevronBack />
          </button>
          <button
            onClick={() => handleNav("next")}
            className=" p-1.5 hover:bg-gray-100"
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
          headerToolbar={false}
        />
      </div>
    </main>
  );
};

export default Calendar;
