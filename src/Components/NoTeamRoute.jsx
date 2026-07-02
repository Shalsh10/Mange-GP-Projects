import { Navigate } from "react-router-dom";

export default function NoTeamRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // لو عنده تيم
  if (user.has_team) {
    return <Navigate to="/" replace />;
  }

  return children;
}