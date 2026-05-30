import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import ChatBox from "../../components/chat/ChatBox";
import { Heart, MessageCircle, Eye } from "lucide-react";

export default function ProductPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chat, setChat] = useState({
    open: false,
    receiverId: "",
    productId: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");

        console.log("PRODUCTS:", res.data.products);

        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openProduct = (id) => navigate(`/product/${id}`);

  const openChat = (product) => {
    const sellerId = product?.seller?._id;

    if (!sellerId) {
      console.log("Seller missing in product:", product);
      return;
    }

    setChat({
      open: true,
      receiverId: sellerId,
      productId: product._id,
    });
  };

  const closeChat = () =>
    setChat({ open: false, receiverId: "", productId: "" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white py-12 px-6">

      {/* HERO */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
          Campus Marketplace
        </h1>

        <p className="text-slate-500 mt-3">
          Buy, sell & connect with students around you 🎓
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-3">🛒</div>
          <h2 className="text-xl font-semibold">No products yet</h2>
          <p className="text-slate-500 mt-2">
            Be the first to post something amazing in your campus
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map((p) => {
            const sellerId = p?.seller?._id;

            const canMessage =
              user?._id && sellerId && user._id !== sellerId;

            const isSold =
              p.status === "Sold" || p.isSold;

            return (
              <div
                key={p._id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden"
              >

                {/* IMAGE FIXED */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => openProduct(p._id)}
                >
                  <img
                    src={
                      Array.isArray(p.images) && p.images.length > 0
                        ? p.images[0]
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={p.title}
                    className="h-64 w-full object-cover bg-slate-50 group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />

                  {/* badge */}
                  <div className="absolute top-3 left-3 bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                    {p.category}
                  </div>

                  {isSold && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      Sold
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <h2
                    onClick={() => openProduct(p._id)}
                    className="font-semibold text-lg cursor-pointer hover:text-indigo-600"
                  >
                    {p.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {p.description}
                  </p>

                  {/* seller + price */}
                  <div className="flex items-center justify-between mt-4">

                    <div className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                      {p.seller?.fullName || "Unknown"}
                    </div>

                    <p className="text-xl font-bold text-indigo-600">
                      ₹{p.price}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-3 gap-2 mt-5">

                    <button
                      onClick={() => openProduct(p._id)}
                      className="flex items-center justify-center gap-1 py-2 rounded-xl border hover:bg-slate-50"
                    >
                      <Eye size={14} />
                    </button>

                    <button className="flex items-center justify-center gap-1 py-2 rounded-xl border hover:bg-pink-50">
                      <Heart size={14} />
                    </button>

                    {canMessage && !isSold && (
                      <button
                        onClick={() => openChat(p)}
                        className="flex items-center justify-center gap-1 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <MessageCircle size={14} />
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* CHAT */}
      {chat.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={closeChat} />

          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <ChatBox
              receiverId={chat.receiverId}
              productId={chat.productId}
              onClose={closeChat}
            />
          </div>
        </div>
      )}

    </div>
  );
}