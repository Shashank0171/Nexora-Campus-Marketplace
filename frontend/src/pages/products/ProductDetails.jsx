import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import ChatBox from "../../components/chat/ChatBox";
import { Heart, MessageCircle, BadgeCheck } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);

        const first = res.data.product?.images?.[0];
        if (first) setSelectedImage(first);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const isSold =
    product?.status === "Sold" || product?.isSold;

  const canMessage =
    user?._id &&
    product?.seller?._id &&
    user._id !== product.seller._id;

  const addToWishlist = async () => {
    try {
      setError("");
      setSuccess("");
      await api.post("/wishlist/add", { productId: id });
      setSuccess("Saved to wishlist ❤️");
    } catch {
      setError("Wishlist failed");
    }
  };

  const createDeal = async () => {
    try {
      const res = await api.post("/deals/create", {
        productId: product._id,
        sellerId: product.seller?._id,
        priceOffered: product.price,
      });

      navigate(`/deals/${res.data.deal._id}`);
    } catch {
      setError("Failed to create deal");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <p className="text-slate-500 animate-pulse">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-10">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT (MAIN CONTENT) */}
        <div className="lg:col-span-2 space-y-6">

          {/* IMAGE CARD */}
          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

            <img
              src={selectedImage || "https://via.placeholder.com/600"}
              className="w-full h-[480px] object-contain p-6"
            />

            <div className="p-4 flex gap-3 overflow-x-auto border-t">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 ${
                    selectedImage === img
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* INFO CARD */}
          <div className="bg-white rounded-3xl border p-6 shadow-sm">

            <h1 className="text-3xl font-bold text-slate-800">
              {product.title}
            </h1>

            <p className="text-slate-500 mt-2">
              Condition: {product.condition}
            </p>

            <p className="text-4xl font-extrabold text-indigo-600 mt-5">
              ₹{product.price}
            </p>

            <div className="mt-5 text-slate-600 leading-relaxed">
              {product.description}
            </div>
          </div>

          {/* SELLER TRUST CARD */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border rounded-3xl p-6">

            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
              <BadgeCheck size={18} />
              Verified Campus Seller
            </div>

            <p className="mt-2 font-semibold text-slate-800">
              {product.seller?.fullName}
            </p>

            <p className="text-sm text-slate-500">
              {product.seller?.email}
            </p>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (STICKY ACTION PANEL) */}
        <div className="lg:col-span-1">

          <div className="sticky top-24 bg-white border rounded-3xl p-5 shadow-sm space-y-3">

            <p className="text-sm text-slate-500">Quick Actions</p>

            {!isSold ? (
              <>
                {canMessage && (
                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-2xl hover:bg-indigo-700"
                  >
                    <MessageCircle size={16} />
                    Message Seller
                  </button>
                )}

                {canMessage && (
                  <button
                    onClick={createDeal}
                    className="w-full border py-3 rounded-2xl hover:bg-slate-50"
                  >
                    Make Offer
                  </button>
                )}

                <button
                  onClick={addToWishlist}
                  className="w-full flex items-center justify-center gap-2 border py-3 rounded-2xl hover:bg-pink-50"
                >
                  <Heart size={16} />
                  Save
                </button>
              </>
            ) : (
              <div className="text-center text-red-500 font-medium py-6">
                Sold Out
              </div>
            )}

          </div>
        </div>
      </div>

      {/* CHAT MODAL */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={() => setChatOpen(false)} />

          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <ChatBox
              receiverId={product.seller?._id}
              productId={product._id}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
}