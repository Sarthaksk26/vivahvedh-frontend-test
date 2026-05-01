import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../../lib/authStorage';

export default function ProtectedRoute() {
  const token = authStorage.getToken();
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect forced password change
  if (authStorage.getForcePasswordChange() && 
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
