import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import grid from "../assets/Grid.svg";
import API from "../components/Settings/API";
import Security from "../components/Settings/Security";
import General from "../components/Settings/General";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [isDarkMode] = useState(false);

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <main
      className={`relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white"
      } border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-4 gap-5`}
    >
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          draggable="false"
          src={grid}
          alt="grid background"
        />
      </div>

      <div
        className={`z-10 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border border-black/30 rounded-2xl p-4`}
      >
        <h2 className="text-2xl font-bold">Settings</h2>
        <span>Manage your account through here.</span>
        <div className="flex flex-wrap gap-3 mt-3">
          <button
            onClick={() => setSelectedTab("general")}
            className={`px-3 py-1 border rounded-full ${
              selectedTab === "general" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setSelectedTab("security")}
            className={`px-3 py-1 border rounded-full ${
              selectedTab === "security" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setSelectedTab("api")}
            className={`px-3 py-1 border rounded-full ${
              selectedTab === "api" ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            API
          </button>
        </div>
      </div>

      <div
        className={`z-10 scrollbar-hide ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border border-black/30 rounded-2xl p-4 flex-1 overflow-auto`}
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
