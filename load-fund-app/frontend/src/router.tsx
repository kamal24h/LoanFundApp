import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardMember from "./pages/DashboardMember";
import DashboardAdmin from "./pages/DashboardAdmin";

function PrivateRoute({ children, role }: { children: JSX.Element; role?: string }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role && userRole !== role) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/member"
          element={
            <PrivateRoute role="member">
              <DashboardMember />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <DashboardAdmin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
