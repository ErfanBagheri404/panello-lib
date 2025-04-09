import { useTheme } from "../theme-provider";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";

const API = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="space-y-4 transition-all duration-300">
      <div className="space-y-2">
        <label
          className={`block font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          {translations[language].mongoDBApiKey}
        </label>
        <input
          type="text"
          value="****************"
          readOnly
          className={`w-full p-2 border rounded-lg ${
            theme === "dark"
              ? "bg-gray-800 text-white border-white/30 hover:bg-gray-700"
              : "bg-white text-black border-black/30 hover:bg-gray-100"
          }`}
        />
      </div>

      <div className="space-y-2">
        <label
          className={`block font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          {translations[language].openRouterApiKey}
        </label>
        <input
          type="text"
          value="****************"
          readOnly
          className={`w-full p-2 border rounded-lg ${
            theme === "dark"
              ? "bg-gray-800 text-white border-white/30 hover:bg-gray-700"
              : "bg-white text-black border-black/30 hover:bg-gray-100"
          }`}
        />
      </div>

      <button
        className={`px-4 py-2 rounded-full text-white transition ${
          theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {translations[language].settings.applyApiKeys}
      </button>
    </div>
  );
};

export default API;