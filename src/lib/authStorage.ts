const TOKEN_KEY = 'vivah_auth_token';
const FORCE_PASSWORD_CHANGE_KEY = 'vivah_force_password_change';

export const authStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(TOKEN_KEY);
  },
  getForcePasswordChange(): boolean {
    return sessionStorage.getItem(FORCE_PASSWORD_CHANGE_KEY) === 'true';
  },
  setForcePasswordChange(value: boolean): void {
    if (value) {
      sessionStorage.setItem(FORCE_PASSWORD_CHANGE_KEY, 'true');
      return;
    }
    sessionStorage.removeItem(FORCE_PASSWORD_CHANGE_KEY);
  }
};
