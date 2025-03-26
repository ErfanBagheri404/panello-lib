import { useState } from "react";
import axios from "axios";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // Retrieve the JWT token from localStorage using the key "token"
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to change your password");
        return;
      }

      // Send PUT request to the backend
      await axios.put(
        "/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // On success, clear the form and show a success message
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Handle errors from the backend
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Failed to change password");
      } else {
        setError("Failed to change password");
      }
    }
  };

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