import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Pages/Dashboard";
import RoomPage from "./Pages/RoomPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import LoadingScreen from "./components/LoadingScreen";
import useAuthStore from "./zustand/authStore";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "./components/GlobalLoader";

function App() {
  const { authUser, checkAuth, authLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (authLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!authUser ? <LoginPage />:<Navigate to="/"/>} />
        <Route path="/register" element={!authUser ? <RegisterPage />:<Navigate to="/"/>} />

        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/room"
          element={authUser ? <RoomPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
