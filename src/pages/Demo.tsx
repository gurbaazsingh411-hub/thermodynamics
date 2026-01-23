import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Index from './Index';

const Demo = () => {
  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    // Initialize auth in demo mode
    initializeAuth();
  }, [initializeAuth]);
  
  return <Index />;
};

export default Demo;