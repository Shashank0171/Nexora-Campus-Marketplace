import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, MessageCircle, Trash2, Eye } from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";

export default function SellerDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        api.get("/products"),
        api.get("/messages"),
      ]);

      const myProducts = (pRes.data.products || []).filter(
        (p) => p.seller?._id === user?._id
      );

      const myMessages = (mRes.data.messages || []).filter(
        (m) => m.receiver?._id === user?._id
      );

      setProducts(myProducts);
      setMessages(myMessages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="rounded-3xl p-8 bg-white/70 backdrop-blur border border-white shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Hey {user?.fullName} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Your marketplace control center — manage listings & chats
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-5">

          <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:scale-[1.02] transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">My Products</p>
                <h2 className="text-3xl font-bold">{products.length}</h2>
              </div>
              <Package size={34} />
            </div>
          </div>

          <div className="rounded-3xl p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:scale-[1.02] transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">Messages</p>
                <h2 className="text-3xl font-bold">{messages.length}</h2>
              </div>
              <MessageCircle size={34} />
            </div>
          </div>

        </div>

        {/* PRODUCTS */}
        <section className="space-y-5">

          <h2 className="text-xl font-semibold text-slate-800">
            Your Listings
          </h2>

          {products.length === 0 ? (
            <div className="rounded-3xl p-10 text-center bg-white border shadow-sm text-slate-500">
              No products yet — start selling 🚀
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                >

                  <div className="relative">
                    <img
                      src={p.images?.[0] || "https://via.placeholder.com/400"}
                      className="h-48 w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">

                    <h3 className="font-semibold text-slate-900 truncate">
                      {p.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {p.condition}
                    </p>

                    <p className="text-lg font-bold text-indigo-600">
                      ₹{p.price}
                    </p>

                    <div className="flex gap-2 pt-2">

                      <Link
                        to={`/product/${p._id}`}
                        className="flex-1 text-center py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-sm"
                      >
                        <Eye size={14} className="inline mr-1" />
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </section>

        {/* INBOX */}
        <section className="space-y-5">

          <h2 className="text-xl font-semibold text-slate-800">
            Inbox
          </h2>

          {messages.length === 0 ? (
            <div className="rounded-3xl p-10 text-center bg-white border shadow-sm text-slate-500">
              No messages yet
            </div>
          ) : (
            <div className="space-y-3">

              {messages.map((m) => (
                <div
                  key={m._id}
                  className="bg-white border rounded-2xl p-4 hover:shadow-md transition"
                >

                  <div className="flex justify-between">
                    <h3 className="font-medium text-slate-900">
                      {m.sender?.fullName}
                    </h3>
                    <span className="text-xs text-slate-400">
                      New message
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">
                    {m.text}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    📦 {m.product?.title}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}