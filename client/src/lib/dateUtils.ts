import translations from "../data/translations";

export const formatDate = (date: string, language: "en" | "fa") => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return dateObj.toLocaleString(translations[language].locale, options);
};