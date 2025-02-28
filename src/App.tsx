import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./features/auth/Login";
import Ai from "./pages/Ai";
import Members from "./pages/Members";
import Graphs from "./pages/Graphs";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import { ThemeProvider } from "./components/theme-provider";
import Register from "./features/auth/Register";

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
