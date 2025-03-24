import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { ITask } from "../types";

type TaskManagerModalProps = {
  onClose: () => void;
  task: ITask | null;
  onSubmit: (taskData: Partial<ITask>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

const TaskManagerModal = ({
  onClose,
  task,
  onSubmit,
  onDelete,
}: TaskManagerModalProps) => {
  const [title, setTitle] = useState(task?.title || "");
  const [subtasks, setSubtasks] = useState<string[]>(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
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
      "#795548",
      "#607D8B",
      "#CDDC39",
      "#9E9E9E",
      "#FFECB3",
      "#B2EBF0",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
      color: task?.color || getRandomColor(), // Reuse existing color or generate new
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
          className="absolute top-3 right-3 text-2xl text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          onClick={onClose}
        >
          <IoClose />
        </button>
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">
          {task ? "Edit Task" : "New Task"}
        </h2>

        <div className="max-h-[70vh] overflow-y-auto pb-10 pr-2 scrollbar-hide">
          <input
            type="text"
            className="w-full p-2 mb-4 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-2 mb-4">
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
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              className="flex-1 p-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="New subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
              onClick={handleAddSubtask}
            >
              Add Subtask
            </button>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
              onClick={handleSubmit}
            >
              {task ? "Update Task" : "Create Task"}
            </button>
            {task && onDelete && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition"
                onClick={handleDelete}
              >
                Delete Task
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskManagerModal;
