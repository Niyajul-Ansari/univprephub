export default function MainDashboard() {
    return (
        <div className="min-h-screen bg-yellow-50 p-6">
            <h1 className="text-2xl font-semibold mb-4">
                Main Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {["Courses", "Mock Tests", "Ebooks", "Notes"].map((item) => (
                    <div
                        key={item}
                        className="bg-white rounded-xl shadow-sm p-5"
                    >
                        <p className="text-gray-500 text-sm">
                            {item}
                        </p>
                        <p className="text-2xl font-semibold mt-2">
                            10+
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
