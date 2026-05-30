import { useEffect, useState } from "react";
import { Users, Package, Trash2, Check, UserX } from "lucide-react";

import api from "../../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.users || []);
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.products || []);
  };

  const load = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchProducts()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/user/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const toggleApproval = async (id, current) => {
    const newStatus = !current;

    const res = await api.put(`/admin/user/approve/${id}`, {
      isApproved: newStatus,
    });

    if (res.data.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isApproved: newStatus } : u
        )
      );
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/product/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-500">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-10">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur border border-white rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Control Center ⚙️
          </h1>
          <p className="text-slate-500 mt-1">
            Manage users, approvals, and marketplace integrity
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-6 shadow-lg hover:scale-[1.02] transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Total Users</p>
                <h2 className="text-3xl font-bold">{users.length}</h2>
              </div>
              <Users size={34} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-3xl p-6 shadow-lg hover:scale-[1.02] transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Products</p>
                <h2 className="text-3xl font-bold">{products.length}</h2>
              </div>
              <Package size={34} />
            </div>
          </div>

        </div>

        {/* USERS */}
        <section className="space-y-5">

          <h2 className="text-xl font-semibold text-slate-800">
            Users Management
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-3xl border shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition"
              >

                <h3 className="font-semibold text-slate-900 truncate">
                  {u.fullName}
                </h3>

                <p className="text-sm text-slate-500 truncate">
                  {u.email}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">

                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {u.role}
                  </span>

                  {u.role !== "admin" && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        u.isApproved
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-yellow-50 text-yellow-600 border-yellow-200"
                      }`}
                    >
                      {u.isApproved ? "Approved" : "Pending"}
                    </span>
                  )}

                </div>

                <div className="mt-5 space-y-2">

                  {u.role !== "admin" && (
                    <button
                      onClick={() =>
                        toggleApproval(u._id, u.isApproved)
                      }
                      className="w-full py-2 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition flex items-center justify-center gap-2"
                    >
                      {u.isApproved ? (
                        <>
                          <UserX size={14} />
                          Revoke
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Approve
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(u._id)}
                    className="w-full py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* PRODUCTS */}
        <section className="space-y-5">

          <h2 className="text-xl font-semibold text-slate-800">
            Products Review
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl border shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
              >

                <img
                  src={p.images?.[0] || "https://via.placeholder.com/400"}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5 space-y-2">

                  <h3 className="font-semibold text-slate-900 truncate">
                    {p.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {p.category}
                  </p>

                  <p className="text-lg font-bold text-indigo-600">
                    ₹{p.price}
                  </p>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="w-full mt-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Remove Product
                  </button>

                </div>

              </div>
            ))}

          </div>
        </section>

      </div>
    </div>
  );
}