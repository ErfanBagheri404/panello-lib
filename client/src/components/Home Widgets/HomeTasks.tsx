import { useState } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import TaskManagerModal from "../../features/TaskManagerModal";
import { useTheme } from "../theme-provider"; // Add this import

type Task = {
  id: number;
  name: string;
  subtasks: string[];
  color: string;
};

const HomeTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme(); // Use the theme hook

 const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Team brainstorm",
      subtasks: ["Prepare agenda", "Invite team"],
      color: "#4B00FF",
    },
    {
      id: 2,
      name: "Design review",
      subtasks: ["Review new mockups", "Prepare feedback"],
      color: "#FF5722",
    },
  ]);

  const getRandomColor = (tasks: Task[]) => {
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
      "#009688",
      "#795548",
      "#607D8B",
      "#CDDC39",
      "#FF5722",
      "#9E9E9E",
      "#FFECB3",
      "#B2EBF0",
    ];

    const usedColors = tasks.map((task) => task.color);
    const availableColors = colors.filter(
      (color) => !usedColors.includes(color)
    );

    if (availableColors.length > 0) {
      return availableColors[
        Math.floor(Math.random() * availableColors.length)
      ];
    }

    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  };

  const initializeColors = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        color: task.color || getRandomColor(prevTasks),
      }))
    );
  };

  useState(() => {
    initializeColors();
  });

  return (
    <div
      className={`p-5 transition-all duration-300  rounded-xl border ${
        theme === "dark"
          ? "border-white/30 bg-black"
          : "border-black/30 bg-white"
      }`}
    >
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <RxDragHandleDots2 />
        <MdOutlineTaskAlt className="text-green-500" /> My Tasks
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl">
            <span className="text-xl font-bold">+</span>
          </div>
          <p className="font-medium text-md">Add a new task</p>
        </div>
        {tasks.map((task) => (
          <div className="flex items-center gap-3" key={task.id}>
            <div
              className="w-12 h-12 rounded-xl hover:cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: `linear-gradient(55deg, ${task.color} -25.4%, #000 137.29%)`,
              }}
            />
            <div>
              <p
                className="font-medium text-md hover:cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                {task.name}
              </p>
              <p className="text-sm text-gray-500">
                {task.subtasks.length} tasks • 0 members
              </p>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <TaskManagerModal
          onClose={() => setIsModalOpen(false)}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
    </div>
  );
};

export default HomeTasks;
