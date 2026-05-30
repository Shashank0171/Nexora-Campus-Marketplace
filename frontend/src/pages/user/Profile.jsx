import { useAuth } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const avatar =
    user?.avatar?.trim()
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.fullName || "User"
        )}&background=6366f1&color=fff`;

  // Loading state (optional but recommended)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <p className="text-gray-500">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">

        {/* Top Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500" />

        {/* Profile Section */}
        <div className="px-8 pb-8">

          <div className="-mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* USER INFO */}
            <div className="flex items-center gap-4">

              <img
                src={avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>

                <p className="text-gray-500">{user.email}</p>
              </div>

            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition font-medium"
            >
              Logout
            </button>

          </div>

          {/* INFORMATION */}
          <div className="mt-8">

            <h2 className="text-lg font-semibold mb-4">
              Student Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold">{user.fullName}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500 mb-1">Email Address</p>
                <p className="font-semibold break-all">{user.email}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <p className="font-semibold">
                  {user.department || "Not Added"}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-sm text-gray-500 mb-1">Academic Year</p>
                <p className="font-semibold">{user.year || "Not Added"}</p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}