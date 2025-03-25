import { useTheme } from "../theme-provider";
const API = () => {
  const { theme } = useTheme(); // Assuming this provides "light" or "dark"

  return (
    <div className="space-y-4 transition-all duration-300">
      {/* MongoDB API Key Section */}
      <div className="space-y-2">
        <label
          className={`block font-medium ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          MongoDB API Key
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

      {/* OpenRouter API Key Section */}
      <div className="space-y-2">
        <label
          className={`block font-medium ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          OpenRouter API Key
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

      {/* Button */}
      <button
        className={`px-4 py-2 rounded-full text-white transition ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Apply API Keys
      </button>
    </div>
  );
};

export default API;
