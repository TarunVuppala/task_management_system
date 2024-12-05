import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Spinner } from './components/ui/spinner';

import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import TaskManager from '@/pages/TaskManager';

import useAppStore from '@/store/useAppStore';

function App() {
  const { isAuthenticated, isLoadingToken, verifyToken } = useAppStore();

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  if (isLoadingToken) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <TaskManager />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;