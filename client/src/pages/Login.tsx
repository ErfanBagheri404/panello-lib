import { useState, useEffect } from "react";
import { useGoogleAuth } from "../components/hooks/useGoogleLogin.ts";
import { useTheme } from "../components/theme-provider.tsx";
import ImgSwitcher from "../components/ImgSwitcher.tsx";
import { useLanguage } from "../components/language-provider.tsx";
import translations from "../data/translations.ts"; // Add this import

const Login = () => {
  const { language } = useLanguage();
  const t = translations[language]; // Direct access without .messages

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { googleLogin } = useGoogleAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError(t.termsRequired); // Use translated error message
      return;
    }
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.loginFailed); // Use translated error
      }
      const { token } = await response.json();
      localStorage.setItem("token", token);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberedPassword", formData.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err.message);
    }
  };

  return (
    <main
      className={`relative flex flex-col lg:flex-row p-5 h-screen ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      <ImgSwitcher />

      <div className="relative z-10 flex-1 flex justify-center items-center p-10 h-full">
        <div className="w-full max-w-md space-y-6">
          <h2
            className={`text-5xl font-medium ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {t.login}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                } focus:border-blue-500 focus:ring-blue-500 p-2.5`}
                placeholder={t.emailPlaceholder}
                required
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`mt-1 block w-full rounded-md border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                } focus:border-blue-500 focus:ring-blue-500 p-2.5`}
                placeholder={t.password}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className={`ms-2 block text-sm ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {t.agreeTerms}{" "}
                <a
                  href="#"
                  className={`text-blue-600 hover:${
                    theme === "dark" ? "text-blue-500" : "text-blue-500"
                  }`}
                >
                  {t.termsAndConditions}
                </a>
              </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md 
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {t.login}
            </button>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className={`ms-2 block text-sm ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {t.rememberMe}
              </label>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  theme === "dark"
                    ? "bg-black text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                {t.continueWith}
              </span>
            </div>
          </div>

          <button
            onClick={() => googleLogin()}
            className={`w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 
                border 
                ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-700"
                }
                rounded-md text-sm font-medium 
                hover:bg-${theme === "dark" ? "gray-700" : "gray-50"} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t.continueWithGoogle}
          </button>

          <p
            className={`text-center text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t.noAccount}{" "}
            <a
              href="/register"
              className={`font-medium text-blue-600 hover:${
                theme === "dark" ? "text-blue-500" : "text-blue-500"
              }`}
            >
              {t.register}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
