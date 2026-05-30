import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.toLowerCase();

    const regex =
      /^[0-9]{2}eg[0-9]{3}[a-z][0-9]{2}@anurag\.edu\.in$/;

    if (!regex.test(email)) {
      return toast.error("Invalid college email");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        ...formData,
        email,
        year: Number(formData.year), // FIXED
      });

      toast.success(
        "Account created successfully 🎉 Await admin approval"
      );

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="glass rounded-3xl p-8 shadow-xl">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
              N
            </div>

            <h1 className="text-3xl font-bold mt-4 text-slate-800">
              Create Account
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Join your campus marketplace
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="College Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">
                Select Department
              </option>

              <option value="Computer Science">
                Computer Science
              </option>

              <option value="IT">
                IT
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="Mechanical">
                Mechanical
              </option>

              <option value="Civil">
                Civil
              </option>
            </select>

            {/* FIXED YEAR FIELD */}
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full p-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">
                Select Year
              </option>

              <option value="1">
                1st Year
              </option>

              <option value="2">
                2nd Year
              </option>

              <option value="3">
                3rd Year
              </option>

              <option value="4">
                4th Year
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;