import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../../services/api";

export default function MyDeals() {

  const [deals, setDeals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH DEALS
  const fetchDeals = async () => {

    try {

      const res =
        await api.get("/deals/my");

      setDeals(res.data.deals);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDeals();

  }, []);

  // ACCEPT DEAL
  const handleAcceptDeal =
    async (dealId) => {

      try {

        await api.put(
          `/deals/${dealId}/accept`
        );

        fetchDeals();

      } catch (err) {

        console.log(err);

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

          <h1 className="text-3xl font-bold">
            My Deals
          </h1>

          <p className="text-slate-500 mt-2">
            Manage offers and track your deals
          </p>

        </div>

        {/* EMPTY */}
        {deals.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 shadow text-center border border-slate-200">

            <h2 className="text-xl font-semibold mb-2">
              No deals found
            </h2>

            <p className="text-slate-500">
              Offers and deal requests will appear here
            </p>

          </div>

        ) : (

          <div className="grid gap-5">

            {deals.map((deal) => (

              <div
                key={deal._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition overflow-hidden"
              >

                <div className="p-5 flex flex-col md:flex-row gap-5">

                  {/* PRODUCT IMAGE */}
                  <img
                    src={
                      deal.product?.images?.[0] ||
                      "https://via.placeholder.com/300"
                    }
                    alt={deal.product?.title}
                    className="w-full md:w-52 h-44 object-cover rounded-2xl"
                  />

                  {/* DEAL INFO */}
                  <div className="flex-1">

                    <div className="flex items-start justify-between flex-wrap gap-3">

                      <div>

                        <h2 className="text-2xl font-bold">
                          {deal.product?.title}
                        </h2>

                        <p className="text-slate-500 mt-1">
                          Offer Price:
                          <span className="font-semibold text-indigo-600 ml-2">
                            ₹{deal.offerPrice}
                          </span>
                        </p>

                      </div>

                      {/* STATUS */}
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          deal.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : deal.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {deal.status}
                      </span>

                    </div>

                    {/* BUYER */}
                    <div className="mt-4 space-y-1">

                      <p className="text-slate-600">

                        <span className="font-medium">
                          Buyer:
                        </span>

                        {" "}
                        {deal.buyer?.fullName}

                      </p>

                      <p className="text-slate-600">

                        <span className="font-medium">
                          Seller:
                        </span>

                        {" "}
                        {deal.seller?.fullName}

                      </p>

                      <p className="text-slate-500 text-sm">

                        Offer sent on{" "}
                        {new Date(
                          deal.createdAt
                        ).toLocaleDateString()}

                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex gap-3 flex-wrap">

                      {/* OPEN DEAL */}
                      <Link
                        to={`/deals/${deal._id}`}
                        className="
                          px-5
                          py-2.5
                          rounded-xl
                          bg-indigo-600
                          text-white
                          hover:bg-indigo-700
                          transition
                        "
                      >
                        Open Deal
                      </Link>

                      {/* ACCEPT BUTTON */}
                      {deal.status === "Pending" && (

                        <button
                          onClick={() =>
                            handleAcceptDeal(
                              deal._id
                            )
                          }
                          className="
                            px-5
                            py-2.5
                            rounded-xl
                            bg-green-600
                            text-white
                            hover:bg-green-700
                            transition
                          "
                        >
                          Accept Deal
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}