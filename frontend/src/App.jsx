import { Routes, Route } from "react-router-dom";
import PublicRoute from "./security/PublicRoute";
import ProtectedRoute from "./security/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./pages/Chats";

const App = () => {
  return (
    <>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          ></Route>
        </Routes>
      </main>
    </>
  );
};

export default App;