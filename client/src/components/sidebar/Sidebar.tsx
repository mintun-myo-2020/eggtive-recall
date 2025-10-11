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
        <div className="w-16 sm:w-20 md:w-56 lg:w-64 flex-shrink-0">
            <FlowbiteSidebar aria-label="Sidebar with navigation" className="h-screen w-full">
                <div className="flex h-full flex-col justify-between">
                    <div>
                        {/* Logo */}
                        <div className="mb-4 sm:mb-6 flex items-center justify-center md:justify-start px-2 md:px-3 py-3 md:py-4">
                            <Link to="/" className="flex items-center space-x-2">
                                <img src="/justEggLogo.png" alt="Eggtive" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                                <span className="hidden md:inline text-lg lg:text-xl font-semibold text-gray-800">Eggtive</span>
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
                                    className="flex items-center justify-center md:justify-start"
                                >
                                    <span className="hidden md:inline">Home</span>
                                </FlowbiteSidebar.Item>
                                <FlowbiteSidebar.Item
                                    as={Link}
                                    to="/board"
                                    icon={HiViewGrid}
                                    active={isActive("/board")}
                                    className="flex items-center justify-center md:justify-start"
                                >
                                    <span className="hidden md:inline">Board</span>
                                </FlowbiteSidebar.Item>
                                <FlowbiteSidebar.Item
                                    as={Link}
                                    to="/notebook"
                                    icon={HiDocumentText}
                                    active={isActive("/notebook")}
                                    className="flex items-center justify-center md:justify-start"
                                >
                                    <span className="hidden md:inline">Notebook</span>
                                </FlowbiteSidebar.Item>
                            </FlowbiteSidebar.ItemGroup>
                        </FlowbiteSidebar.Items>
                    </div>

                    {/* User Section */}
                    <div className="border-t border-gray-200 p-2 md:p-4">
                        <div className="mb-2 md:mb-3 flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-0 md:px-3">
                            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-blue-100">
                                <HiUser className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div className="hidden md:block flex-1 min-w-0">
                                <p className="truncate text-xs lg:text-sm font-medium text-gray-900">
                                    {user?.displayName || user?.email}
                                </p>
                            </div>
                        </div>
                        <FlowbiteSidebar.Items>
                            <FlowbiteSidebar.ItemGroup>
                                <FlowbiteSidebar.Item
                                    icon={HiLogout}
                                    onClick={logout}
                                    className="cursor-pointer hover:bg-red-50 hover:text-red-600 flex items-center justify-center md:justify-start"
                                >
                                    <span className="hidden md:inline">Logout</span>
                                </FlowbiteSidebar.Item>
                            </FlowbiteSidebar.ItemGroup>
                        </FlowbiteSidebar.Items>
                    </div>
                </div>
            </FlowbiteSidebar>
        </div>
    );
};

export default Sidebar;
