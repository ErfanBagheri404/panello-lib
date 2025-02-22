import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import grid from "../assets/Grid.svg";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [name, setName] = useState("John Doe");
  const [email] = useState("john@example.com");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <main
      className={`relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white"
      } border border-black/30 h-screen mt-2.5 rounded-2xl overflow-hidden flex flex-col scrollbar-hide p-6 gap-5`}
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
        } border border-black/30 rounded-2xl p-6`}
      >
        <h2 className="text-2xl font-bold">Settings</h2>
        <span>Manage your account through here.</span>
        <div className="flex gap-3 mt-3">
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
        className={`z-10 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border border-black/30 rounded-2xl p-6 flex-1`}
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
            {selectedTab === "general" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl">JD</span>
                  </div>
                  <button className="px-4 py-2 border rounded-full">
                    Change Photo
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full"
                >
                  Toggle Dark Mode
                </button>
              </div>
            )}

            {selectedTab === "security" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-medium">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
                  Change Password
                </button>
              </div>
            )}

            {selectedTab === "api" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-medium">MongoDB API Key</label>
                  <input
                    type="text"
                    value="****************"
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium">
                    OpenRouter API Key
                  </label>
                  <input
                    type="text"
                    value="****************"
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
                  Regenerate API Keys
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Settings;
