import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../../lib/authStorage';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
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

  const user = authStorage.getUser();

  // Redirect non-admin users trying to access admin routes
  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect admin away from user dashboard
  if (!adminOnly && user?.role === 'ADMIN' && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
