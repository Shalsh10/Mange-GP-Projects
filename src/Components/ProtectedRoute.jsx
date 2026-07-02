import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuth, user } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // التحقق من الصلاحيات (سيتم تجاهله لأننا وضعنا الـ return children في الأعلى)
  if (allowedRole && user?.role_code !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}