import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Auth.js";

const PublicRoute = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const result = await isAuthenticated();
      setAuthState(result.authenticated);
    };
    verify();
  }, []);

  if (authState === null) return null;

  if (authState.authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;