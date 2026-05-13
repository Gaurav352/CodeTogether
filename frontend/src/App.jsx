import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

// Pages & Components
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import AuthPage from './Pages/AuthPage';
import GlobalLoader from './components/GlobalLoader';

// Stores
import useAuthStore from './zustand/authStore';

function App() {
  const { authUser, getMe, checkAuth, checkingAuth } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const initApp = async () => {
      const start = Date.now();

      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        const elapsed = Date.now() - start;
        const remainingTime = Math.max(1500 - elapsed, 0);

        setTimeout(() => {
          setIsInitializing(false);
        }, remainingTime);
      }
    };

    initApp();
  }, [checkAuth]);

  if (checkingAuth || isInitializing) {
    return <GlobalLoader />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path='/' element={<LandingPage />} />

        {/* Protected Dashboard Route  */}
        <Route
          path='/dashboard'
          element={authUser ? <Dashboard /> : <Navigate to="/authPage" />}
        />

        {/* Auth Page Route: Redirect to dashboard if already logged in  */}
        <Route
          path='/authPage'
          element={!authUser ? <AuthPage /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;