import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "fa";

interface LanguageContextType {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Compute initial language from localStorage, defaulting to "en" if invalid or not present
  const initialLanguage = (() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage === "en" || savedLanguage === "fa"
      ? savedLanguage
      : "en";
  })();

  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [direction, setDirection] = useState<"ltr" | "rtl">(
    initialLanguage === "fa" ? "rtl" : "ltr"
  );

  // Custom setLanguage function to update state and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === "fa" ? "rtl" : "ltr");
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    if (language === "fa") {
      document.body.classList.add("fa-lang");
      document.body.classList.remove("en-lang");
    } else {
      document.body.classList.add("en-lang");
      document.body.classList.remove("fa-lang");
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
