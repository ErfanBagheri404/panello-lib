import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface Role {
  id: string;
  name: string;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
}

interface InviteData {
  email: string;
  role: string;
  avatar: string;
}

const InviteMemberModal = ({ isOpen, onClose, roles }: InviteMemberModalProps) => {
  const [step, setStep] = useState(1);
  const [inviteData, setInviteData] = useState<InviteData>({
    email: "",
    role: "",
    avatar: "",
  });
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = async () => {
    if (step === 1 && inviteData.email) {
      if (!emailRegex.test(inviteData.email)) {
        setEmailError("Invalid email");
        return;
      }

      try {
        const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(inviteData.email)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (!data.exists) {
          setEmailError("User not registered");
          return;
        }

        setInviteData(prev => ({
          ...prev,
          avatar: data.avatar || "/default-avatar.jpg"
        }));
      } catch (error) {
        setEmailError("Error verifying user");
        return;
      }
    }
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => step > 1 && setStep(prev => prev - 1);

  const handleInvite = async () => {
    try {
    const response = await fetch('/api/users/invite', {
      method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: inviteData.email,
        role: inviteData.role
      })
      });
    if (!response.ok) throw new Error('Invite failed');
    // Reset and close modal
    onClose();
      setStep(1);
      setInviteData({ email: "", role: "", avatar: "" });
    } catch (error) {
      console.error("Invite failed:", error);
    }
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
                    onChange={(e) => setInviteData(prev => ({
                      ...prev,
                      email: e.target.value,
                      avatar: ""
                    }))}
                    className="w-full p-2 border rounded-md"
                    placeholder="user@example.com"
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
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
                    onChange={(e) => setInviteData(prev => ({
                      ...prev,
                      role: e.target.value
                    }))}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
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