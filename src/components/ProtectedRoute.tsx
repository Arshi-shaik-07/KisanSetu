import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { user, ready, pendingTwoFactor } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="p-10 text-center text-slate-500 text-sm">Loading account…</div>;
  }
  if (!user || pendingTwoFactor) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "farmer" ? "/farmer" : "/marketplace"} replace />;
  }
  return children;
}
