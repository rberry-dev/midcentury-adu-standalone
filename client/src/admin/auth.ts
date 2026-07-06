const STORAGE_KEY = "hemma_admin_token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  localStorage.setItem(STORAGE_KEY, token);
  window.dispatchEvent(new Event("hemma_admin_token_changed"));
}

export function clearAdminToken(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("hemma_admin_token_changed"));
}
