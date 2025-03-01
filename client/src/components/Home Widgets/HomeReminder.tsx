import { useState } from "react";
import { FaRegBell, FaRegTrashAlt, FaRegClock } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { RxDragHandleDots2 } from "react-icons/rx";

// Define types for better type safety
type ReminderTask = {
  text: string;
  completed: boolean;
  reminded: boolean;
};
type ReminderSection = {
  date: string;
  tasks: ReminderTask[];
};

const initialReminders: { date: string; tasks: string[] }[] = [
  {
    date: "Today",
    tasks: [
      "Assess any new risks identified in the morning meeting.",
      "Follow up with the client regarding project status.",
      "Review team progress and provide feedback.",
    ],
  },
  {
    date: "Tomorrow",
    tasks: [
      "Prepare the weekly report.",
      "Check-in with the design team for updates.",
    ],
  },
  {
    date: "April, 2nd",
    tasks: ["Submit final proposal for the new project."],
  },
];

const HomeReminder = () => {
  const [reminders, setReminders] = useState<ReminderSection[]>(initialReminders.map(section => ({
      ...section,
      tasks: section.tasks.map((task) => ({
        text: task,
        completed: false,
        reminded: false,
      })),
    }))
  );

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  // Add type annotations to parameters
  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleToggleComplete = (sectionIndex: number, taskIndex: number) => {
    setReminders((prev) => {
      const newReminders = [...prev];
      const task = newReminders[sectionIndex].tasks[taskIndex];
      task.completed = !task.completed;
      return newReminders;
    });
  };

  const handleToggleRemind = (sectionIndex: number, taskIndex: number) => {
    setReminders((prev) => {
      const newReminders = [...prev];
      const task = newReminders[sectionIndex].tasks[taskIndex];
      task.reminded = !task.reminded;
      return newReminders;
    });
  };

  const handleDeleteTask = (sectionIndex: number, taskIndex: number) => {
    setReminders((prev) => {
      const newReminders = [...prev];
      newReminders[sectionIndex].tasks.splice(taskIndex, 1);
      return newReminders;
    });
  };

  return (
    <div className="border rounded-xl p-5 border-black/30 bg-white">
      <h2 className="flex items-center justify-between text-lg font-semibold mb-2">
        <div className="flex items-center">
          <RxDragHandleDots2 className="hidden"></RxDragHandleDots2>
          <FaRegClock className="text-yellow-500 mr-3" /> Reminders
        </div>
        <HiDotsHorizontal></HiDotsHorizontal>
      </h2>
      {reminders.map((section, index) => (
        <div key={index} className="mb-3">
          <h3
            className="font-semibold flex items-center cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <FaAngleDown
              className={`mr-2 transition-transform ${
                openSections[index] ? "rotate-180" : ""
              }`}
            />
            {section.date}{" "}
            <span className="text-gray-500 ml-2">• {section.tasks.length}</span>
          </h3>
          {openSections[index] && (
            <div className="mt-2 pt-2 space-y-2">
              {section.tasks.map((task, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 ${
                    i !== section.tasks.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span
                    className={`text-sm ${
                      task.completed && "line-through text-gray-400"
                    }`}
                  >
                    {task.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    <FaRegBell
                      className={`text-gray-500 hover:text-yellow-500 cursor-pointer ${
                        task.reminded && "text-yellow-500"
                      }`}
                      onClick={() => handleToggleRemind(index, i)}
                    />
                    <FaRegTrashAlt
                      className="text-gray-500 hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteTask(index, i)}
                    />
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(index, i)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomeReminder;
