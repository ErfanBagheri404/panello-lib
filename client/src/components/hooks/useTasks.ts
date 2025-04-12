import { useState, useEffect } from "react";
import axios from "axios";
import { ITask } from "../../types";

const API_URL = "http://localhost:5000/api/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  // Update your fetchTasks function in useTasks.ts
  // Inside your fetchTasks function, make sure it's correctly fetching all tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Set the tasks
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (
    taskData: Omit<ITask, "_id" | "user" | "createdAt" | "updatedAt">
  ) => {
    try {
      const token = localStorage.getItem("token");
      
      // Get current user ID
      const currentUserResponse = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const currentUserId = currentUserResponse.data._id;
      
      // Add current user to assignedTo if it doesn't already exist
      const assignedTo = taskData.assignedTo || [];
      if (!assignedTo.includes(currentUserId)) {
        assignedTo.push(currentUserId);
      }
      
      const response = await axios.post(API_URL, {
        ...taskData,
        assignedTo
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setTasks((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<ITask>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
};
