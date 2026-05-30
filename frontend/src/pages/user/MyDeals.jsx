import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all deals
  const fetchDeals = async () => {
    const res = await api.get("/deals/my");
    setDeals(res.data.deals);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">

      {deals.map((deal) => {

        // last offer in deal
        const lastOffer = deal.offers?.[deal.offers.length - 1];

        return (
          <div key={deal._id} className="border p-4 rounded-xl mb-4">

            {/* product name */}
            <h2 className="font-bold">
              {deal.product?.title}
            </h2>

            {/* latest offer */}
            <p>
              Latest Offer: ₹{lastOffer?.price || "No offers"}
            </p>

            {/* who made offer */}
            {lastOffer && (
              <p className="text-sm text-gray-500">
                by {lastOffer.offeredBy?.fullName}
              </p>
            )}

            {/* status */}
            <p>Status: {deal.status}</p>

            {/* open deal page */}
            <Link to={`/deals/${deal._id}`}>
              Open Deal
            </Link>

          </div>
        );
      })}

    </div>
  );
}