import { Link, useLocation } from "react-router-dom";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { HiHome, HiViewGrid, HiDocumentText, HiLogout, HiUser } from "react-icons/hi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../../utils/firebase";

const Sidebar = () => {
    const location = useLocation();
    const [user] = useAuthState(auth);

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <FlowbiteSidebar aria-label="Sidebar with navigation" className="h-screen">
            <div className="flex h-full flex-col justify-between">
                <div>
                    {/* Logo */}
                    <div className="mb-6 flex items-center px-3 py-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/justEggLogo.png" alt="Eggtive" className="h-8 w-8" />
                            <span className="text-xl font-semibold text-gray-800">Eggtive</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <FlowbiteSidebar.Items>
                        <FlowbiteSidebar.ItemGroup>
                            <FlowbiteSidebar.Item
                                as={Link}
                                to="/"
                                icon={HiHome}
                                active={isActive("/")}
                            >
                                Home
                            </FlowbiteSidebar.Item>
                            <FlowbiteSidebar.Item
                                as={Link}
                                to="/board"
                                icon={HiViewGrid}
                                active={isActive("/board")}
                            >
                                Board
                            </FlowbiteSidebar.Item>
                            <FlowbiteSidebar.Item
                                as={Link}
                                to="/notebook"
                                icon={HiDocumentText}
                                active={isActive("/notebook")}
                            >
                                Notebook
                            </FlowbiteSidebar.Item>
                        </FlowbiteSidebar.ItemGroup>
                    </FlowbiteSidebar.Items>
                </div>

                {/* User Section */}
                <div className="border-t border-gray-200 p-4">
                    <div className="mb-3 flex items-center space-x-3 px-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <HiUser className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                                {user?.displayName || user?.email}
                            </p>
                        </div>
                    </div>
                    <FlowbiteSidebar.Items>
                        <FlowbiteSidebar.ItemGroup>
                            <FlowbiteSidebar.Item
                                icon={HiLogout}
                                onClick={logout}
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                            >
                                Logout
                            </FlowbiteSidebar.Item>
                        </FlowbiteSidebar.ItemGroup>
                    </FlowbiteSidebar.Items>
                </div>
            </div>
        </FlowbiteSidebar>
    );
};

export default Sidebar;
