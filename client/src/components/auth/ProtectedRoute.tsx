import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { Navigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified && user.providerData[0]?.providerId === 'password') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Email Verification Required</h2>
        <p className="text-gray-600 mb-4">Please verify your email before accessing the application.</p>
        <button
          onClick={() => auth.signOut()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;