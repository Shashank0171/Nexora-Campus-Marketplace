import { Navigate } from "react-router-dom";

import {
  useAuth,
} from "../../store/AuthContext";

export default function ProtectedRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useAuth();

  // LOADING
  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  }

  // NOT LOGGED IN
  if (!user) {

    return (
      <Navigate to="/login" />
    );

  }

  // AUTHORIZED
  return children;

}