import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import Index from './Index';

const Dashboard = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const initializedRef = useRef(false);
  
  useEffect(() => {
    // Initialize auth when dashboard loads, but only once
    if (!initializedRef.current) {
      initializeAuth();
      initializedRef.current = true;
    }
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the main application if authenticated
  return <Index />;
};

export default Dashboard;