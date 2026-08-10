const TOKEN_KEY = "admin_jwt_token";
const ADMIN_USER_KEY = "admin_user_info";

export interface AdminUser {
  id: string;
  email: string;
}

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, user?: AdminUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    }
  },

  getUser(): AdminUser | null {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check basic JWT expiry if payload exists
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return false;
      const decoded = JSON.parse(atob(payloadBase64));
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },
};
