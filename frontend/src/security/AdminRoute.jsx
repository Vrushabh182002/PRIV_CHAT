import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Auth.js";

const AdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const result = await isAuthenticated();
      setAuthState(result);
    };

    verify();
  }, []);

  // Waiting for backend response
  if (authState === null) return null;

  // Not logged in
  if (!authState.authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (authState.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Admin authenticated
  return children;
};

export default AdminRoute;
