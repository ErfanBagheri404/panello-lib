import spark from "../assets/Sidebar/Sparkling.svg";
import grid from "../assets/Grid.svg";
import HomeTasks from "../components/HomeTasks";
import HomeReminder from "../components/HomeReminder";
import HomeIncome from "../components/HomeIncome";
import HomeCalendar from "../components/HomeCalendar";
import HomeGraph from "../components/HomeGraph";

const Dashboard = () => {
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
    <main className="relative border border-black/30 h-screen my-2.5 rounded-2xl overflow-auto">
      {/* Background Grid Wrapper */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt=""
        />
      </div>

      <div className="relative p-6">
        <p>{formatDate()}</p>

        <h1 className="text-3xl font-semibold mt-4 z-10">
          Welcome Back, Erfan
        </h1>
        <div className="flex gap-6 z-10">
          <p className="dashboard-home text-3xl font-semibold">
            What can I do for you today?
          </p>
          <button
            className="flex items-center gap-3 p-2 px-5 text-white rounded-full"
            style={{
              background:
                "linear-gradient(100deg, #7D71E2 -4.65%, #FFF 132.16%)",
            }}
          >
            <img src={spark} alt="" />
            <p>Ask a Question</p>
          </button>
          <button className="p-2 px-5 bg-white border-2 border-[#2CD9BF] rounded-full">
            Create a new task
          </button>
          <button className="p-2 px-5 bg-white border-2 border-[#2CD9BF] rounded-full">
            Manage Members
          </button>
        </div>
        <div className="flex mt-10 gap-5">
          <div className="flex flex-col w-1/2 gap-5">
            <HomeTasks></HomeTasks>
            <HomeIncome></HomeIncome>
            <HomeGraph></HomeGraph>
          </div>
          <div className="flex flex-col w-1/2 gap-5">
            <HomeReminder></HomeReminder>
            <HomeCalendar></HomeCalendar>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
