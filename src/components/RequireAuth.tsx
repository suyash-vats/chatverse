
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

type RequireAuthProps = {
  children: JSX.Element;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-whatsapp-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
