import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../store/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "email"
          ? e.target.value.toLowerCase()
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);

      const { user, token } = res.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      login(user);

      toast.success("Welcome back 👋");

      // Pending approval users
      if (
        user.role !== "admin" &&
        !user.isApproved
      ) {
        navigate("/pending-approval");
        return;
      }

      // Admin
      if (
        user.role?.toLowerCase() === "admin"
      ) {
        navigate("/admin/dashboard");
        return;
      }

      // Normal users
      const from =
        location.state?.from?.pathname;

      navigate(from || "/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
            N
          </div>

          <h1 className="text-3xl font-bold mt-5 text-slate-800">
            Welcome back
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Login to your Nexora account
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold hover:scale-[1.02] transition"
            >
              {loading
                ? "Signing in..."
                : "Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6 text-slate-500">
          Don’t have an account?{" "}
          <Link
            className="text-indigo-600 font-medium"
            to="/register"
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;