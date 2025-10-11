import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [user] = useAuthState(auth);
  const isGoogleUser = user?.providerData[0]?.providerId === 'google.com';
  const isAuthenticated = user && (isGoogleUser || user.emailVerified);

  if (isAuthenticated) {
    // Logged in: Show sidebar layout
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  // Not logged in: Show traditional navbar
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
