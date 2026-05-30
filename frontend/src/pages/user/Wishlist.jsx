import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/wishlist");

      // SAFE fallback (handles all backend variations)
      const data =
        res.data?.wishlist?.products ||
        res.data?.wishlist ||
        res.data?.products ||
        [];

      setWishlist(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ================= REMOVE =================
  const removeFromWishlist = async (id) => {
    if (removingId) return;

    setRemovingId(id);

    // optimistic update
    const previous = wishlist;
    setWishlist((prev) => prev.filter((item) => item._id !== id));

    try {
      await api.delete(`/wishlist/remove/${id}`);
    } catch (err) {
      // rollback
      setWishlist(previous);
      setError(err.response?.data?.message || "Failed to remove item");
    } finally {
      setRemovingId(null);

      // safer sync with backend
      fetchWishlist();
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-slate-500">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-slate-500 mt-2">
          Products you've saved for later
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="max-w-3xl mx-auto mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {wishlist.length === 0 ? (
        <div className="max-w-2xl mx-auto bg-white border rounded-3xl p-10 text-center">
          <h2 className="text-xl font-semibold">
            Your wishlist is empty
          </h2>
          <p className="text-slate-500 mt-2">
            Browse products and add your favourites.
          </p>

          <Link
            to="/products"
            className="inline-block mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {wishlist.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition"
            >

              <img
                src={p.images?.[0] || "https://via.placeholder.com/400"}
                className="w-full h-60 object-cover"
              />

              <div className="p-5">

                <span className="inline-block px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-full mb-3">
                  {p.category}
                </span>

                <h2 className="font-semibold text-lg truncate">
                  {p.title}
                </h2>

                <p className="text-2xl font-bold text-indigo-600 mt-3">
                  ₹{p.price}
                </p>

                <div className="flex gap-3 mt-5">

                  <Link
                    to={`/product/${p._id}`}
                    className="flex-1 text-center py-2.5 border rounded-xl hover:bg-slate-100"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(p._id)}
                    disabled={removingId === p._id}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white disabled:opacity-50"
                  >
                    {removingId === p._id ? "Removing..." : "Remove"}
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}