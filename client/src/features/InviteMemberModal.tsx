import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTheme } from "../components/theme-provider";
import { useLanguage } from "../components/language-provider";
import translations from "../data/translations";
import { InviteData, InviteMemberModalProps } from "../types";


const InviteMemberModal = ({
  isOpen,
  onClose,
  roles,
}: InviteMemberModalProps) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1);
  const [inviteData, setInviteData] = useState<InviteData>({
    email: "",
    role: "",
    avatar: "",
  });
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { language } = useLanguage();

  const handleNext = async () => {
    console.log("handleNext called, current step:", step);
    if (step === 1 && inviteData.email) {
      if (!emailRegex.test(inviteData.email)) {
        console.log("Invalid email format:", inviteData.email);
        setEmailError("Invalid email");
        return;
      }

      try {
        console.log("Checking email existence for:", inviteData.email);
        const response = await fetch(
          `/api/users/check-email?email=${encodeURIComponent(
            inviteData.email
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log("Check-email response data:", data);
        if (!data.exists) {
          setEmailError("User not registered");
          return;
        }
        setInviteData((prev) => ({
          ...prev,
          avatar: data.avatar || "/default-avatar.jpg",
        }));
        setEmailError("");
      } catch (error) {
        console.error("Error verifying user:", error);
        setEmailError("Error verifying user");
        return;
      }
    }
    if (step < 3) {
      console.log("Proceeding to next step:", step + 1);
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      console.log("Going back from step:", step);
      setStep((prev) => prev - 1);
    }
  };

  const handleInvite = async () => {
    console.log("handleInvite called with inviteData:", inviteData);
    try {
      const response = await fetch(`/api/users/invite`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: inviteData.email,
          role: inviteData.role.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Invite error response:", errorData);
        throw new Error(errorData.error || "Invite failed");
      }
      console.log("Invite succeeded");
      setStep(1);
      setInviteData({ email: "", role: "", avatar: "" });
      onClose();
    } catch (error) {
      console.error("Invite failed:", error);
      alert(error instanceof Error ? error.message : "Invite failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
            theme === "dark" ? "text-gray-100" : "text-gray-900"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`rounded-xl p-6 w-96 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {translations[language].inviteMember}
              </h2>
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
                  <label className="block text-sm mb-2">
                    {translations[language].emailAddress}
                  </label>
                  <input
                    type="email"
                    value={inviteData.email}
                    onChange={(e) =>
                      setInviteData((prev) => ({
                        ...prev,
                        email: e.target.value,
                        avatar: "",
                      }))
                    }
                    className={`w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-black/30 text-gray-900"
                    }`}
                    placeholder={translations[language].emailPlaceholder}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">
                      {translations[language].userNotRegistered}
                    </p>
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
                  <label className="block text-sm mb-2">
                    {translations[language].selectRole}
                  </label>
                  <select
                    className={`w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-black/30 text-gray-900"
                    }`}
                    value={inviteData.role}
                    onChange={(e) =>
                      setInviteData((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                  >
                    <option value="">
                      {translations[language].selectRolePlaceholder}
                    </option>
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
                      className="w-16 h-16 rounded-full mb-2 object-cover"
                    />
                    <p>
                      <strong>{translations[language].emailLabel}:</strong>{" "}
                      {inviteData.email}
                    </p>
                    <p>
                      <strong>{translations[language].roleLabel}:</strong>{" "}
                      {inviteData.role}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className={`px-3 py-1 rounded-md ${
                    theme === "dark"
                      ? "bg-gray-600 text-gray-100"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {translations[language].backButton}
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
                      : theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {translations[language].nextButton}
                </button>
              ) : (
                <button
                  onClick={handleInvite}
                  className={`px-3 py-1 rounded-md ${
                    theme === "dark"
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {translations[language].inviteButton}
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
