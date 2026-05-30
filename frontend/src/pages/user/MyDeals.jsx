import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const res = await api.get("/deals/my");
      setDeals(res.data.deals);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // ACCEPT DEAL (FIXED)
  const handleAcceptDeal = async (dealId) => {
    try {
      await api.patch(`/deals/${dealId}/accept`);
      fetchDeals();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading deals...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Deals</h1>
          <p className="text-slate-500 mt-2">
            Manage offers and track your deals
          </p>
        </div>

        {/* EMPTY */}
        {deals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 shadow text-center border">
            <h2 className="text-xl font-semibold mb-2">
              No deals found
            </h2>
            <p className="text-slate-500">
              Offers and deal requests will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-5">

            {deals.map((deal) => {
              const lastOffer = deal.offers?.at(-1);

              return (
                <div
                  key={deal._id}
                  className="bg-white rounded-3xl border shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-5 flex flex-col md:flex-row gap-5">

                    {/* IMAGE */}
                    <img
                      src={
                        deal.product?.images?.[0] ||
                        "https://via.placeholder.com/300"
                      }
                      className="w-full md:w-52 h-44 object-cover rounded-2xl"
                    />

                    {/* INFO */}
                    <div className="flex-1">

                      <div className="flex justify-between flex-wrap gap-3">

                        <h2 className="text-2xl font-bold">
                          {deal.product?.title}
                        </h2>

                        {/* STATUS */}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            deal.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : deal.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : deal.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {deal.status}
                        </span>

                      </div>

                      <p className="text-slate-500 mt-2">
                        Latest Offer:{" "}
                        <span className="text-indigo-600 font-semibold">
                          ₹{lastOffer?.price || "N/A"}
                        </span>
                      </p>

                      {/* PEOPLE */}
                      <div className="mt-4 text-sm text-slate-600 space-y-1">
                        <p>
                          <span className="font-medium">Buyer:</span>{" "}
                          {deal.buyer?.fullName}
                        </p>
                        <p>
                          <span className="font-medium">Seller:</span>{" "}
                          {deal.seller?.fullName}
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-3 flex-wrap">

                        <Link
                          to={`/deals/${deal._id}`}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white"
                        >
                          Open Deal
                        </Link>

                        {/* SELLER ONLY LOGIC (optional improvement) */}
                        {deal.status === "negotiation" && (
                          <button
                            onClick={() => handleAcceptDeal(deal._id)}
                            className="px-5 py-2.5 rounded-xl bg-green-600 text-white"
                          >
                            Accept Deal
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}