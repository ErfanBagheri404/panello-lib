import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    name: "English US",
    icon: "https://cdn-icons-png.flaticon.com/512/197/197484.png", // Rectangular US Flag
  });

  const languages = [
    {
      name: "English US",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197484.png", // Rectangular US Flag
    },
    {
      name: "Persian",
      icon: "https://cdn-icons-png.flaticon.com/512/197/197574.png", // Iran Flag
    },
  ];

  return (
    <div className="relative w-40">
      <button
        className="flex items-center justify-between w-full px-4 py-2 border rounded-md bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <img
            src={selectedLanguage.icon}
            alt={selectedLanguage.name}
            className="w-5 h-5" // Adjust size if needed
          />
          {selectedLanguage.name}
        </span>
        <FaChevronDown className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-md">
          {languages.map((lang) => (
            <button
              key={lang.name}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
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
