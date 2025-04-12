import { useState, useEffect } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import TaskManagerModal from "../../features/TaskManagerModal";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider";
import { useTasks } from "../hooks/useTasks";
import { ITask } from "../../types";
import translations from "../../data/translations";
// We're still using axios for the TaskManagerModal, so keep this import
import axios from "axios";

const HomeTasks = () => {
  const { language } = useLanguage();
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const { theme } = useTheme();
  // This state is used by TaskManagerModal, so we'll keep it
  const [users, setUsers] = useState<any[]>([]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get current user
        const currentUserResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUserId = currentUserResponse.data._id;

        // Get all users
        const response = await axios.get("/api/users/members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out current user from the list
        const filteredUsers = response.data.filter(
          (user: any) => user.id !== currentUserId
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleTaskSubmit = async (taskData: any) => {
    try {
      // Ensure assignedTo data is properly formatted
      const formattedTaskData = {
        ...taskData,
        assignedTo: Array.isArray(taskData.assignedTo)
          ? taskData.assignedTo
          : [],
      };

      if (selectedTask) {
        await updateTask(selectedTask._id, formattedTaskData);
      } else {
        await createTask(formattedTaskData);
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      // Get the task to be deleted
      const taskToDelete = tasks.find((task) => task._id === id);

      if (!taskToDelete) {
        console.error("Task not found");
        return;
      }

      // Get current user ID
      const token = localStorage.getItem("token");
      const currentUserResponse = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUserId = currentUserResponse.data._id;

      // Check if current user is the creator of the task
      if (taskToDelete.user !== currentUserId) {
        // Get creator's name
        const usersResponse = await axios.get("/api/users/members", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const creator = usersResponse.data.find(
          (user: any) => user.id === taskToDelete.user
        );
        const creatorName = creator
          ? creator.name || creator.username || "the creator"
          : "the creator";

        alert(`Only ${creatorName} can delete this task.`);
        return;
      }

      await deleteTask(id);
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      className={`p-5 transition-all duration-300 rounded-xl border ${
        theme === "dark"
          ? "border-white/30 bg-black"
          : "border-black/30 bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <MdOutlineTaskAlt className="text-green-500" />
        {translations[language].myTasks}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl">
            <span className="text-xl font-bold">+</span>
          </div>
          <p className="font-medium text-md">
            {translations[language].addNewTask}
          </p>
        </div>
        {tasks.map((task) => (
          <div className="flex items-center gap-3" key={task._id}>
            <div
              className="w-12 h-12 rounded-xl hover:cursor-pointer"
              onClick={() => {
                setSelectedTask(task);
                setIsModalOpen(true);
              }}
              style={{
                background: `linear-gradient(55deg, ${task.color} -25.4%, #000 137.29%)`,
              }}
            />
            <div>
              <p
                className="font-medium text-md hover:cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  setIsModalOpen(true);
                }}
              >
                {task.title}
              </p>
              <p className="text-sm text-gray-500">
                {task.subtasks.length} {translations[language].tasks} •
                {task.assignedTo && task.assignedTo.length > 0
                  ? ` ${task.assignedTo.length} `
                  : " 0 "}
                {translations[language].members}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <TaskManagerModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onSubmit={handleTaskSubmit}
          onDelete={handleDeleteTask}
          availableUsers={users} // Pass the users to TaskManagerModal
        />
      )}
    </div>
  );
};

export default HomeTasks;
