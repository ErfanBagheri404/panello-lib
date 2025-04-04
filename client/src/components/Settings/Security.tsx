import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";

interface User {
  googleId?: string;
  email: string;
}

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError(translations[language].settings.notLoggedInError);
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(translations[language].settings.fetchUserError);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [language]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(translations[language].settings.passwordMismatchError);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(translations[language].settings.passwordChangeSuccess);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.error ||
            translations[language].settings.passwordChangeError
        );
      } else {
        setError(translations[language].settings.passwordChangeError);
      }
    }
  };

  if (loading) {
    return <div>{translations[language].settings.loading}</div>;
  }

  if (!user) {
    return <div>{error}</div>;
  }

  if (user.googleId) {
    return <div>{translations[language].settings.googleUserMessage}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium">
          {translations[language].settings.currentPassword}
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">
          {translations[language].settings.newPassword}
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">
          {translations[language].settings.confirmPassword}
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-full"
      >
        {translations[language].settings.changePassword}
      </button>
    </form>
  );
};

export default Security;
