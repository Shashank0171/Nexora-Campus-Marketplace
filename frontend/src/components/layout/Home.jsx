import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("All");

  const categories = ["All", "Books", "Electronics", "Hostel", "Furniture", "Others"];

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/products");
      setProducts(data.products || []);
      setFiltered(data.products || []);
    })();
  }, []);

  useEffect(() => {
    let res = products.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (selected !== "All") {
      res = res.filter((p) => p.category === selected);
    }

    setFiltered(res);
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
        <div className="
          flex items-center gap-3
          bg-white/70 backdrop-blur-xl
          border border-white/40
          shadow-sm
          px-5 py-4 rounded-2xl
        ">
          <Search size={18} className="text-indigo-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full outline-none bg-transparent"
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div className="max-w-5xl mx-auto mt-8 px-6 flex flex-wrap gap-2 justify-center">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`
              px-4 py-2 text-sm rounded-full transition
              ${selected === c
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-white/60 hover:bg-indigo-50 border border-white/40"
              }
            `}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6 pb-20">

        {filtered.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="
              bg-white/70 backdrop-blur-xl
              border border-white/40
              rounded-3xl
              overflow-hidden
              shadow-sm hover:shadow-xl
              hover:-translate-y-1
              transition
            "
          >

            <img
              src={p.images?.[0] || "https://via.placeholder.com/400"}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">

              <h3 className="font-semibold text-lg">{p.title}</h3>

              <p className="text-sm text-black/60 mt-1 line-clamp-2">
                {p.description}
              </p>

              <div className="flex justify-between mt-4 items-center">
                <span className="font-bold text-indigo-600">
                  ₹{p.price}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {p.category}
                </span>
              </div>

            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}

export default Home;