import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute; 