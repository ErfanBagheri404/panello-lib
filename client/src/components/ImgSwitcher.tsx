import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { useLanguage } from "../components/language-provider"; // Add this import
import translations from "../data/translations"; // Add this import
import login1 from "../assets/login1.jpeg";
import login2 from "../assets/login2.jpeg";
import login3 from "../assets/login3.jpeg";
import logo from "../assets/logo.svg";
import { FaArrowRight } from "react-icons/fa6";

const images = [login1, login2, login3];

const ImgSwitcher = () => {
  const { language } = useLanguage();
  const t = translations[language]; // Direct translation access
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden lg:flex flex-1 flex-col items-center text-white p-5 rounded-xl h-full justify-between overflow-hidden">
      {/* Background images with crossfade */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="flex items-center gap-2 justify-between w-full z-10">
        <img src={logo} alt="Logo" className="w-8" />
        <button
          className={`flex items-center gap-2 ${
            theme === "dark" ? "bg-gray-800/30" : "bg-white/30"
          } px-3 py-1 rounded-full backdrop-blur-sm`}
        >
          {t.backToWebsite} <FaArrowRight />
        </button>
      </div>

      <div className="z-10 items-center justify-center text-center flex flex-col">
        <span className="text-3xl font-normal my-4 text-center text-white drop-shadow-lg">
          {t.slogan}
        </span>
        <div className="flex gap-2 my-6 m-auto">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-1000 ease-in-out ${
                activeIndex === index
                  ? "bg-white w-16"
                  : theme === "dark"
                  ? "bg-gray-400/50 w-10"
                  : "bg-white/30 w-10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImgSwitcher;