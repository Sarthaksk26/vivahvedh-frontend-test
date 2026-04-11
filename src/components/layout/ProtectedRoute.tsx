import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('vivah_auth_token');
  
  if (!token) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes (e.g., Dashboard)
  return <Outlet />;
}
