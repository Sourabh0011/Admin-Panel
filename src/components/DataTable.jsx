// src/components/DataTable.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ConfirmModal from "./ConfirmModal";
import Skeleton from "./Skeleton";

export default function DataTable({ className = "" }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/users", { params: { page, perPage, q } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      // handled by api interceptors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  const toggleSelect = (id) => {
    setSelected((s) => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const selectAllOnPage = () => {
    setSelected((s) => {
      const copy = new Set(s);
      const all = items.map((i) => i.id);
      const allSelected = all.every((id) => copy.has(id));
      if (allSelected) all.forEach((id) => copy.delete(id));
      else all.forEach((id) => copy.add(id));
      return copy;
    });
  };

  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/admin/users/${deleteTarget}`);
      setConfirmOpen(false);
      setDeleteTarget(null);
      // refresh, keep page same if items remain
      fetchData();
    } catch (e) {
      // errors handled by interceptor
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search name, email, role"
            className="px-3 py-2 border rounded w-64"
          />
          <button onClick={() => { setQ(""); setPage(1); }} className="px-3 py-2 bg-white/8 rounded">Clear</button>
        </div>

        <div className="text-sm opacity-80">Total: {total}</div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-sm bg-white/5">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} />
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="text-xs text-left opacity-70 uppercase bg-white/6">
              <tr>
                <th className="p-3"><input type="checkbox" onChange={selectAllOnPage} checked={items.length > 0 && items.every(i => selected.has(i.id))} /></th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Last Login</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-white/6 hover:bg-white/3 transition-colors">
                  <td className="p-3"><input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-sm opacity-80">{u.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${u.role === "admin" ? "bg-emerald-600 text-white" : "bg-white/8"}`}>{u.role}</span></td>
                  <td className="p-3 text-sm opacity-80">{u.lastLogin}</td>
                  <td className="p-3"><button onClick={() => confirmDelete(u.id)} className="px-3 py-1 rounded-md bg-white/8">Delete</button></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm opacity-80">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded border" disabled={page === 1}>Prev</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded border" disabled={page === totalPages}>Next</button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
        confirmLabel="Delete"
      />
    </div>
  );
}
