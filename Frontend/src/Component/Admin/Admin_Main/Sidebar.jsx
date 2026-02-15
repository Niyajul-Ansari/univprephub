import { sidebarMenu } from "../../../Data/AdminData";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
    return (
        <>
            {/* Overlay (mobile) */}
            {open && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-[#282828]/50 z-40 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed lg:static top-4 left-0 z-40
                    w-56 h-full
                    bg-[#282828] text-white flex flex-col
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                {/* Header */}
                <div className="pl-6 pt-1 pb-2 text-xl font-bold">
                    Admin Panel
                </div>

                {/* Menu */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto ">
                    {sidebarMenu.map((item) => {
                        const isDashboard = item.path === "";
                        const fullPath = isDashboard
                            ? "/admin"
                            : `/admin/${item.path}`;

                        return (
                            <NavLink
                                key={item.id}
                                to={fullPath}
                                end={isDashboard}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    block px-4 py-2 rounded-lg transition-colors
                                    ${isActive
                                        ? "bg-[#282828] text-yellow-400"
                                        : "bg-yellow-400 text-[#282828] hover:bg-yellow-300"
                                    }
                                    `
                                }
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <button
                    onClick={() => {
                        document.cookie =
                            "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                        window.location.href = "/";
                    }}
                    className="p-4 border-t border-[#282828] text-red-700 hover:bg-yellow-300"
                >
                    Logout
                </button>
            </aside>
        </>
    );
}
