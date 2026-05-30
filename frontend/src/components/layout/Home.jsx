import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("All");

  const categories = [
    "All",
    "Books",
    "Electronics",
    "Hostel",
    "Furniture",
    "Others",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");

        console.log("Products:", data.products);

        setProducts(data.products || []);
        setFiltered(data.products || []);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products.filter((product) =>
      product.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    if (selected !== "All") {
      result = result.filter(
        (product) => product.category === selected
      );
    }

    setFiltered(result);
  }, [search, selected, products]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-violet-50 pt-20 text-black">

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center px-6">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm">
          <Sparkles size={14} />
          Campus Marketplace
        </div>

        <h1 className="text-6xl font-extrabold mt-6 tracking-tight">
          Nexora
        </h1>

        <p className="mt-4 text-black/60 text-lg">
          Buy • Sell • Connect within your campus
        </p>

        <div className="mt-6 flex justify-center items-center gap-3 text-sm text-black/60">
          <span>Buy</span>
          <span className="w-10 h-px bg-indigo-300"></span>
          <span>Sell</span>
          <span className="w-10 h-px bg-indigo-300"></span>
          <span>Connect</span>
        </div>

      </div>

      {/* SEARCH */}
      <div className="max-w-3xl mx-auto mt-10 px-6">
        <div
          className="
            flex items-center gap-3
            bg-white/70 backdrop-blur-xl
            border border-white/40
            shadow-sm
            px-5 py-4 rounded-2xl
          "
        >
          <Search size={18} className="text-indigo-500" />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="max-w-5xl mx-auto mt-8 px-6 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelected(category)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              selected === category
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-white/60 hover:bg-indigo-50 border border-white/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6 pb-20">

        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="
                bg-white/70 backdrop-blur-xl
                border border-white/40
                rounded-3xl
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >

              {/* PRODUCT IMAGE */}
              <img
                src={
                  product.images?.[0] ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={product.title}
                className="h-56 w-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              <div className="p-5">

                <h3 className="font-semibold text-lg">
                  {product.title}
                </h3>

                <p className="text-sm text-black/60 mt-1 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <span className="font-bold text-indigo-600">
                    ₹{product.price}
                  </span>

                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                    {product.category}
                  </span>

                </div>

              </div>

            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20">

            <h3 className="text-xl font-semibold text-slate-700">
              No Products Found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing your search or category filter.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default Home;