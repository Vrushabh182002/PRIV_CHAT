// import { Navigate } from "react-router-dom";
// import { isAuthenticated } from "./Auth.js";

// const ProtectedRoute = ({ children }) => {
//   if (!isAuthenticated()) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

// src/security/ProtectedRoute.jsx

import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./Auth.js";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const result = await isAuthenticated(); // result is always an object
      setAuthState(result);
    };
    verify();
  }, []);

  // Still waiting for /check-auth response — render nothing, no flash
  if (authState === null) return null;

  // Server said no valid cookie → go to login
  if (!authState.authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Valid session → render the page
  return children;
};

export default ProtectedRoute;