import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "./components/DataTable";
import logo from "./assets/kirshify.jpeg"; 

// Kirshify Admin Frontend (clean, plain JS + React)

// Small SVG icons
const IconStats = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 13v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 5v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconUsers = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 21v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Mock API helpers (replace with real API calls to Express + MongoDB later)
const mockLogin = async ({ email, password }) => {
  await new Promise((r) => setTimeout(r, 700));
  if (email === "admin@kirshify.com" && password === "Password123") {
    return { ok: true, name: "Kirshify Admin" };
  }
  return { ok: false, error: "Invalid credentials" };
};

const mockFetchStats = async () => {
  await new Promise((r) => setTimeout(r, 400));
  return {
    users: 1284,
    activeFarms: 312,
    revenue: 18420,
  };
};

const mockFetchUsers = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return new Array(8).fill(0).map((_, i) => ({
    id: i + 1,
    name: ["Amit", "Riya", "Suresh", "Neha", "Vikram", "Priya", "Rahul", "Karan"][i],
    email: `user${i + 1}@kirshify.com`,
    role: ["viewer", "manager", "admin", "viewer", "manager", "viewer", "admin", "manager"][i],
    lastLogin: `${Math.floor(Math.random() * 10) + 1} days ago`,
  }));
};

// Layout components
const Topbar = ({ name, onLogout, onToggle }) => (
  <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-500 text-white p-3 sm:p-4 rounded-xl shadow-md">
    <div className="flex items-center gap-3">
      <button className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20" onClick={onToggle} aria-label="open menu">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div>
        <div className="text-xs opacity-80">Welcome back</div>
        
        <div className="font-semibold text-sm sm:text-base">{name || "—"}</div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex gap-3 items-center bg-white/10 p-2 rounded-md">
        <IconStats />
        <div className="text-sm">Live</div>
      </div>
      <button onClick={onLogout} className="bg-white text-green-600 font-semibold px-3 py-2 rounded-md shadow-sm hidden sm:inline-block">
        Logout
      </button>
    </div>
  </div>
);

const Sidebar = ({ active, onNav }) => (
  <aside className="w-72 bg-white/5 backdrop-blur-md p-4 rounded-xl space-y-4">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/10">
        <img src={logo} alt="Kirshify" className="w-10 h-auto rounded-3xl border-1 black-indigo-500" />
      </div>
      <div>
        
        <div className="text-sm opacity-80">Kirshify</div>
        <div className="font-bold text-lg">Admin Panel</div>
      </div>
    </div>

    <nav className="space-y-1">
      <NavItem label="Dashboard" active={active === "dashboard"} onClick={() => onNav("dashboard")} icon={<IconStats />} />
      <NavItem label="Users" active={active === "users"} onClick={() => onNav("users")} icon={<IconUsers />} />
      <NavItem label="Settings" active={active === "settings"} onClick={() => onNav("settings")} icon={<SettingsIcon />} />
    </nav>

    <div className="mt-6 text-xs opacity-80">Tip: enable MFA for superadmins in settings.</div>
  </aside>
);

