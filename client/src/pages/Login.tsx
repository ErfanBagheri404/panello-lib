import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { FaArrowRight } from "react-icons/fa6";
import login1 from "../assets/login1.jpeg";
import login2 from "../assets/login2.jpeg";
import login3 from "../assets/login3.jpeg";
import { useGoogleLogin } from "@react-oauth/google";

const images = [login1, login2, login3];

const Login = () => {
  const [bgImage, setBgImage] = useState(login1);
  const [fade, setFade] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setActiveIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          setBgImage(images[nextIndex]); // Ensures correct image update
          return nextIndex; // Updates active index properly
        });

        setFade(true);
      }, 400);
    }, 8000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  const login = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "http://localhost:5173/api/auth/google/callback",
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeResponse.code }), // Send 'code', not token
        });

        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Google login failed:", error);
        setError("Google login failed. Please try again.");
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <main className="relative flex flex-col lg:flex-row p-5 h-screen">
      {/* Content */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center text-white p-5 rounded-xl h-full justify-between overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-30"
          }`}
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="flex items-center gap-2 justify-between w-full z-10">
          <img src={logo} alt="Logo" className="w-8" />
          <button className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full">
            Back to website <FaArrowRight />
          </button>
        </div>
        <div className="z-10 items-center justify-center text-center flex flex-col">
          <span className="text-3xl font-normal my-4 text-center z-10">
            Capturing Moments, <br /> Creating Memories
          </span>
          <div className="flex gap-2 my-6 m-auto ">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-10 rounded-full transition-all duration-500 ${
                  activeIndex === index ? "bg-white w-16" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative z-10 flex-1 flex justify-center items-center p-10 h-full">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-5xl font-medium text-gray-900">Log in</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-white"
                placeholder="Enter your email"
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
                className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 p-2.5 bg-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-900"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms & Conditions
                </a>
              </label>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md 
        text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="w-full">
            <button
              onClick={() => login()}
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 
      border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 
      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
