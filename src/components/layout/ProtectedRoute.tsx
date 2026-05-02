import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../../lib/authStorage';

export default function ProtectedRoute() {
  const isAuth = authStorage.isAuthenticated();
  const location = useLocation();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Redirect forced password change
  if (authStorage.getForcePasswordChange() && 
      location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect admin away from user dashboard
  const user = authStorage.getUser();
  if (user?.role === 'ADMIN' && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
