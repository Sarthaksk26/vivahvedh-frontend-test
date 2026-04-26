import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('vivah_auth_token');
  const location = useLocation();
  const isForced = localStorage.getItem('vivah_force_password_change') === 'true';
  
  if (!token) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  // If password change is forced, only allow them on the dashboard
  if (isForced && location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  // If token exists and no forced change, render the child routes (e.g., Dashboard)
  return <Outlet />;
}
