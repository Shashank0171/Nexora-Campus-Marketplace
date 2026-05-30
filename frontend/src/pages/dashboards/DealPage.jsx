import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";
import { Check, X, Send, TrendingUp } from "lucide-react";

export default function DealPage() {
  const { dealId } = useParams();
  const { user } = useAuth();

  const [deal, setDeal] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/deals/${dealId}`);
      setDeal(res.data.deal);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setDeal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  const sendOffer = async () => {
    try {
      setActionLoading(true);

      await api.post(`/deals/${dealId}/offer`, {
        price: Number(price),
        message,
      });

      setPrice("");
      setMessage("");
      fetchDeal();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const acceptDeal = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/deals/${dealId}/accept`);
      fetchDeal();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const rejectDeal = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/deals/${dealId}/reject`);
      fetchDeal();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const completeDeal = async () => {
    try {
      setActionLoading(true);
      await api.patch(`/deals/${dealId}/complete`);
      fetchDeal();
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-slate-500">
        Loading deal...
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Deal not found
      </div>
    );
  }

  const statusColor =
    deal.status === "accepted"
      ? "from-emerald-500 to-green-500"
      : deal.status === "rejected"
      ? "from-red-500 to-rose-500"
      : "from-indigo-500 to-purple-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-10">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <div className="flex justify-between items-start flex-wrap gap-3">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {deal.product?.title}
              </h1>

              <p className="text-slate-500 mt-1">
                Base Price:{" "}
                <span className="font-semibold text-indigo-600">
                  ₹{deal.product?.price}
                </span>
              </p>
            </div>

            <div className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${statusColor}`}>
              {deal.status?.toUpperCase()}
            </div>

          </div>

          {deal.finalPrice && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
              <TrendingUp size={16} />
              Final Price: ₹{deal.finalPrice}
            </div>
          )}

        </div>

        {/* LAYOUT */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* OFFERS */}
          <div className="md:col-span-2 bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="font-semibold text-slate-900 mb-4">
              Offers Timeline
            </h2>

            <div className="space-y-4">

              {deal.offers?.map((offer, i) => {
                const mine = offer.offeredBy?._id === user?._id;

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border ${
                      mine
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white border-slate-200"
                    }`}
                  >

                    <div className="flex justify-between items-center">

                      <p className="font-medium text-slate-900">
                        {offer.offeredBy?.fullName || "User"}
                      </p>

                      <p className="font-bold text-indigo-600">
                        ₹{offer.price}
                      </p>

                    </div>

                    <p className="text-sm text-slate-600 mt-2">
                      {offer.message || "No message"}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-4">

            {/* SEND OFFER */}
            {deal.status === "negotiation" && (
              <div className="bg-white border rounded-3xl p-5 shadow-sm">

                <h2 className="font-semibold mb-4 text-slate-900">
                  Send Offer
                </h2>

                <input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded-xl p-3 mb-3"
                />

                <input
                  placeholder="Message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded-xl p-3 mb-4"
                />

                <button
                  disabled={actionLoading}
                  onClick={sendOffer}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Send Offer
                </button>

              </div>
            )}

            {/* ACTIONS */}
            {deal.status === "negotiation" && (
              <div className="bg-white border rounded-3xl p-5 shadow-sm space-y-3">

                <button
                  disabled={actionLoading}
                  onClick={acceptDeal}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  Accept Deal
                </button>

                <button
                  disabled={actionLoading}
                  onClick={rejectDeal}
                  className="w-full bg-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <X size={14} />
                  Reject Deal
                </button>

              </div>
            )}

            {deal.status === "accepted" && (
              <button
                disabled={actionLoading}
                onClick={completeDeal}
                className="w-full bg-black text-white py-3 rounded-2xl"
              >
                Mark as Completed
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}