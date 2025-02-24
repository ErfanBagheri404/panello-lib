import React from 'react'
import { useState } from 'react';
const Security = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="space-y-4">
    <div className="space-y-2">
      <label className="block font-medium">Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
    </div>
    <div className="space-y-2">
      <label className="block font-medium">New Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
    </div>
    <div className="space-y-2">
      <label className="block font-medium">Confirm Password</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
    </div>
    <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
      Change Password
    </button>
  </div>
  )
}

export default Security