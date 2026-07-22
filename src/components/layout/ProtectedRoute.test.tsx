import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { authStorage } from '../../lib/authStorage';

describe('ProtectedRoute', () => {
  afterEach(() => {
    authStorage.clearSession();
    authStorage.setForcePasswordChange(false);
  });

  it('redirects unauthenticated users to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content for authenticated users', () => {
    authStorage.setUser({
      regId: 'VIVAH12345',
      role: 'USER',
      status: 'ACTIVE',
      planType: 'FREE',
      requiresPasswordChange: false
    });
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects admin to /admin when accessing /dashboard without forced password change', () => {
    authStorage.setUser({
      regId: 'VV-ADMIN1',
      role: 'ADMIN',
      status: 'ACTIVE',
      planType: 'GOLD',
      requiresPasswordChange: false
    });
    authStorage.setForcePasswordChange(false);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/admin" element={<div>Admin Panel</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('allows admin on /dashboard when forced password change is required', () => {
    authStorage.setUser({
      regId: 'VV-ADMIN1',
      role: 'ADMIN',
      status: 'ACTIVE',
      planType: 'GOLD',
      requiresPasswordChange: true
    });
    authStorage.setForcePasswordChange(true);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/admin" element={<div>Admin Panel</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
