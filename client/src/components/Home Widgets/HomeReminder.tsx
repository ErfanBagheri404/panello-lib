import { useState, useEffect } from "react";
import { FaRegTrashAlt, FaRegClock } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useTheme } from "../theme-provider";
import axios from "axios";
import translations from "../../data/translations";
import { useLanguage } from "../language-provider";

type ReminderTask = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: Date;
  userId: string;
};

type ReminderSection = {
  title: string;
  tasks: ReminderTask[];
};

const API_URL = "http://localhost:5000/api/reminders";

const HomeReminder = () => {
  const { theme } = useTheme();
  const [reminders, setReminders] = useState<ReminderSection[]>([]);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const { language } = useLanguage();

  // Fetch reminders on mount with authentication
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const tasks = response.data;
        const grouped = groupTasksByDate(tasks);
        setReminders(grouped);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };
    fetchReminders();
  }, []);

  const getSectionTitle = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);
    const diffTime = inputDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  
    if (language === "fa") {
      if (diffDays === 0) return "امروز";
      if (diffDays === 1) return "فردا";
  
      return inputDate.toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
  
      const month = inputDate.toLocaleString("default", { month: "long" });
      const day = inputDate.getDate();
      const suffix = getDaySuffix(day);
      return `${month} ${day}${suffix}`;
    }
  };
  

  const groupTasksByDate = (tasks: ReminderTask[]): ReminderSection[] => {
    const sectionsMap: Record<string, ReminderTask[]> = {};
    tasks.forEach((task) => {
      const title = getSectionTitle(task.date);
      if (!sectionsMap[title]) {
        sectionsMap[title] = [];
      }
      sectionsMap[title].push(task);
    });
    return Object.entries(sectionsMap).map(([title, tasks]) => ({
      title,
      tasks,
    }));
  };

  const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleAddReminder = async () => {
    if (!newReminderText.trim() || !selectedDate) return;
    try {
      const response = await axios.post(
        API_URL,
        {
          title: newReminderText,
          date: selectedDate,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // Update state with new reminder
      const newTask = response.data;
      const sectionTitle = getSectionTitle(new Date(newTask.date));
      const existingSectionIndex = reminders.findIndex(
        (section) => section.title === sectionTitle
      );
      if (existingSectionIndex !== -1) {
        setReminders((prev) =>
          prev.map((section, index) =>
            index === existingSectionIndex
              ? { ...section, tasks: [...section.tasks, newTask] }
              : section
          )
        );
      } else {
        setReminders((prev) => [
          ...prev,
          { title: sectionTitle, tasks: [newTask] },
        ]);
      }
      setNewReminderText("");
      setSelectedDate("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleToggleComplete = async (sectionIndex: number, taskId: string) => {
    try {
      const task = reminders[sectionIndex].tasks.find((t) => t._id === taskId);
      if (!task) return;

      await axios.put(
        `${API_URL}/${taskId}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReminders((prev) =>
        prev.map((section, idx) =>
          idx === sectionIndex
            ? {
                ...section,
                tasks: section.tasks.map((t) =>
                  t._id === taskId ? { ...t, completed: !t.completed } : t
                ),
              }
            : section
        )
      );
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const handleDeleteTask = async (sectionIndex: number, taskId: string) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReminders((prev) =>
        prev
          .map((section, sIndex) =>
            sIndex === sectionIndex
              ? {
                  ...section,
                  tasks: section.tasks.filter((t) => t._id !== taskId),
                }
              : section
          )
          .filter((section) => section.tasks.length > 0)
      );
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-300 ${
        theme === "dark"
          ? "border-white/30 bg-black text-white"
          : "border-black/30 bg-white text-black"
      }`}
    >
      <h2 className="flex items-center justify-between text-lg font-semibold mb-2">
        <div className="flex items-center">
          <RxDragHandleDots2 className="hidden" />
          <FaRegClock className="text-yellow-500 mr-3" />
          {translations[language].reminders}
        </div>
        <div className="relative">
          <HiDotsHorizontal
            className="cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div
              className={`absolute right-0 top-6 rounded-md shadow-lg z-10 ${
                theme === "dark"
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  setIsModalOpen(true);
                }}
                className={`px-4 py-2 w-full text-sm text-nowrap ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                {translations[language].addNewReminder}
              </button>
            </div>
          )}
        </div>
      </h2>

      {reminders.length === 0 ? (
        <div
          className={`text-center flex items-center justify-center gap-2 p-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {translations[language].noRemindersMessage
            .split("%dots%")
            .map((part, index) => (
              <span className="flex  items-center gap-2" key={index}>
                {part}
                {index === 0 && (
                  <HiDotsHorizontal
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                )}
              </span>
            ))}
        </div>
      ) : (
        reminders.map((section, index) => (
          <div key={index} className="gap-2 mt-2">
            <h3
              className="font-semibold flex items-center cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              <FaAngleDown
                className={`mr-2 transition-transform ${
                  openSections[index] ? "rotate-180" : ""
                }`}
              />
              {section.title}
              <span className="text-gray-500 ms-2">
                • {section.tasks.length}
              </span>
            </h3>
            {openSections[index] && (
              <div className=" pt-2">
                {section.tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`flex items-center justify-between p-2 ${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    } ${
                      task._id !== section.tasks[section.tasks.length - 1]._id
                        ? "border-b"
                        : ""
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        task.completed && "line-through text-gray-400"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      {/* <FaRegBell
                      className={`cursor-pointer ${
                        task.reminded
                          ? "text-yellow-500"
                          : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleToggleRemind(index, task.id)}
                    /> */}
                      <FaRegTrashAlt
                        className={`cursor-pointer ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-red-500"
                            : "text-gray-600 hover:text-red-600"
                        }`}
                        onClick={() => handleDeleteTask(index, task._id)}
                      />
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(index, task._id)}
                        className={`cursor-pointer ${
                          theme === "dark"
                            ? "accent-yellow-500"
                            : "accent-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isModalOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        />
        <div
          className={`relative rounded-xl p-6 w-96 max-w-full transform transition-all ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } ${isModalOpen ? "scale-100" : "scale-95"}`}
        >
          <h3 className="text-lg font-semibold mb-4">
            {translations[language].addNewReminder}
          </h3>
          <input
            type="text"
            placeholder={translations[language].reminderTextPlaceholder}
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
            className={`w-full mb-4 p-2 rounded border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            }`}
          />
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full mb-6 p-2 rounded border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            }`}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-4 py-2 rounded ${
                theme === "dark"
                  ? "text-white hover:bg-gray-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {translations[language].cancelButton}
            </button>
            <button
              onClick={handleAddReminder}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {translations[language].addReminderButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeReminder;
