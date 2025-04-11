import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { ITask } from "../types";
import translations from "../data/translations";
import { useLanguage } from "../components/language-provider";
import axios from "axios";

interface User {
  id: string;
  name: string;
  avatar: string;
}

// Update the props type
type TaskManagerModalProps = {
  onClose: () => void;
  task: ITask | null;
  onSubmit: (taskData: Partial<ITask>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  availableUsers?: User[]; // Add this prop
};

const TaskManagerModal = ({
  onClose,
  task,
  onSubmit,
  onDelete,
  availableUsers = [], // Default to empty array
}: TaskManagerModalProps) => {
  const { language } = useLanguage();
  const [title, setTitle] = useState(task?.title || "");
  const [subtasks, setSubtasks] = useState<string[]>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Add state for users
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    task?.assignedTo || []
  );
  const [loadingUsers, setLoadingUsers] = useState(false);

  const getRandomColor = () => {
    const colors = [
      "#4B00FF",
      "#FF5722",
      "#009688",
      "#E91E63",
      "#FFEB3B",
      "#3F51B5",
      "#00bcd4",
      "#4CAF50",
      "#9C27B0",
      "#FF9800",
      "#795548",
      "#607D8B",
      "#CDDC39",
      "#9E9E9E",
      "#FFECB3",
      "#B2EBF0",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Fetch users when component mounts
  // Modify the useEffect to use availableUsers if provided
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        // If availableUsers is provided and not empty, use it
        if (availableUsers && availableUsers.length > 0) {
          setUsers(availableUsers);
          setLoadingUsers(false);
          return;
        }

        // Otherwise fetch users as before
        const currentUserResponse = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const usersResponse = await axios.get("/api/users/members", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Filter out current user
        const usersList = usersResponse.data.filter(
          (user: any) => user.id !== currentUserResponse.data._id
        );

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [availableUsers]); // Add availableUsers as dependency

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) => {
      return prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask("");
    }
  };

  const handleDeleteSubtask = (subtask: string) => {
    setSubtasks(subtasks.filter((st) => st !== subtask));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const taskData: Partial<ITask> = {
      title,
      subtasks,
      color: task?.color || getRandomColor(),
      assignedTo: selectedUserIds, // This is correct
    };
    await onSubmit(taskData);
    onClose();
  };

  const handleDelete = async () => {
    if (task && onDelete) {
      await onDelete(task._id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl w-[90%] max-w-2xl shadow-2xl relative overflow-hidden"
      >
        <button
          className={`absolute top-3 text-2xl text-gray-700 dark:text-gray-300 hover:text-red-500 transition ${
            language === "fa" ? "left-3" : "right-3"
          }`}
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">
          {task
            ? translations[language].editTask
            : translations[language].newTask}
        </h2>

        <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
          <input
            type="text"
            className="w-full p-2 mb-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder={translations[language].taskTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div
            className={`space-y-2 mb-4 ${
              subtasks.length === 0 ? "hidden" : ""
            }`}
          >
            <AnimatePresence>
              {subtasks.map((subtask) => (
                <motion.div
                  key={subtask}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm"
                >
                  {subtask}
                  <button
                    className="text-xs text-red-500 hover:text-red-600 transition"
                    onClick={() => handleDeleteSubtask(subtask)}
                  >
                    {translations[language].deleteSubtask}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder={translations[language].newSubtaskInput}
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
              onClick={handleAddSubtask}
            >
              {translations[language].addSubtask}
            </button>
          </div>

          {/* Add user selection section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Assign to Users
            </h3>
            <div className="max-h-60 overflow-y-auto border dark:border-gray-600 rounded-md p-2">
              {loadingUsers ? (
                <p className="text-gray-700 dark:text-gray-300">
                  Loading users...
                </p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users available</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUserIds.includes(user.id)
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => {}} // Handled by the div click
                      className="mr-2"
                    />
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span className="text-gray-800 dark:text-white">
                      {user.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
              onClick={handleSubmit}
            >
              {task
                ? translations[language].updateTask
                : translations[language].createTaskButton}
            </button>
            {task && onDelete && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
                onClick={handleDelete}
              >
                {translations[language].deleteTask}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskManagerModal;
