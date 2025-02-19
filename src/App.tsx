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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

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
  );
};

export default App;
