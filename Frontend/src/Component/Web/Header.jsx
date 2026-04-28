import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Header({ onLoginClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Premium", href: "/premium" },
        { name: "Notes", href: "/notes" },
        { name: "YouTube", href: "/youtube" },
    ];

    // ✅ FETCH USER
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/user/me`, {
                    credentials: "include",
                });

                if (!res.ok) return;

                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log("Not logged in");
            }
        };

        fetchUser();
    }, []);

    // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // ✅ LOGOUT
    const handleLogout = async () => {
        try {
            await fetch(`${BACKEND_URL}/user/logout`, {
                method: "POST",
                credentials: "include",
            });

            setUser(null);
            setDropdown(false);
        } catch (err) {
            console.log("Logout error");
        }
    };

    return (
        <header className="w-full bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* LOGO */}
                <h1 className="text-white text-xl font-semibold">
                    UnivPrepHub
                </h1>

                {/* NAV LINKS */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            className="text-white hover:text-yellow-400 transition"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* RIGHT SIDE */}
                <div className="hidden md:flex items-center gap-3 relative" ref={dropdownRef}>

                    {/* ❌ NOT LOGGED IN */}
                    {!user && (
                        <button
                            onClick={onLoginClick}
                            className="border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full hover:bg-yellow-400 hover:text-black transition"
                        >
                            Login →
                        </button>
                    )}

                    {/* ✅ LOGGED IN */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setDropdown(!dropdown)}
                                className="flex items-center gap-2 border border-yellow-400 px-3 py-1 rounded-full text-yellow-400"
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}`
                                    }
                                    alt="avatar"
                                    className="w-6 h-6 rounded-full"
                                />
                                {user.name}
                            </button>

                            {/* DROPDOWN */}
                            {dropdown && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md">
                                    <a
                                        href="/user-dashboard"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        Dashboard
                                    </a>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* MOBILE BUTTON */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-[#203a43] px-4 pb-4">
                    {navLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            className="block py-2 text-white"
                        >
                            {link.name}
                        </a>
                    ))}

                    {!user ? (
                        <button
                            onClick={onLoginClick}
                            className="w-full mt-3 border border-yellow-400 text-yellow-400 py-2 rounded"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 border border-red-400 text-red-400 py-2 rounded"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}