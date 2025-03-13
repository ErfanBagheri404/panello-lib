import spark from "../assets/Sidebar/Sparkling.svg";
import grid from "../assets/Grid.svg";
import HomeTasks from "../components/Home Widgets/HomeTasks";
import HomeReminder from "../components/Home Widgets/HomeReminder";
import HomeIncome from "../components/Home Widgets/HomeIncome";
import HomeCalendar from "../components/Home Widgets/HomeCalendar";
import HomeGraph from "../components/Home Widgets/HomeGraph";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../components/theme-provider";

const Dashboard = () => {
  const navigate = useNavigate();
  const [, setSelectedItem] = useState<string>("");
  const { theme } = useTheme();

  const handleClick = (path: string) => {
    setSelectedItem(path);
    navigate(path);
  };

  const formatDate = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  };

  return (
    <main
      className={`relative border  h-screen mt-2.5 rounded-2xl overflow-auto scrollbar-hide ${
        theme === "dark" ? "border-white/30" : "border-black/30"
      } transition-all duration-300 `}
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
      <div className="relative p-6">
        <p className={theme === "dark" ? "text-white" : "text-black"}>
          {formatDate()}
        </p>
        <h1
          className={`text-3xl lg:text-3xl md:text-3xl sm:text-2xl font-semibold mt-4 z-10 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Welcome Back, Erfan
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 z-10">
          <p
            className={`dashboard-home text-3xl lg:text-3xl md:text-3xl sm:text-2xl font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            What can I do for you today?
          </p>
          <button
            onClick={() => handleClick("/ai")}
            className="flex justify-center items-center gap-3 p-2 px-5 text-white rounded-full hover:cursor-pointer"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(100deg, #4B0082, #00BFFF)"
                  : "linear-gradient(100deg, #7D71E2 -4.65%, #FFF 132.16%)",
            }}
          >
            <img
              src={spark}
              alt=""
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <p className="text-white">Ask a Question</p>
          </button>
          <button
            className={`p-2 px-5 rounded-full hover:cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 text-white border-2 border-[#2CD9BF] hover:bg-gray-700"
                : "bg-white text-black border-2 border-[#2CD9BF] hover:bg-gray-100"
            }`}
            onClick={() => handleClick("/")}
          >
            Create a new task
          </button>
          <button
            className={`p-2 px-5 rounded-full hover:cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 text-white border-2 border-[#2CD9BF] hover:bg-gray-700"
                : "bg-white text-black border-2 border-[#2CD9BF] hover:bg-gray-100"
            }`}
            onClick={() => handleClick("/members")}
          >
            Manage Members
          </button>
        </div>
        <div className="flex flex-col lg:flex-row mt-10 gap-5">
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            <HomeTasks />
            <HomeIncome />
            <HomeGraph />
          </div>
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            <HomeReminder />
            <HomeCalendar />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
