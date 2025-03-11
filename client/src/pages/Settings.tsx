import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import grid from "../assets/Grid.svg";
import API from "../components/Settings/API";
import Security from "../components/Settings/Security";
import General from "../components/Settings/General";
import { useTheme } from "../components/theme-provider";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const { theme } = useTheme();

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <main
      className={`relative transition-all duration-300 ${
        theme === "dark"
          ? "bg-black text-white border-white/30"
          : "bg-white text-black border-black/30"
      } border h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-4 gap-5`}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <img
          className={`w-full h-full object-cover ${
            theme === "dark" ? "invert  " : ""
          }`}
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>

      {/* Settings Panel */}
      <div
        className={`z-10 ${
          theme === "dark"
            ? "bg-black border-white/30"
            : "bg-white border-black/30"
        } border rounded-2xl p-4`}
      >
        <h2 className="text-2xl font-bold">Settings</h2>
        <span>Manage your account through here.</span>
        <div className="flex flex-wrap gap-3 mt-3">
          {["general", "security", "api"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-3 py-1 border rounded-full transition-colors duration-300 ${
                selectedTab === tab
                  ? "bg-blue-500 text-white border-blue-500"
                  : theme === "dark"
                  ? "bg-gray-800 text-white border-white/30 hover:bg-gray-700"
                  : "bg-white text-black border-black/30 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`z-10 scrollbar-hide ${
          theme === "dark"
            ? "bg-black border-white/30"
            : "bg-white border-black/30"
        } border rounded-2xl p-4 flex-1 overflow-auto`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {selectedTab === "general" && <General />}
            {selectedTab === "security" && <Security />}
            {selectedTab === "api" && <API />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Settings;
