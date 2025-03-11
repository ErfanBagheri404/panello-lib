import LanguageSelector from "./LanguageSelector";
import { useTheme } from "../theme-provider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user-provider";
import axios from "axios";
import { useRef } from "react";
import defaultUser from "../../assets/defaultUser.jpg";

const General = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleAvatarUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put(
        "http://localhost:5000/api/auth/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev) =>
        prev ? { ...prev, avatar: response.data.avatar } : prev
      );
    } catch (error) {
      console.error("Avatar update failed:", error);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await axios.delete("/api/auth/avatar", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setUser((prev) =>
        prev ? { ...prev, avatar: response.data.avatar } : prev
      );
    } catch (error) {
      console.error("Avatar removal failed:", error);
    }
  };

  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Profile Picture */}
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex flex-col lg:w-1/3">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your Profile Picture.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-4 mt-2 lg:mt-0">
          <div className="flex items-center gap-6">
            <div
              className={`w-12 h-12 border flex items-center justify-center rounded-xl overflow-hidden ${
                theme === "dark"
                  ? "border-white/30 bg-gray-800"
                  : "border-black/30 bg-gray-200"
              }`}
            >
              <img
                src={user?.avatar || defaultUser}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAvatarUpdate(e.target.files[0]);
                }
              }}
            />
            <button
              className={`px-3 py-1 rounded-lg border transition ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-white/30 hover:bg-gray-700"
                  : "bg-white text-black border-black/30 hover:bg-gray-100"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace image
            </button>

            {user?.avatar && (
              <button
                className="text-red-500 bg-red-100 dark:bg-red-900 px-3 py-1 rounded-lg transition hover:bg-red-200 dark:hover:bg-red-800"
                onClick={handleRemoveAvatar}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interface Theme */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col lg:w-1/3">
          <h3 className="text-lg font-medium">Interface theme</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select or customize your UI theme.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 lg:mt-0 lg:w-full">
          {["System preference", "Light", "Dark"].map((themeOption) => (
            <div
              key={themeOption}
              className={`w-32 h-20 border-2 p-2 flex items-center justify-center cursor-pointer transition ${
                theme === "dark"
                  ? "border-white/30 bg-gray-800 hover:bg-gray-700"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              } ${
                themeOption === "Dark" && theme === "dark"
                  ? "border-blue-500"
                  : ""
              }`}
            >
              <span className="text-sm text-center">{themeOption}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Feature */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col lg:w-1/3">
          <h3 className="text-lg font-medium">Sidebar feature</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            What shows in the desktop sidebar.
          </p>
        </div>
        <div className="flex flex-col lg:w-full mt-2 lg:mt-0">
          <select
            className={`border rounded-md px-3 py-2 w-full lg:w-fit transition ${
              theme === "dark"
                ? "bg-gray-900 text-white border-white/30"
                : "bg-white text-black border-black/30"
            }`}
          >
            <option>Recent changes</option>
            <option>Favorites</option>
            <option>Shortcuts</option>
          </select>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col lg:w-1/3">
          <h3 className="text-lg font-medium">Language</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change Dashboard's language.
          </p>
        </div>
        <div className="flex w-full mt-2 lg:mt-0">
          <LanguageSelector />
        </div>
      </div>

      {/* New Logout Option */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col lg:w-1/3">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings.
          </p>
        </div>
        <div className="flex w-full mt-2 lg:mt-0">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 w-full lg:w-fit"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex justify-center lg:justify-start">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`px-4 py-2 border rounded-full transition ${
            theme === "dark"
              ? "bg-gray-800 text-white border-white/30 hover:bg-gray-700"
              : "bg-gray-300 text-black border-black/30 hover:bg-gray-400"
          }`}
        >
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default General;
