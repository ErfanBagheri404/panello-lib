import { useState } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import TaskManagerModal from "./TaskManagerModal";

type Task = {
  id: number;
  name: string;
  subtasks: string[];
  color: string; // Add color property
};

const getRandomColor = () => {
  const colors = [
    "#4B00FF",
    "#FF5722",
    "#009688",
    "#E91E63",
    "#FFEB3B",
    "#3F51B5",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const HomeTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Shared tasks state (moved here from the modal)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Team brainstorm",
      subtasks: ["Prepare agenda", "Invite team"],
      color: getRandomColor(), // Initial color
    },
    {
      id: 2,
      name: "Design review",
      subtasks: ["Review new mockups", "Prepare feedback"],
      color: getRandomColor(), // Initial color
    },
  ]);

  return (
    <div className="p-5 bg-white rounded-xl border border-black/30">
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <RxDragHandleDots2 />
        <MdOutlineTaskAlt className="text-green-500" /> My Tasks
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Add Task Button */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl">
            <span className="text-xl font-bold">+</span>
          </div>
          <p className="font-medium text-md">Add a new task</p>
        </div>

        {/* Render all tasks */}
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
