import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import AdminRoute from "./security/AdminRoute";
import PublicRoute from "./security/PublicRoute";
import ProtectedRoute from "./security/ProtectedRoute";
import Loader from "./components/Loader";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Chats = lazy(() => import("./pages/Chats"));
const AccountLock = lazy(() => import("./pages/AccountLock"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

const App = () => {
  return (
    <>
      <main>
        <Suspense
          fallback={
            <Loader className="flex items-center justify-center h-screen text-white bg-black" />
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/system-locked" element={<AccountLock />} />
            <Route
              path="/admin"
              element={
                // <AdminRoute>
                  <AdminDashboard />
                // {/* </AdminRoute> */}
              }
            />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default App;