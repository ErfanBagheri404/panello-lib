const API = () => {
  return (
    <div className="space-y-4 transition-all duration-300">
      <div className="space-y-2">
        <label className="block font-medium text-gray-900 dark:text-gray-200">
          MongoDB API Key
        </label>
        <input
          type="text"
          value="****************"
          readOnly
          className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-300"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium text-gray-900 dark:text-gray-200">
          OpenRouter API Key
        </label>
        <input
          type="text"
          value="****************"
          readOnly
          className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-300"
        />
      </div>
      <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition">
        Apply API Keys
      </button>
    </div>
  );
};

export default API;
