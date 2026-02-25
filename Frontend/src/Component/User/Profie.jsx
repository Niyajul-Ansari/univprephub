import { useEffect, useState } from "react";
import Course from "./Course";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Profile() {
    const [activeComponent, setActiveComponent] = useState("profile");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH USER PROFILE =================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/user/me`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await res.json();

                if (!data.success) {
                    throw new Error("Failed to load profile");
                }

                setUser(data.user);
            } catch (err) {
                setError("Unable to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ================= LOGOUT =================
    const handleLogout = async () => {
        await fetch(`${API_URL}/user/logout`, {
            method: "POST",
            credentials: "include"
        });
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    // ✅ FIXED: NOTES → EBOOK (NO EXPIRY)
    const isEbookSubscriber = user?.permissions?.ebook?.access === true;

    return (
        <div className="min-h-screen bg-slate-200">

            {/* ================= NAVBAR ================= */}
            <nav className="bg-slate-300 px-6 py-4 flex items-center gap-6">
                <div
                    className="bg-white p-2 rounded-lg shadow cursor-pointer"
                    onClick={() => setActiveComponent("profile")}
                >
                    🏠
                </div>

                <button className="text-blue-600 font-medium">
                    Live Sessions
                </button>

                <button
                    onClick={() => setActiveComponent("course")}
                    className={`font-medium ${activeComponent === "course"
                            ? "text-black"
                            : "text-blue-600"
                        }`}
                >
                    Course
                </button>
            </nav>

            {/* ================= PROFILE VIEW ================= */}
            {activeComponent === "profile" && (
                <>
                    {/* PROFILE CARD */}
                    <div className="max-w-5xl mx-auto mt-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow p-6">

                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                                🛡 Premium Profile
                            </h2>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 font-medium"
                            >
                                Logout →
                            </button>
                        </div>

                        <p className="mt-4 text-gray-600">
                            You are logged in!
                        </p>

                        <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
                            {/* PROFILE IMAGE */}
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="w-32 h-32 rounded-xl object-cover"
                            />

                            {/* USER INFO */}
                            <div className="space-y-2">
                                <p className="text-lg font-medium">
                                    Name:{" "}
                                    <span className="font-normal">
                                        {user.name}
                                    </span>
                                </p>

                                <p className="text-gray-700">
                                    Email: {user.email}
                                </p>

                                <p className="flex items-center gap-2 text-gray-700">
                                    Ebook Subscription:
                                    <span
                                        className={`font-bold ${isEbookSubscriber
                                                ? "text-green-600"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {isEbookSubscriber ? "✔" : "✖"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ================= UPLOAD ALERT ================= */}
                    {!user.avatar && (
                        <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow p-4 flex justify-between items-center">
                            <p className="text-blue-600">
                                ℹ You have not uploaded your profile image.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                                Upload
                            </button>
                        </div>
                    )}

                    {/* ================= EBOOK SUBSCRIBER CARD ================= */}
                    {isEbookSubscriber && (
                        <div className="max-w-5xl mx-auto mt-6 bg-white border border-green-500 rounded-xl shadow p-6">
                            <h3 className="text-xl font-semibold mb-3">
                                Ebook Subscriber
                            </h3>

                            <p className="flex items-center gap-2 text-green-600 font-medium mb-4">
                                🏆 Congratulations! You are an Ebook Subscriber.
                            </p>

                            <button className="bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200">
                                View Ebooks
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ================= COURSE VIEW ================= */}
            {activeComponent === "course" && <Course />}
        </div>
    );
}