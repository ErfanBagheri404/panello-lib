import LanguageSelector from "./LanguageSelector";
import { useTheme } from "../theme-provider";
import { useNavigate } from "react-router-dom";
import { useUser } from "../user-provider";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import defaultUser from "../../assets/defaultUser.jpg";
import darkwire from "../../assets/wireframeDark.png";
import lightwire from "../../assets/wireframeLight.png";
import systemwire from "../../assets/System.png";

type ThemeOption = {
  name: string;
  src: string;
  value: "system" | "light" | "dark";
};

const General = () => {
  const { user, setUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const themeOptions: ThemeOption[] = [
    { name: "System", src: systemwire, value: "system" },
    { name: "Light", src: lightwire, value: "light" },
    { name: "Dark", src: darkwire, value: "dark" },
  ];

  const [selectedTheme, setSelectedTheme] = useState<ThemeOption["value"]>(
    () => {
      const savedPreference = localStorage.getItem("themePreference");
      return savedPreference
        ? (savedPreference as ThemeOption["value"])
        : theme;
    }
  );

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

      // Update user state with new avatar URL
      setUser((prev) =>
        prev ? { ...prev, avatar: response.data.avatar } : prev
      );
    } catch (error) {
      console.error("Avatar update failed:", error);
    }
  };


  const handleThemeSelection = (chosenTheme: ThemeOption["value"]) => {
    setSelectedTheme(chosenTheme);
    localStorage.setItem("themePreference", chosenTheme);
    if (chosenTheme === "system") {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemPreference);
    } else {
      setTheme(chosenTheme as "light" | "dark");
    }
  };

  useEffect(() => {
    const savedPreference = localStorage.getItem("themePreference");
    if (savedPreference) {
      if (savedPreference === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
          setTheme(mediaQuery.matches ? "dark" : "light");
        };
        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        setTheme(savedPreference as "light" | "dark");
      }
    }
  }, [setTheme]);

  return (
    <div className="space-y-6">
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
          {themeOptions.map(({ name, src, value }) => (
            <div
              key={value}
              className={`relative w-32 h-20 border-2 rounded-md flex items-center justify-center cursor-pointer transition overflow-hidden ${
                selectedTheme === value ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => handleThemeSelection(value)}
            >
              <img
                src={src}
                alt={`${name} mode`}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute text-sm ${
                  value === "light" ? "text-black" : "text-white"
                }`}
              >
                {name}
              </span>
            </div>
          ))}
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

      {/* Logout Option */}
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
    </div>
  );
};

export default General;
