import type { StoredUser } from '../types';

const FORCE_PASSWORD_CHANGE_KEY = 'vivah_force_password_change';
const USER_KEY = 'vivah_user';

export const authStorage = {
  /**
   * Authentication is now cookie-based (HttpOnly).
   * We check for a stored user object as a proxy for login state.
   * The actual auth enforcement is done server-side via cookies.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(USER_KEY);
  },

  getForcePasswordChange(): boolean {
    return localStorage.getItem(FORCE_PASSWORD_CHANGE_KEY) === 'true';
  },

  setForcePasswordChange(value: boolean): void {
    if (value) {
      localStorage.setItem(FORCE_PASSWORD_CHANGE_KEY, 'true');
      return;
    }
    localStorage.removeItem(FORCE_PASSWORD_CHANGE_KEY);
  },

  getUser(): StoredUser | null {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user) as StoredUser;
    } catch {
      return null;
    }
  },

  setUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Clears all client-side session data.
   * Called on logout or when refresh token fails.
   */
  clearSession(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FORCE_PASSWORD_CHANGE_KEY);
  },
};
