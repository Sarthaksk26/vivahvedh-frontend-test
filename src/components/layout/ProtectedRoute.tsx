import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('vivah_auth_token');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect forced password change
  if (localStorage.getItem('vivah_force_password_change') === 'true' && 
      location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect admin away from user dashboard
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === 'ADMIN' && location.pathname === '/dashboard') {
      return <Navigate to="/admin" replace />;
    }
  } catch { /* invalid token, let it through to be handled */ }

  return <Outlet />;
}
