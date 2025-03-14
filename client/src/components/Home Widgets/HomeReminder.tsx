import { useState } from "react";
import { FaRegBell, FaRegTrashAlt, FaRegClock } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useTheme } from "../theme-provider";

type ReminderTask = {
  id: string; // Unique identifier for each task
  text: string;
  completed: boolean;
  reminded: boolean;
  date: Date;
};

type ReminderSection = {
  title: string;
  tasks: ReminderTask[];
};

const HomeReminder = () => {
  const { theme } = useTheme();

  const getSectionTitle = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    const diffTime = inputDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";

    const month = inputDate.toLocaleString("default", { month: "long" });
    const day = inputDate.getDate();
    const suffix = getDaySuffix(day);
    return `${month} ${day}${suffix}`;
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

  // Initialize state with mock data
  const [reminders, setReminders] = useState<ReminderSection[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 5);

    // Mock tasks with unique IDs
    const tasks: ReminderTask[] = [
      { id: "1", text: "Buy groceries", completed: false, reminded: false, date: today },
      { id: "2", text: "Call mom", completed: true, reminded: true, date: today },
      { id: "3", text: "Finish homework", completed: false, reminded: true, date: today },
      { id: "4", text: "Dentist appointment", completed: false, reminded: true, date: tomorrow },
      { id: "5", text: "Submit project report", completed: false, reminded: false, date: futureDate },
    ];

    // Group tasks by section
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
  });

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAddReminder = () => {
    if (!newReminderText.trim() || !selectedDate) return;

    const date = new Date(selectedDate);
    const sectionTitle = getSectionTitle(date);
    const newTask: ReminderTask = {
      id: Date.now().toString(), // Unique ID for new tasks
      text: newReminderText,
      completed: false,
      reminded: false,
      date,
    };

    setReminders((prev) => {
      const existingSectionIndex = prev.findIndex((section) => section.title === sectionTitle);
      if (existingSectionIndex !== -1) {
        const updatedSections = prev.map((section, sIndex) =>
          sIndex === existingSectionIndex
            ? { ...section, tasks: [...section.tasks, newTask] }
            : section
        );
        return updatedSections;
      }
      return [...prev, { title: sectionTitle, tasks: [newTask] }];
    });

    setNewReminderText("");
    setSelectedDate("");
    setIsModalOpen(false);
  };

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleToggleComplete = (sectionIndex: number, taskId: string) => {
    setReminders((prev) =>
      prev.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : section
      )
    );
  };

  const handleToggleRemind = (sectionIndex: number, taskId: string) => {
    setReminders((prev) =>
      prev.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, reminded: !task.reminded } : task
              ),
            }
          : section
      )
    );
  };

  const handleDeleteTask = (sectionIndex: number, taskId: string) => {
    setReminders((prev) =>
      prev
        .map((section, sIndex) =>
          sIndex === sectionIndex
            ? { ...section, tasks: section.tasks.filter((task) => task.id !== taskId) }
            : section
        )
        .filter((section) => section.tasks.length > 0) // Remove empty sections
    );
  };

  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-300 ${
        theme === "dark" ? "border-white/30 bg-black text-white" : "border-black/30 bg-white text-black"
      }`}
    >
      <h2 className="flex items-center justify-between text-lg font-semibold mb-2">
        <div className="flex items-center">
          <RxDragHandleDots2 className="hidden" />
          <FaRegClock className="text-yellow-500 mr-3" /> Reminders
        </div>
        <div className="relative">
          <HiDotsHorizontal
            className="cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div
              className={`absolute right-0 top-6 rounded-md shadow-lg z-10 ${
                theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
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
                Add New Reminder
              </button>
            </div>
          )}
        </div>
      </h2>

      {reminders.map((section, index) => (
        <div key={index} className="mb-3">
          <h3
            className="font-semibold flex items-center cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <FaAngleDown
              className={`mr-2 transition-transform ${openSections[index] ? "rotate-180" : ""}`}
            />
            {section.title}
            <span className="text-gray-500 ml-2">• {section.tasks.length}</span>
          </h3>
          {openSections[index] && (
            <div className="mt-2 pt-2 space-y-2">
              {section.tasks.map((task) => (
                <div
                  key={task.id} // Use unique task ID as key
                  className={`flex items-center justify-between p-2 ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  } ${
                    task.id !== section.tasks[section.tasks.length - 1].id ? "border-b" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${task.completed && "line-through text-gray-400"}`}
                  >
                    {task.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    <FaRegBell
                      className={`cursor-pointer ${
                        task.reminded
                          ? "text-yellow-500"
                          : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleToggleRemind(index, task.id)}
                    />
                    <FaRegTrashAlt
                      className={`cursor-pointer ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-red-500"
                          : "text-gray-600 hover:text-red-600"
                      }`}
                      onClick={() => handleDeleteTask(index, task.id)}
                    />
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(index, task.id)}
                      className={`cursor-pointer ${
                        theme === "dark" ? "accent-yellow-500" : "accent-blue-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add Reminder Modal */}
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
          <h3 className="text-lg font-semibold mb-4">Add New Reminder</h3>
          <input
            type="text"
            placeholder="Reminder text"
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
                theme === "dark" ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAddReminder}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeReminder;