import React from 'react';
import { Navigate } from 'react-router-dom';

const MainApp: React.FC = () => {
  // Redirect to dashboard since the actual dashboard is now in DashboardPage
  return <Navigate to="/dashboard" />;
};

export default MainApp;