const BASE = 'http://localhost:5000/api';

// ── Session (localStorage) ────────────────────────────────────
export const saveSession  = (token, user) => {
  localStorage.setItem('mcnt_token', token);
  localStorage.setItem('mcnt_user',  JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem('mcnt_token');
  localStorage.removeItem('mcnt_user');
};
export const getSession   = () => {
  const token = localStorage.getItem('mcnt_token');
  const raw   = localStorage.getItem('mcnt_user');
  if (!token || !raw) return null;
  try { return { token, user: JSON.parse(raw) }; }
  catch { return null; }
};

// ── Fetch interne (injecte automatiquement le token JWT) ──────
const call = async (path, options = {}) => {
  const token   = localStorage.getItem('mcnt_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Erreur HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

// ── API publique ───────────────────────────────────────────────
export const api = {
  get:    (path)       => call(path),
  post:   (path, body) => call(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (path, body) => call(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (path)       => call(path, { method: 'DELETE' }),
  upload: async (path, file) => {
    const token = localStorage.getItem('mcnt_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erreur HTTP ${res.status}`);
    }
    return res.json();
  }
};
