import { useState } from "react";
import { FaRegBell, FaRegTrashAlt, FaRegClock } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { RxDragHandleDots2 } from "react-icons/rx";

const reminders = [
  {
    date: "Today",
    count: 3,
    tasks: [
      "Assess any new risks identified in the morning meeting.",
      "Follow up with the client regarding project status.",
      "Review team progress and provide feedback.",
    ],
  },
  {
    date: "Tomorrow",
    count: 2,
    tasks: [
      "Prepare the weekly report.",
      "Check-in with the design team for updates.",
    ],
  },
  {
    date: "April, 2nd",
    count: 1,
    tasks: ["Submit final proposal for the new project."],
  },
];

const HomeReminder = () => {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
            <span className="text-gray-500 ml-2">• {section.count}</span>
          </h3>
          {openSections[index] && (
            <div className="mt-2  pt-2 space-y-2">
              {section.tasks.map((task, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 ${
                    i !== section.tasks.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="text-sm">{task}</span>
                  <div className="flex items-center space-x-2">
                    <FaRegBell className="text-gray-500 hover:text-yellow-500 cursor-pointer" />
                    <FaRegTrashAlt className="text-gray-500 hover:text-red-500 cursor-pointer" />
                    <input type="checkbox" className="cursor-pointer" />
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
