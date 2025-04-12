import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../theme-provider";
import { CalendarEvent, EventModalProps, UserOptionsPopupType } from "../../types";
import { useLanguage } from "../language-provider";
import translations from "../../data/translations";
import axios from "axios";


export const OptionsPopup = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onClose,
}: EventModalProps) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const { language } = useLanguage();
  
  // Add state for users
  const [users, setUsers] = useState<UserOptionsPopupType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        
        // Get current user ID
        const currentUserResponse = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Get all users
        const usersResponse = await axios.get('/api/users/members', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Filter out current user
        const usersList = usersResponse.data.filter(
          (user: any) => user.id !== currentUserResponse.data._id
        );
        
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds(prev => {
      return prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const duration = end.getTime() - start.getTime();
    const minDuration = 90 * 60 * 1000;

    if (duration < minDuration) {
      setError("Event duration must be at least 1 hour and 30 minutes");
      return;
    }
    setError("");

    if (isEditing && currentEvent) {
      const updatedEvent = {
        ...currentEvent,
        title,
        description,
        start,
        end,
        sharedWith: selectedUserIds
      };
      onEditEvent(updatedEvent);
    } else {
      onAddEvent({
        title,
        description,
        start,
        end,
        sharedWith: selectedUserIds
      });
    }

    resetForm();
    onClose();
  };

  const handleEditClick = (event: CalendarEvent) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setTitle(event.title);
    setDescription(event.description || "");
    setStartDate(event.start.toISOString().split("T")[0]);
    setStartTime(event.start.toTimeString().split(" ")[0].substring(0, 5));
    setEndDate(event.end.toISOString().split("T")[0]);
    setEndTime(event.end.toTimeString().split(" ")[0].substring(0, 5));
    
    // Set selected users if available
    if ((event as any).sharedWith) {
      setSelectedUserIds((event as any).sharedWith);
    } else {
      setSelectedUserIds([]);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentEvent(null);
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setSelectedUserIds([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        className={`rounded-lg p-6 max-w-2xl w-full mx-4 overflow-y-auto scrollbar-hide ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditing
            ? translations[language].editEvent
            : translations[language].createEvent}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              {translations[language].eventTitle}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              {translations[language].description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
              rows={3}
            />
          </div>

          {/* Time and date inputs remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date Input */}
            <div>
              <label className="block mb-2">
                {translations[language].startDate}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // Auto-adjust end date if start date changes
                  if (new Date(e.target.value) > new Date(endDate)) {
                    setEndDate(e.target.value);
                  }
                }}
                className={`w-full p-2 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
                required
              />
            </div>

            {/* Start Time Input */}
            <div>
              <label className="block mb-2">
                {translations[language].startTime}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  // Auto-adjust end time
                  const startDateTime = new Date(
                    `${startDate}T${e.target.value}`
                  );
                  const minEndDateTime = new Date(
                    startDateTime.getTime() + 5400000
                  );
                  const currentEndDateTime = new Date(`${endDate}T${endTime}`);

                  if (currentEndDateTime < minEndDateTime) {
                    setEndDate(minEndDateTime.toISOString().split("T")[0]);
                    setEndTime(minEndDateTime.toTimeString().substr(0, 5));
                  }
                }}
                className={`w-full p-2 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* End Date Input */}
            <div>
              <label className="block mb-2">
                {translations[language].endDate}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  const endDateTime = new Date(`${e.target.value}T${endTime}`);
                  const startDateTime = new Date(`${startDate}T${startTime}`);

                  if (endDateTime < startDateTime) {
                    setError("End date cannot be before start date");
                  } else {
                    setError("");
                  }
                }}
                className={`w-full p-2 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
                required
              />
            </div>

            {/* End Time Input */}
            <div>
              <label className="block mb-2">
                {translations[language].endTime}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  const endDateTime = new Date(`${endDate}T${e.target.value}`);
                  const startDateTime = new Date(`${startDate}T${startTime}`);
                  const duration =
                    endDateTime.getTime() - startDateTime.getTime();

                  if (duration < 5400000) {
                    setError(
                      "Event duration must be at least 1 hour and 30 minutes"
                    );
                    // Auto-adjust end time
                    const minEndDateTime = new Date(
                      startDateTime.getTime() + 5400000
                    );
                    setEndDate(minEndDateTime.toISOString().split("T")[0]);
                    setEndTime(minEndDateTime.toTimeString().substr(0, 5));
                  } else {
                    setError("");
                    setEndTime(e.target.value);
                  }
                }}
                className={`w-full p-2 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2 col-span-full">
              {translations[language].eventDurationError}
            </div>
          )}

          {/* Add user selection section */}
          <div className={`mt-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            <h3 className="text-lg font-semibold mb-2">
              Share with Users
            </h3>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users available</p>
              ) : (
                users.map(user => (
                  <div 
                    key={user.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUserIds.includes(user.id) 
                        ? theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100' 
                        : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => {}} // Handled by the div click
                      className="mr-2"
                    />
                    <img 
                      src={user.avatar} 
                      alt={`${user.name}'s avatar`}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span>{user.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              {translations[language].cancelButton}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-500"
              }`}
            >
              {isEditing
                ? translations[language].saveChanges
                : translations[language].createEvent}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            {translations[language].existingEvents}
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg flex justify-between items-center ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {event.start.toLocaleString(translations[language].locale)}{" "}
                    - {event.end.toLocaleString(translations[language].locale)}
                  </p>
                  {event.description && (
                    <p className="text-sm mt-1">{event.description}</p>
                  )}
                  {/* Show shared users if any */}
                  {(event as any).sharedWith && (event as any).sharedWith.length > 0 && (
                    <p className="text-xs mt-1 text-blue-500">
                      Shared with {(event as any).sharedWith.length} user(s)
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(event)}
                    className={`px-3 py-1 rounded ${
                      theme === "dark" ? "bg-gray-600" : "bg-gray-200"
                    }`}
                  >
                    {translations[language].editButton}
                  </button>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className={`px-3 py-1 rounded text-white ${
                      theme === "dark" ? "bg-red-600" : "bg-red-500"
                    }`}
                  >
                    {translations[language].deleteButton}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
