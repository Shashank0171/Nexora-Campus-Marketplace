import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Heart,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  Store,
  HandCoins,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const isSeller =
    user?.role === "student" && user?.isApproved;

  const item = ({ isActive }) => `
    flex items-center gap-2 px-4 py-2 rounded-2xl text-sm transition-all
    ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md"
        : "text-black/70 hover:text-black hover:bg-white/70"
    }
  `;

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-md">
              N
            </div>

            <div className="leading-tight">
              <h1 className="font-bold text-black">Nexora</h1>
              <p className="text-xs text-black/50">
                Campus Marketplace
              </p>
            </div>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex gap-2 items-center">

            <NavLink to="/" className={item}>
              <Home size={16} />
              Home
            </NavLink>

            {isLoggedIn && !isAdmin && (
              <>
                <NavLink to="/sell" className={item}>
                  <PlusCircle size={16} />
                  Sell
                </NavLink>

                <NavLink to="/wishlist" className={item}>
                  <Heart size={16} />
                  Saved
                </NavLink>

                <NavLink to="/messages" className={item}>
                  <MessageCircle size={16} />
                  Chats
                </NavLink>

                {/* ⭐ NEW: MY DEALS (SELLER INBOX) */}
                <NavLink to="/my-deals" className={item}>
                  <HandCoins size={16} />
                  My Deals
                </NavLink>

                {/* SELLER DASHBOARD */}
                {isSeller && (
                  <NavLink
                    to="/seller/dashboard"
                    className={item}
                  >
                    <Store size={16} />
                    Seller Dashboard
                  </NavLink>
                )}
              </>
            )}

            {/* ADMIN DASHBOARD */}
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className={item}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </NavLink>
            )}

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-semibold shadow-md"
                >
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-white/40 bg-white/60 hover:bg-red-500 hover:text-white transition"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl text-sm border border-white/40 bg-white/60 hover:bg-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-2xl text-sm bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;