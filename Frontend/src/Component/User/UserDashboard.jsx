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

    const getYouTubeID = (url) => {
        if (!url) return null;
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
    };

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
            } catch { }
        };
    }, [videoId]);

    const fetchUser = async () => {
        const res = await fetch(`${BACKEND_URL}/user/me`, {
            credentials: "include",
        });
        if (res.status === 401) return null;
        return res.json();
    };

    const fetchPremium = async () => {
        const res = await fetch(`${BACKEND_URL}/user/premium`, {
            credentials: "include",
        });
        if (res.status === 401) return null;
        return res.json();
    };

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
                        subject: item.subject,
                        videoUrl: item.videoLink,
                        pdfUrl: item.pdfLink
                            ? `${BACKEND_URL}/${item.pdfLink}`
                            : null,
                    }));

                    setTopics(formatted);
                    setSelectedTopic(formatted[0] || null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleLogout = async () => {
        await fetch(`${BACKEND_URL}/user/logout`, {
            method: "POST",
            credentials: "include",
        });
        window.location.href = `${FRONTEND_URL}/`;
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Loading Dashboard...
            </div>
        );
    }

    const subjects = [...new Set(topics.map((t) => t.subject))];

    return (
        <div className="h-screen overflow-hidden bg-gray-100">
            <div className="flex h-full">
                {/* ---------------- SIDEBAR ---------------- */}
                <div
                    className={`
                        fixed md:static top-0 left-0 z-40
                        h-full w-64 bg-gray-200 p-4
                        overflow-y-auto
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

                    <h2 className="text-lg font-semibold mb-4">Subjects</h2>

                    {subjects.map((subject) => (
                        <div key={subject} className="mb-4">
                            <div className="font-semibold text-gray-700 mb-2">
                                {subject}
                            </div>

                            <div className="space-y-1 ml-2">
                                {topics
                                    .filter((t) => t.subject === subject)
                                    .map((topic) => (
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
                    ))}
                </div>

                {/* ---------------- RIGHT SIDE (HEADER + CONTENT SCROLL TOGETHER) ---------------- */}
                <div className="flex-1 h-full overflow-hidden">
                    <main className="h-full overflow-y-auto">
                        {/* HEADER (SCROLLS WITH CONTENT) */}
                        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="md:hidden text-xl"
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

                        {/* VIDEO */}
                        <div className="p-1">
                            <div className="bg-yellow-100 shadow-sm pt-2 pl-4 pr-1 mb-6">
                                <h2 className="text-lg font-semibold mb-3">
                                    {selectedTopic?.title} – Video
                                </h2>

                                {videoId ? (
                                    <div key={videoId}>
                                        <div
                                            ref={videoRef}
                                            className="plyr__video-embed aspect-video lg:w-full lg:h-[50vh]"
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

                            {/* NOTES */}
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <h2 className="text-lg font-semibold mb-3">
                                    {selectedTopic?.title} – Notes
                                </h2>

                                {/* ===== PDF AVAILABLE ===== */}
                                {selectedTopic?.pdfUrl && selectedTopic.pdfUrl.trim() !== "" ? (
                                    <div className="relative h-[85vh] overflow-y-auto bg-white border rounded-lg">
                                        {/* PDF VIEW */}
                                        <object
                                            data={selectedTopic.pdfUrl}
                                            type="application/pdf"
                                            className="w-full h-full"
                                        />

                                        {/* TOP OVERLAY (ONLY WHEN PDF EXISTS) */}
                                        <div className="absolute top-0 left-0 w-full h-[60px] bg-yellow-100 z-20 flex items-center justify-center">
                                            <span className="text-xl font-bold p-2">
                                                Join our official course : 9891460883
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    /* ===== EMPTY STATE ===== */
                                    <div className="h-40 flex flex-col items-center justify-center bg-gray-50 border border-dashed rounded-lg text-gray-500">
                                        <span className="text-lg font-medium">
                                            Notes not available
                                        </span>
                                        <span className="text-sm mt-1">
                                            This topic does not have PDF notes yet
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}