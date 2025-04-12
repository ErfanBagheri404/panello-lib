import spark from "../assets/Sidebar/Sparkling.svg";
import grid from "../assets/Grid.svg";
import HomeTasks from "../components/Home Widgets/HomeTasks";
import HomeReminder from "../components/Home Widgets/HomeReminder";
import HomeIncome from "../components/Home Widgets/HomeIncome";
import HomeCalendar from "../components/Home Widgets/HomeCalendar";
// import HomeGraph from "../components/Home Widgets/HomeGraph";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../components/theme-provider";
import { useLanguage } from "../components/language-provider";
import TaskManagerModal from "../features/TaskManagerModal";
import translations from "../data/translations";
import { ITask } from "../types"; // Import ITask interface
import { useTasks } from "../components/hooks/useTasks";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [, setSelectedItem] = useState<string>("");
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const { createTask, refreshTasks: fetchTasks } = useTasks(); // Use refreshTasks as fetchTasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLoadingUsers] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = localStorage.getItem("token");
        
        // Get current user
        const currentUserResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const currentUserId = currentUserResponse.data._id;
        
        // Get all users
        const response = await axios.get("/api/users/members", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter out current user from the list
        const filteredUsers = response.data.filter(
          (user: any) => user.id !== currentUserId
        );
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleClick = (path: string) => {
    setSelectedItem(path);
    navigate(path);
  };

  const formatDate = () => {
    const now = new Date();
    return `${translations[language].days[now.getDay()]}, ${
      translations[language].months[now.getMonth()]
    } ${now.getDate()}`;
  };

  // Implement proper task submission handler
  const handleTaskSubmit = async (taskData: Partial<ITask>): Promise<void> => {
    try {
      // Ensure all required fields are present and properly formatted
      const formattedTaskData = {
        title: taskData.title || "New Task", // Provide default title if undefined
        subtasks: taskData.subtasks || [],
        color: taskData.color, // Remove default color to use the one from TaskManagerModal
        completed: taskData.completed || false,
        assignedTo: Array.isArray(taskData.assignedTo) ? taskData.assignedTo : []
      };
      
      await createTask({
        ...formattedTaskData,
        color: formattedTaskData.color || '#000000' // Ensure color is never undefined
      });
      
      // Fetch tasks after creating a new one to refresh the list
      await fetchTasks();
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <main
      className={`relative border  h-screen mt-2.5 rounded-2xl overflow-auto scrollbar-hide ${
        theme === "dark"
          ? "border-white/30 bg-black"
          : "border-black/30 bg-white"
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
          {translations[language].welcome}
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 z-10">
          <p
            className={`dashboard-home text-3xl lg:text-3xl md:text-3xl sm:text-2xl font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {translations[language].questionPrompt}
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
            <p className="text-white">{translations[language].askQuestion}</p>
          </button>
          <button
            className={`p-2 px-5 rounded-full hover:cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 text-white border-2 border-[#2CD9BF] hover:bg-gray-700"
                : "bg-white text-black border-2 border-[#2CD9BF] hover:bg-gray-100"
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            {translations[language].createTask}
          </button>
          <button
            className={`p-2 px-5 rounded-full hover:cursor-pointer ${
              theme === "dark"
                ? "bg-gray-800 text-white border-2 border-[#2CD9BF] hover:bg-gray-700"
                : "bg-white text-black border-2 border-[#2CD9BF] hover:bg-gray-100"
            }`}
            onClick={() => handleClick("/members")}
          >
            {translations[language].manageMembers}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row mt-10 gap-5">
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            <HomeTasks />
            <HomeIncome />
            {/* <HomeGraph /> */}
            <div>New widgets on their way...</div>
          </div>
          <div className="flex flex-col w-full lg:w-1/2 gap-5">
            <HomeReminder />
            <HomeCalendar />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TaskManagerModal
          onClose={() => setIsModalOpen(false)}
          task={null}
          onSubmit={handleTaskSubmit}
          availableUsers={users}
        />
      )}
    </main>
  );
};

export default Dashboard;
