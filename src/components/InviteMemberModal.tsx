import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const roles = ["Owner", "Co-Owner", "Administrator", "Moderator", "Member"];

interface InviteData {
  email: string;
  role: string;
  avatar: string;
}

const InviteMemberModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [inviteData, setInviteData] = useState<InviteData>({
    email: "",
    role: "",
    avatar: "",
  });

  const handleNext = () => {
    if (step === 1 && inviteData.email) {
      // Generate a fake avatar based on email (pravatar)
      setInviteData((prev) => ({
        ...prev,
        avatar: `https://i.pravatar.cc/150?u=${inviteData.email}`,
      }));
    }
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleInvite = () => {
    console.log("Invited Member:", inviteData);
    onClose();
    setStep(1); // Reset for next invite
    setInviteData({ email: "", role: "", avatar: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-96 shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invite Member</h2>
              <button onClick={onClose}>
                <IoClose size={24} />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 100 }}
                  animate={{ x: 0 }}
                  exit={{ x: -100 }}
                >
                  <label className="block text-sm mb-2">Email Address:</label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder="user@example.com"
                    required
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  exit={{ x: -100 }}
                >
                  <label className="block text-sm mb-2">Select Role:</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={inviteData.role}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, role: e.target.value })
                    }
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 100 }}
                  animate={{ x: 0 }}
                  exit={{ x: -100 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={inviteData.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full mb-2"
                    />
                    <p>
                      <strong>Email:</strong> {inviteData.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {inviteData.role}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1 bg-gray-200 rounded-md"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !inviteData.email) ||
                    (step === 2 && !inviteData.role)
                  }
                  className={`px-3 py-1 rounded-md ${
                    (step === 1 && !inviteData.email) ||
                    (step === 2 && !inviteData.role)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleInvite}
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                >
                  Invite
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteMemberModal;
