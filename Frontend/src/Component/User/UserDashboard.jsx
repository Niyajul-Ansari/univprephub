import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function UserDashboard() {
    const [user, setUser] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const videoRef = useRef(null);

    // ----------- EXTRACT YOUTUBE ID (SAFE) -----------
    const getYouTubeID = (url) => {
        if (!url) return null;

        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );

        return match ? match[1] : null;
    };

    // ----------- INIT PLYR -----------
    const videoId = getYouTubeID(selectedTopic?.videoUrl);
    useEffect(() => {
        if (!videoRef.current || !videoId) return;

        const player = new Plyr(videoRef.current, {
            controls: [
                "play",
                "rewind",
                "fast-forward",
                "progress",
                "current-time",
                "duration",
                "settings",
                "fullscreen",
            ],
            settings: ["speed"],
            speed: {
                selected: 1,
                options: [0.5, 1, 1.25, 1.5, 2],
            },
        });

        return () => {
            try {
                player.pause();
            } catch (e) { }
        };
    }, [videoId]);

    // ----------- FETCH USER -----------
    const fetchUser = async () => {
        const res = await fetch(
            `${BACKEND_URL}/user/me`,
            { credentials: "include" }
        );

        if (res.status === 401) return null;
        return res.json();
    };

    // ----------- FETCH PREMIUM CONTENT -----------
    const fetchPremium = async () => {
        const res = await fetch(
            `${BACKEND_URL}/user/premium`,
            { credentials: "include" }
        );

        if (res.status === 401) return null;
        return res.json();
    };

    // ----------- LOAD DASHBOARD -----------
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const userRes = await fetchUser();

                if (!userRes?.success) {
                    window.location.href = `${FRONTEND_URL}/`;
                    return;
                }

                setUser(userRes.user);

                const premiumRes = await fetchPremium();

                if (premiumRes?.success) {
                    const formatted = premiumRes.data.map((item) => ({
                        id: item._id,
                        title: item.topicName,
                        videoUrl: item.videoLink,
                        pdfUrl: item.pdfLink
                            ? `${BACKEND_URL}/${item.pdfLink}`
                            : null,
                    }));

                    setTopics(formatted);
                    setSelectedTopic(formatted[0] || null);
                }
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // ----------- LOGOUT -----------
    const handleLogout = async () => {
        await fetch(`${BACKEND_URL}/user/logout`, {
            method: "POST",
            credentials: "include",
        });
        window.location.href = `${FRONTEND_URL}/`;
    };

    // ----------- LOADING UI -----------
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* ---------------- TOP BAR ---------------- */}
            <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden"
                    >
                        ☰
                    </button>
                    <h1 className="text-xl font-semibold">
                        Welcome, {user?.name}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <img
                        src={user?.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full border"
                    />
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* ---------------- MAIN ---------------- */}
            <div className="flex flex-1 overflow-hidden">
                {/* ---------------- SIDEBAR ---------------- */}
                <div
                    className={`
                        fixed md:static top-0 left-0 z-40
                        h-full w-64 bg-white border-r p-4
                        transform transition-transform duration-300
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0
                    `}
                >
                    <div className="flex justify-end md:hidden mb-4">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    <h2 className="text-lg font-semibold mb-4">Topics</h2>

                    <div className="space-y-2">
                        {topics.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => {
                                    setSelectedTopic(topic);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-lg transition
                                    ${selectedTopic?.id === topic.id
                                        ? "bg-yellow-200 font-medium"
                                        : "hover:bg-yellow-100"
                                    }`}
                            >
                                {topic.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MOBILE BACKDROP */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    />
                )}

                {/* ---------------- CONTENT ---------------- */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* VIDEO */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <h2 className="text-lg font-semibold mb-3">
                            {selectedTopic?.title} – Video
                        </h2>

                        {videoId ? (
                            <div key={videoId}>
                                <div
                                    ref={videoRef}
                                    className="plyr__video-embed aspect-video"
                                    data-plyr-provider="youtube"
                                    data-plyr-embed-id={videoId}
                                />
                            </div>
                        ) : (
                            <div className="text-gray-500">
                                No Video Available
                            </div>
                        )}
                    </div>

                    {/* ----------- NOTES / PDF ----------- */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h2 className="text-lg font-semibold mb-3">
                            {selectedTopic?.title} – Notes
                        </h2>

                        <div className="relative h-[80vh] overflow-y-auto overflow-x-hidden bg-white">
                            <div
                                className="
                                    w-full h-full
                                    scale-[1.08] md:scale-[1.05] lg:scale-100
                                    origin-top
                                "
                            >
                                {selectedTopic?.pdfUrl ? (
                                    <object
                                        key={selectedTopic?.pdfUrl}
                                        data={selectedTopic?.pdfUrl}
                                        type="application/pdf"
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No PDF Available
                                    </div>
                                )}
                            </div>

                            <div
                                className="
                                    absolute top-0 left-0 w-full lg:h-[60px] h-[60px]
                                    bg-yellow-100 z-20
                                    flex items-center justify-center
                                    pointer-events-auto
                                "
                            >
                                <span className="lg:text-2xl text-xl font-bold p-2">
                                    Join our official course : 9891460883
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
