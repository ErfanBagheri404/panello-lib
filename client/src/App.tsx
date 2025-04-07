import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Ai from "./pages/Ai";
import Members from "./pages/Members";
import Graphs from "./pages/Graphs";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import { ThemeProvider } from "./components/theme-provider";
import Register from "./pages/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LanguageProvider, useLanguage } from "./components/language-provider";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {

  return (
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

const AppContent = () => {
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    return token ? <>{children}</> : <Navigate to="/login" />;
  };

  // New component for role-based access control
  const RoleProtectedRoute = ({ 
    children, 
    allowedRoles 
  }: { 
    children: React.ReactNode, 
    allowedRoles: string[] 
  }) => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
      const fetchUserRole = async () => {
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const response = await fetch("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          } else {
            console.error("Failed to fetch user role");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserRole();
    }, [token]);

    if (!token) return <Navigate to="/login" />;
    if (loading) return <div>Loading...</div>;
    
    // Check if user's role is in the allowed roles
    const hasAccess = userRole && allowedRoles.includes(userRole);
    
    return hasAccess ? <>{children}</> : <Navigate to="/dashboard" />;
  };

  const { direction, language } = useLanguage();

  return (
    <div lang={language} dir={direction}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Route - Auto-redirect */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai" element={<Ai />} />
            
            {/* Role-protected route for Members page */}
            <Route 
              path="/members" 
              element={
                <RoleProtectedRoute allowedRoles={["owner", "co-owner", "administrator", "moderator"]}>
                  <Members />
                </RoleProtectedRoute>
              } 
            />
            
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
