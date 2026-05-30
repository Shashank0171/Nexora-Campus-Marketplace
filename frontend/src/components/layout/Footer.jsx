import { Link } from "react-router-dom";
import { Sparkles, Mail, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="mt-24 relative">

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-50 via-white to-white" />

      <div className="relative border-t border-white/40 backdrop-blur-xl">

        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-md">
                N
              </div>
              <h2 className="text-xl font-bold">Nexora</h2>
            </div>

            <p className="text-sm text-black/60 leading-relaxed">
              A modern student marketplace to buy, sell, and connect within your campus community.
            </p>

            <div className="flex items-center gap-2 text-xs text-indigo-600">
              <Sparkles size={14} />
              Built for students
            </div>

          </div>

          {/* LINKS */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm">

              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "Sell Item", path: "/sell" },
                { label: "Wishlist", path: "/wishlist" },
              ].map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="
                    text-black/60 hover:text-indigo-600
                    transition flex items-center gap-2
                  "
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100" />
                  {l.label}
                </Link>
              ))}

            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">

            <h3 className="font-semibold text-black">Support</h3>

            <p className="text-sm text-black/60">
              Need help? We’re here for you.
            </p>

            <div className="flex items-center gap-2 text-sm text-black/70">
              <Mail size={14} />
              support@nexora.in
            </div>

            <div className="text-xs text-black/50 flex items-center gap-1">
              Made with <Heart size={12} className="text-red-500" /> for students
            </div>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/40">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-sm text-black/50">

            <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>

            <p className="mt-2 md:mt-0">
              Buy • Sell • Connect
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;