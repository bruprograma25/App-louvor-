import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Siderbar from "../components/Siderbar";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Members from "../pages/Members";
import MinstrationsImproved from "../pages/MinstrationsImproved";
import SongsImproved from "../pages/SongsImproved";
import CalendarPage from "../pages/Calendar";
import NotificationsImproved from "../pages/NotificationsImproved";
import ProcessesImproved from "../pages/ProcessesImproved";
import Devotional from "../pages/Devotional";
import Church from "../pages/Church";
import Beginners from "../pages/Beginners";
import Profile from "../pages/Profile";
import Setlist from "../pages/Setlist";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Siderbar />
        <div className="flex-1 p-6 lg:p-8">
          <Header />
          <main className="mt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Carregando...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="songs" element={<SongsImproved />} />
            <Route path="notifications" element={<NotificationsImproved />} />
            <Route path="members" element={<Members />} />
            <Route path="processes" element={<ProcessesImproved />} />
            <Route path="devotional" element={<Devotional />} />
            <Route path="church" element={<Church />} />
            <Route path="beginners" element={<Beginners />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ministrations" element={<MinstrationsImproved />} />
            <Route path="setlist" element={<Setlist />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
