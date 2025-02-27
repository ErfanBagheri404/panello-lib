import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export type Task = {
  id: number;
  name: string;
  subtasks: string[];
  color: string;
};

type TaskManagerModalProps = {
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskManagerModal = ({
  onClose,
  tasks,
  setTasks,
}: TaskManagerModalProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [subtaskInputs, setSubtaskInputs] = useState<{ [key: number]: string }>(
    {}
  );
  const modalRef = useRef<HTMLDivElement>(null);

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
    let color = colors[Math.floor(Math.random() * colors.length)];

    // Check for duplicates and try again if needed
    if (usedColors.length < colors.length) {
      while (usedColors.includes(color)) {
        color = colors[Math.floor(Math.random() * colors.length)];
      }
    }

    return color;
  };

  const [isShiftHeld, setIsShiftHeld] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftHeld(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Close modal on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const addMainTask = () => {
    if (newTaskName.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: newTaskName,
          subtasks: [],
          color: getRandomColor(),
        },
      ]);
      setNewTaskName("");
    }
  };

  const deleteMainTask = (id: number, instant = false) => {
    if (instant) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const addSubtask = (taskId: number) => {
    const subtaskName = subtaskInputs[taskId]?.trim();
    if (subtaskName) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, subtaskName] }
            : task
        )
      );
      setSubtaskInputs((prev) => ({ ...prev, [taskId]: "" }));
    }
  };

  const deleteSubtask = (
    taskId: number,
    subtaskName: string,
    instant = false
  ) => {
    if (instant) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((st) => st !== subtaskName),
              }
            : task
        )
      );
    } else {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter((st) => st !== subtaskName),
              }
            : task
        )
      );
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
          className="absolute top-3 right-3 text-2xl text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          onClick={onClose}
        >
          <IoClose />
        </button>
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">
          Manage Tasks & Subtasks
        </h2>

        <div className="max-h-[70vh] overflow-y-auto pb-10 pr-2 scrollbar-hide">
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={isShiftHeld ? undefined : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isShiftHeld ? undefined : { opacity: 0, scale: 0.8 }}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {task.name}
                    </span>
                    <button
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      onClick={() => deleteMainTask(task.id, isShiftHeld)}
                    >
                      Delete Task
                    </button>
                  </div>

                  <ul className="space-y-1 mb-3">
                    <AnimatePresence>
                      {task.subtasks.map((subtask) => (
                        <motion.li
                          key={subtask}
                          initial={
                            isShiftHeld ? undefined : { opacity: 0, x: -20 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={isShiftHeld ? undefined : { opacity: 0, x: 20 }}
                          className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm"
                        >
                          {subtask}
                          <button
                            className="text-xs text-red-500 hover:text-red-600 transition"
                            onClick={() =>
                              deleteSubtask(task.id, subtask, isShiftHeld)
                            }
                          >
                            Delete
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="New subtask name"
                      value={subtaskInputs[task.id] || ""}
                      onChange={(e) =>
                        setSubtaskInputs((prev) => ({
                          ...prev,
                          [task.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
                      onClick={() => addSubtask(task.id)}
                    >
                      Add Subtask
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="New main task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
            onClick={addMainTask}
          >
            Add Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskManagerModal;
