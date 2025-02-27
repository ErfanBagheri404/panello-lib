import { SetStateAction, useState } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import TaskManagerModal, { Task } from "../../features/TaskManagerModal";

const HomeTasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          tasks={[]}
          setTasks={function (_value: SetStateAction<Task[]>): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};

export default HomeTasks;
