import React from "react";
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
            <Route path="/members" element={<Members />} />
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
