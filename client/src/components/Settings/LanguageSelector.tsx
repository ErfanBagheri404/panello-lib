import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTheme } from "../theme-provider"; 

const LanguageSelector = () => {
  const { theme } = useTheme(); 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    name: "English US",
    icon: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
  });

  const languages = [
    {
      name: "English US",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    },
    {
      name: "Persian",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197574.png",
    },
  ];

  return (
    <div className={`relative w-40 transition-all duration-300 `}>
      <button
        className={`flex items-center justify-between w-full px-4 py-2 border rounded-md 
          bg-white ${
            theme === "dark"
              ? "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              : ""
          }  border-gray-300 
          text-gray-900  shadow-sm`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <img
            src={selectedLanguage.icon}
            alt={selectedLanguage.name}
            className="w-5 h-5"
          />
          {selectedLanguage.name}
        </span>
        <FaChevronDown className="text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 
          border dark:border-gray-700 rounded-md shadow-md"
        >
          {languages.map((lang) => (
            <button
              key={lang.name}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                text-gray-900 dark:text-gray-200"
              onClick={() => {
                setSelectedLanguage(lang);
                setIsOpen(false);
              }}
            >
              <img src={lang.icon} alt={lang.name} className="w-5 h-5 mr-2" />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
