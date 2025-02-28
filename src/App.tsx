import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import { ThemeProvider } from "./components/theme-provider";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./features/auth/Login"));
const Ai = lazy(() => import("./pages/Ai"));
const Members = lazy(() => import("./pages/Members"));
const Graphs = lazy(() => import("./pages/Graphs"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Messages = lazy(() => import("./pages/Messages"));
const Register = lazy(() => import("./features/auth/Register"));

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai" element={<Ai />} />
            <Route path="/members" element={<Members />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
