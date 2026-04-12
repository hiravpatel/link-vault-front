const USER_KEY = 'lv_user';

let accessToken = null;

function emit(name, detail = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
  emit('lv:token-changed', { token: accessToken });
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  emit('lv:user-changed', { user });
}

export function saveSession({ accessToken: nextToken, user }) {
  if (nextToken) {
    setAccessToken(nextToken);
  }
  if (user) {
    setStoredUser(user);
  }
}

export function clearSession() {
  accessToken = null;

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(USER_KEY);
  }

  emit('lv:auth-cleared');
}
