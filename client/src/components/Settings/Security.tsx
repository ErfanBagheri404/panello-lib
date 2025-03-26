import { useState, useEffect } from "react";
import axios from "axios";

// Define the User interface
interface User {
  googleId?: string;
  email: string;
  // Add other properties as needed based on your API response
}

const Security = () => {
  // Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User profile state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to access this page");
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
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
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
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Failed to change password");
      } else {
        setError("Failed to change password");
      }
    }
  };

  // Render logic
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>{error}</div>;
  }

  // If user is a Google user, show a message instead of the form
  if (user.googleId) {
    return (
      <div>
        <p>Password change is not available for Google users.</p>
      </div>
    );
  }

  // Render the password change form for non-Google users
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Confirm Password</label>
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
        Change Password
      </button>
    </form>
  );
};

export default Security;