const NavItem = ({ label, active, onClick, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${active ? "bg-white/10 scale-100" : "hover:bg-white/5"}`}>
    <div className="text-green-300">{icon}</div>
    <div className="flex-1 text-left">{label}</div>
    {active && <div className="text-xs opacity-70">•</div>}
  </button>
);

function SettingsIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.7 17.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.67 0 1.24-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.12 2.7l.06.06a1.65 1.65 0 0 0 1.82.33h.09c.67 0 1.24-.4 1.51-1V3a2 2 0 1 1 4 0v.09c.27.6.84 1 1.51 1h.09c.7 0 1.34.27 1.82.72l.06.06A2 2 0 1 1 21.3 6.12l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.4.27 1 .84 1 1.51V11a2 2 0 1 1 0 4h-.09c-.6 0-1.24.4-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Pages
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await mockLogin({ email, password });
    setLoading(false);
    if (res.ok) onLogin({ name: res.name, email });
    else setError(res.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-lg bg-emerald-50">
            <img src={logo} alt="Kirshify" className="w-15 h-auto rounded-4xl border-1 black-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Kirshify Admin</h1>
            <p className="text-sm opacity-70">Secure admin access — manage users, view stats, and more.</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="admin@kirshify.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Password" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between gap-4">
            <button disabled={loading} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:scale-[1.01] transition-transform">
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <a className="text-sm text-emerald-600 hover:underline" href="#">
              Forgot?
            </a>
          </div>

          <div className="text-xs opacity-70">
            Demo credentials: <span className="font-medium">admin@kirshify.com / Password123</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DashboardPage = ({ name }) => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let mounted = true;
    mockFetchStats().then((s) => {
      if (mounted) setStats(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Total Users</div>
              <div className="text-2xl font-bold">{stats ? stats.users : "—"}</div>
            </div>
            <div className="p-2 rounded-md bg-white/8">
              <IconUsers className="w-6 h-6" />
            </div>
          </div>
          <div className="text-sm mt-3 opacity-70">Active today: {Math.floor(Math.random() * 50) + 10}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Active Farms</div>
              <div className="text-2xl font-bold">{stats ? stats.activeFarms : "—"}</div>
            </div>
            <div className="p-2 rounded-md bg-white/8">
              <IconStats />
            </div>
          </div>
          <div className="text-sm mt-3 opacity-70">New this week: {Math.floor(Math.random() * 20) + 2}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="p-4 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Revenue (₹)</div>
              <div className="text-2xl font-bold">{stats ? stats.revenue.toLocaleString() : "—"}</div>
            </div>
            <div className="p-2 rounded-md bg-white/8">₹</div>
          </div>
          <div className="text-sm mt-3 opacity-70">This month vs last: +{Math.floor(Math.random() * 15)}%</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="p-3 rounded-lg bg-emerald-600 text-white font-medium w-full">Invite Admin</button>
            <button className="p-3 rounded-lg bg-white/8 w-full">Export Users</button>
            <button className="p-3 rounded-lg bg-white/8 w-full">Run Backup</button>
            <button className="p-3 rounded-lg bg-white/8 w-full">View Audit Logs</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2 text-sm opacity-80">
            <div className="p-2 rounded-md bg-white/6">User Amit updated their profile — 2h ago</div>
            <div className="p-2 rounded-md bg-white/6">New farm registered (Vikram) — 4h ago</div>
            <div className="p-2 rounded-md bg-white/6">Password changed for admin@kirshify.com — 1d ago</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    mockFetchUsers().then((u) => {
      if (mounted) {
        setUsers(u);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="text-sm opacity-80">Total: {users.length}</div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-sm bg-white/5">
        <div className="overflow-x-auto" data-touch-scroll>
          <table className="w-full table-auto min-w-[640px]">
            <thead className="text-xs text-left opacity-70 uppercase bg-white/6">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Last Login</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading…
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t border-white/6 hover:bg-white/3 transition-colors">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3 text-sm opacity-80">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.role === "admin" ? "bg-emerald-600 text-white" : "bg-white/8"}`}>{u.role}</span>
                    </td>
                    <td className="p-3 text-sm opacity-80">{u.lastLogin}</td>
                    <td className="p-3">
                      <button className="px-3 py-1 rounded-md bg-white/8">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (u) => {
    setUser(u);
    setRoute("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setRoute("dashboard");
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:gap-6">
          {/* Sidebar (desktop) */}
          <div className="hidden md:block md:w-72">
            <Sidebar active={route} onNav={(r) => setRoute(r)} />
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="relative w-72 p-4 bg-white h-full">
                  <Sidebar
                    active={route}
                    onNav={(r) => {
                      setRoute(r);
                      setSidebarOpen(false);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main area */}
          <div className="flex-1">
            <Topbar name={user.name} onLogout={handleLogout} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div key={route} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  {/* wrap wide content so it can scroll on mobile */}
                  <div className="space-y-6">
                    {route === "dashboard" && <DashboardPage name={user.name} />}
                    {route === "users" && (
                      <div className="overflow-x-auto -mx-2 px-2" data-touch-scroll>
                        <div className="min-w-full">
                          <DataTable />
                        </div>
                      </div>
                    )}
                    {route === "settings" && <div className="p-4 rounded-xl bg-white/5">Settings coming soon — enable MFA, manage roles, and connect MongoDB.</div>}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed left-0 right-0 bottom-4 mx-4 md:hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-md flex justify-around items-center">
          <button onClick={() => setRoute("dashboard")} className={`flex-1 py-2 text-center ${route === "dashboard" ? "text-emerald-600 font-semibold" : "text-gray-600"}`}>
            <div className="text-xs">Dashboard</div>
          </button>
          <button onClick={() => setRoute("users")} className={`flex-1 py-2 text-center ${route === "users" ? "text-emerald-600 font-semibold" : "text-gray-600"}`}>
            <div className="text-xs">Users</div>
          </button>
          <button onClick={() => setRoute("settings")} className={`flex-1 py-2 text-center ${route === "settings" ? "text-emerald-600 font-semibold" : "text-gray-600"}`}>
            <div className="text-xs">Settings</div>
          </button>
        </div>
      </div>

      {/* Decorative bottom-right floating element */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed right-6 bottom-20 p-3 rounded-full bg-emerald-600 text-white shadow-lg hidden sm:block">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  );
}
