import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Clock, Shield, RefreshCw } from "lucide-react";

function PendingApproval() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);

      if (res.data.user.isApproved) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUser();
    const interval = setInterval(loadUser, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-violet-50">

      <div className="w-full max-w-lg">

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-10 text-center">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-inner">
              <Clock className="text-indigo-600" size={28} />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-slate-800">
            Account Under Review
          </h1>

          <p className="text-slate-500 mt-3 text-sm leading-relaxed">
            Your Nexora account is being verified by the admin team.
            You’ll get full access once approval is completed.
          </p>

          {/* STATUS BADGE */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
            <Shield size={14} />
            Pending Verification
          </div>

          {/* PROGRESS FEEL */}
          <div className="mt-6 flex justify-center">
            <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse"></div>
            </div>
          </div>

          {/* USER INFO */}
          {user && (
            <div className="mt-6 text-sm text-slate-500">
              Logged in as{" "}
              <span className="font-medium text-slate-800">
                {user.email}
              </span>
            </div>
          )}

          {/* INFO BOX */}
          <div className="mt-6 text-left bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800 mb-1">
              What happens next?
            </p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Admin verifies your college email</li>
              <li>Your account gets activated</li>
              <li>You can start buying & selling instantly</li>
            </ul>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col gap-3">

            <button
              onClick={loadUser}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <RefreshCw size={16} />
              Check Status
            </button>

            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:scale-[1.02] transition"
            >
              Back to Login
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PendingApproval;