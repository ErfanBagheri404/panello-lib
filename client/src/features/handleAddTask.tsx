import { useState } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import TaskManagerModal from "../features/TaskManagerModal";
import { ITask } from "../types";

const HomeTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);

  // Function to handle task submission
  const handleTaskSubmit = async (taskData: Partial<ITask>) => {
    // Here you would typically make an API call to save the task
    // For now, we'll just add it to the local state with a mock ID
    const newTask: ITask = {
      _id: Date.now().toString(), // Mock ID
      title: taskData.title || "",
      subtasks: taskData.subtasks || [],
      color: taskData.color || "",
      user: "", // This would come from your auth system
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: taskData.assignedTo || []
    };
    
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="p-5 bg-white rounded-xl border border-black/30">
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <RxDragHandleDots2 />
        <MdOutlineTaskAlt className="text-green-500" /> My Tasks
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl">
              <span className="text-xl font-bold">+</span>
            </div>
            <p className="font-medium text-md">Add a new task</p>
          </div>

          {/* Sample Task (Static) */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl"
              style={{
                background:
                  "linear-gradient(55deg, #4B00FF -25.4%, #000 137.29%)",
              }}
            />
            <div>
              <p className="font-medium text-md">Team brainstorm</p>
              <p className="text-sm text-gray-500">2 tasks • 32 members</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskManagerModal
          onClose={() => setIsModalOpen(false)}
          task={null} // Pass null for a new task
          onSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
};

export default HomeTasks;
