// src/services/api.js
// Lightweight fetch-based API wrapper with mock-mode (no axios required)

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_BASE = import.meta.env.VITE_API_BASE || "";

/* small helper for fetch json + error */
async function fetchJson(path, options = {}) {
  const url = (path.startsWith("http") ? path : API_BASE + path);
  const res = await fetch(url, options);
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) { /* ignore */ }
    const err = new Error(body?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.body = body;
    throw err;
  }
  // some endpoints may return empty body
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

/* -----------------------
   Mock helpers (same behaviour as axios mock you had)
   ----------------------- */
const mockStorageKey = "kirshify_mock_user";
const mockUsersKey = "kirshify_mock_users_v1";

function initMockUsers() {
  const raw = localStorage.getItem(mockUsersKey);
  if (raw) return JSON.parse(raw);
  const names = ["Amit", "Riya", "Suresh", "Neha", "Vikram", "Priya", "Rahul", "Karan"];
  const users = Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    name: names[i % names.length] + " " + (i + 1),
    email: `user${i + 1}@kirshify.com`,
    role: ["viewer", "manager", "admin"][(i + 1) % 3],
    lastLogin: `${Math.floor(Math.random() * 10) + 1} days ago`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  localStorage.setItem(mockUsersKey, JSON.stringify(users));
  return users;
}
function getMockUsers() { return initMockUsers(); }
function saveMockUsers(list) { localStorage.setItem(mockUsersKey, JSON.stringify(list)); }

async function mockLogin({ email, password }) {
  await new Promise((r) => setTimeout(r, 400));
  if (email === "admin@kirshify.com" && password === "Password123") {
    const user = { id: "1", name: "Kirshify Admin", email, role: "superadmin" };
    localStorage.setItem(mockStorageKey, JSON.stringify(user));
    return { user };
  }
  const err = new Error("Invalid credentials");
  err.status = 401;
  throw err;
}
async function mockLogout() { await new Promise((r)=>setTimeout(r,200)); localStorage.removeItem(mockStorageKey); return { ok: true }; }
async function mockMe() { await new Promise((r)=>setTimeout(r,200)); const raw = localStorage.getItem(mockStorageKey); if (!raw) { const e = new Error("Not authorized"); e.status = 401; throw e } return { user: JSON.parse(raw) }; }
async function mockGetUsers({ page = 1, perPage = 10, q = "" } = {}) {
  await new Promise((r)=>setTimeout(r,250));
  let list = getMockUsers();
  if (q) {
    const s = q.toLowerCase();
    list = list.filter(u => (u.name + u.email + u.role).toLowerCase().includes(s));
  }
  const total = list.length;
  const start = (page - 1) * perPage;
  const items = list.slice(start, start + perPage);
  return { items, total, page, perPage };
}
async function mockDeleteUser(id) { await new Promise(r=>setTimeout(r,200)); const list = getMockUsers().filter(u => u.id !== String(id)); saveMockUsers(list); return { ok: true }; }
async function mockGetStats() { await new Promise(r=>setTimeout(r,200)); const users = getMockUsers().length; return { users, activeFarms: Math.floor(users * 0.33), revenue: users * 150 }; }

/* -----------------------
   Exported wrapper (fetch-based)
   ----------------------- */
export default {
  // POST wrapper
  async post(path, payload, cfg = {}) {
    if (USE_MOCK && path === "/api/auth/login") return { data: await mockLogin(payload) };
    if (USE_MOCK && path === "/api/admin/users/import") return { data: { ok: true } };
    const init = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(cfg.headers || {}) },
      body: payload ? JSON.stringify(payload) : undefined,
      ...cfg,
    };
    const data = await fetchJson(path, init);
    return { data };
  },

  async get(path, cfg = {}) {
    if (USE_MOCK && path === "/api/auth/me") return { data: await mockMe() };
    if (USE_MOCK && path === "/api/admin/users") return { data: await mockGetUsers(cfg.params || {}) };
    if (USE_MOCK && path === "/api/admin/stats") return { data: await mockGetStats() };
    const q = cfg && cfg.params ? "?" + new URLSearchParams(cfg.params).toString() : "";
    const data = await fetchJson(path + q, { method: "GET", credentials: "include", headers: cfg.headers || {} });
    return { data };
  },

  async delete(path, cfg = {}) {
    if (USE_MOCK && path.startsWith("/api/admin/users/")) {
      const id = path.split("/").pop();
      return { data: await mockDeleteUser(id) };
    }
    if (USE_MOCK && path === "/api/auth/logout") return { data: await mockLogout() };
    const data = await fetchJson(path, { method: "DELETE", credentials: "include", headers: cfg.headers || {} });
    return { data };
  },

  async put(path, payload, cfg = {}) {
    const init = { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", ...(cfg.headers || {}) }, body: JSON.stringify(payload), ...cfg };
    const data = await fetchJson(path, init);
    return { data };
  },

  rawFetch: fetchJson,
};
