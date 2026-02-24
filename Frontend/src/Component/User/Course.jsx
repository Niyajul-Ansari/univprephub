import { useState, lazy, Suspense } from "react";

const UserDashboard = lazy(() => import("./UserDashboard"));

const VIEWS = {
    HOME: "home",
    VIDEOS: "videos",
    MCQS: "mcqs"
};

export default function Course() {
    const [activeView, setActiveView] = useState(VIEWS.HOME);

    // 🔥 WHEN VIDEOS OPEN → SHOW ONLY USER DASHBOARD
    if (activeView === VIEWS.VIDEOS) {
        return (
            <Suspense fallback={<Loader />}>
                <UserDashboard />
            </Suspense>
        );
    }

    return (
        <div className="min-h-screen">

            {/* ================= COURSE HOME ================= */}
            {activeView === VIEWS.HOME && (
                <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            Access Videos & Notes
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Access to all recorded videos and notes for all subjects.
                        </p>
                        <button
                            onClick={() => setActiveView(VIEWS.VIDEOS)}
                            className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
                        >
                            Go to Videos & Notes
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow p-6">
                        <h3 className="text-xl font-semibold mb-2">
                            NCERT MCQs
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Access a comprehensive collection of NCERT MCQs.
                        </p>
                        <button
                            onClick={() => setActiveView(VIEWS.MCQS)}
                            className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
                        >
                            Go to NCERT MCQs
                        </button>
                    </div>

                </div>
            )}

            {/* ================= NCERT MCQs ================= */}
            {activeView === VIEWS.MCQS && (
                <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        📝 NCERT MCQs
                    </h2>
                    <p className="text-gray-600">
                        MCQs module will be available soon.
                    </p>
                </div>
            )}
        </div>
    );
}

/* ================= LOADER ================= */
function Loader() {
    return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            Loading...
        </div>
    );
}