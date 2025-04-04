import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";
import { useTheme } from "../theme-provider";

interface LanguageOption {
  name: string;
  code: "en" | "fa";
  icon: string;
}

const LanguageSelector = () => {
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Define languages with translated names
  const languages: LanguageOption[] = [
    {
      name: translations[language].languages.englishUS,
      code: "en",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    },
    {
      name: translations[language].languages.persian,
      code: "fa",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197574.png",
    },
  ];

  const selectedLanguage = languages.find((lang) => lang.code === language)!;

  return (
    <div className="relative w-40 transition-all duration-300">
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
          className={`absolute ${
            theme === "dark"
              ? "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              : "bg-white text-black"
          } left-0 mt-2 w-full 
          border border-gray-300  rounded-md shadow-md`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center w-full px-4 py-2"
              onClick={() => {
                setLanguage(lang.code);
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
