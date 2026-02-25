import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const COURSES = [
    "B05: BA (Hons) Political Science & BA Program",
    "B55: BA (Hons) Geography, Sociology, Psychology",
    "B67: BSW Bachelor in Social Work",
    "B26: B.A.LL.B (Hons)",
    "AMU BA (Hons)",
    "AMU BALLB",
    "AMU BBA, BCOM",
    "BA (Hons) German",
    "BA (Hons) Japanese",
    "BA (Hons) Islamic Studies",
    "B03: BA (Hons) History",
    "B04: BBA BCOM (Hons)",
    "Mock Tests (BBA BCOM)",
    "Mock Tests (History)",
    "Mock Tests (BA LLB)",
    "Mock Test (Economics)",
];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [detailsPopup, setDetailsPopup] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [popup, setPopup] = useState(null);

    const [course, setCourse] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [secretInput, setSecretInput] = useState("");

    /* ================= FETCH USERS ================= */
    const getUsers = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/admin/users`, {
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                const safeUsers = data.users.map((u) => ({
                    ...u,
                    permissions: u.permissions || {
                        ebook: { access: false },
                    },
                }));
                setUsers(safeUsers);
            }
        } catch (err) {
            console.error("Fetch users error:", err);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    /* ================= DETAILS ================= */
    const openDetails = (user) => {
        const freshUser = users.find((u) => u._id === user._id);
        setSelectedUser(freshUser || user);
        setDetailsPopup(freshUser || user);
    };

    const closeDetails = () => setDetailsPopup(null);

    /* ================= ACCESS POPUP ================= */
    const openPopup = (type, action) => {
        setDetailsPopup(null);

        setEmailInput(selectedUser?.email || "");
        setSecretInput(selectedUser?.secretCode || "");
        setCourse("");

        setPopup({ type, action });
    };

    const closePopup = () => {
        setPopup(null);
        setEmailInput("");
        setSecretInput("");
        setCourse("");
    };

    /* ================= SUBMIT ================= */
    const submitAccess = async () => {
        if (!popup) return;

        if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
            alert("Please enter a valid email");
            return;
        }

        if (!secretInput || secretInput.length !== 5) {
            alert("Secret must be exactly 5 digits");
            return;
        }

        if (popup.action === "grant" && popup.type === "video" && !course) {
            alert("Please select a course to assign with premium access");
            return;
        }

        let endpoint = "";
        let body = {
            email: emailInput,
            secretCode: secretInput,
        };

        // PREMIUM (VIDEO)
        if (popup.action === "grant" && popup.type === "video") {
            endpoint = "grant-premium";
            body.course = course;
        }

        if (popup.action === "take" && popup.type === "video") {
            endpoint = "take-premium";
        }

        // NOTES → EBOOK (LOGIC FIX ONLY)
        if (popup.action === "grant" && popup.type === "notes") {
            endpoint = "grant-access";
        }

        if (popup.action === "take" && popup.type === "notes") {
            endpoint = "take-access";
        }

        if (!endpoint) return;

        try {
            const res = await fetch(`${BACKEND_URL}/admin/${endpoint}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.success) {
                alert(data.message || "Success");
                closePopup();
                getUsers();
            } else {
                alert(data.message || "Operation failed");
            }
        } catch {
            alert("Network error");
        }
    };

    return (
        <>
            {/* ================= USERS TABLE ================= */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-center">Video</th>
                            <th className="px-4 py-2 text-center">Notes</th>
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{u.name}</td>
                                <td className="px-4 py-3">{u.email}</td>

                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${u.isApproved
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {u.isApproved ? "Enabled" : "Disabled"}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${u.permissions?.ebook?.access
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {u.permissions?.ebook?.access
                                            ? "Enabled"
                                            : "Disabled"}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => openDetails(u)}
                                        className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= ADMIN ACTIONS ================= */}
            <div className="flex justify-center mb-10">
                <div className="w-full max-w-3xl bg-pink-50 border border-pink-300 rounded-2xl p-6 text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                        Admin Actions
                    </h3>

                    <div className="flex flex-col items-center gap-3">
                        <button
                            onClick={() => openPopup("video", "grant")}
                            className="w-56 bg-green-600 text-white py-2 rounded"
                        >
                            Give Premium Access +
                        </button>

                        <button
                            onClick={() => openPopup("video", "take")}
                            className="w-56 bg-red-600 text-white py-2 rounded"
                        >
                            Take Premium Access −
                        </button>

                        <button
                            onClick={() => openPopup("notes", "grant")}
                            className="w-56 bg-green-700 text-white py-2 rounded"
                        >
                            Give Notes Access +
                        </button>

                        <button
                            onClick={() => openPopup("notes", "take")}
                            className="w-56 bg-red-700 text-white py-2 rounded"
                        >
                            Take Notes Access −
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= DETAILS POPUP ================= */}
            {detailsPopup && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 relative text-center">
                        <button
                            onClick={closeDetails}
                            className="absolute top-3 right-3 text-lg"
                        >
                            ✕
                        </button>

                        <img
                            src={
                                detailsPopup.avatar ||
                                "https://i.pravatar.cc/120"
                            }
                            className="mx-auto rounded-full mb-3 w-24 h-24 object-cover"
                            alt="profile"
                        />

                        <h3 className="font-semibold text-lg">
                            {detailsPopup.name}
                        </h3>

                        <p className="text-gray-600 text-sm">
                            {detailsPopup.email}
                        </p>

                        <div className="mt-4 text-sm">
                            <b>Secret Code:</b>{" "}
                            <span className="tracking-widest">
                                {detailsPopup.secretCode || "—"}
                            </span>
                        </div>

                        <div className="mt-3 text-sm">
                            <b>Assigned Course:</b>
                            <p className="text-gray-600 mt-1">
                                {detailsPopup.assignedCourse || "No course assigned"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ACCESS POPUP ================= */}
            {popup && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 relative">
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 text-lg"
                        >
                            ✕
                        </button>

                        <h2 className="font-semibold mb-3 text-lg">
                            {popup.action === "grant"
                                ? popup.type === "video"
                                    ? "Grant Premium Access"
                                    : "Grant Notes Access"
                                : popup.type === "video"
                                    ? "Take Premium Access"
                                    : "Take Notes Access"}
                        </h2>

                        <input
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Email"
                            className="w-full mb-2 p-2 border rounded"
                        />

                        <input
                            value={secretInput}
                            onChange={(e) =>
                                setSecretInput(
                                    e.target.value.replace(/\D/g, "").slice(0, 5)
                                )
                            }
                            placeholder="5 digit secret"
                            className="w-full mb-2 p-2 border rounded"
                        />

                        {popup.action === "grant" && popup.type === "video" && (
                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full mb-3 p-2 border rounded"
                            >
                                <option value="">Select Course</option>
                                {COURSES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={submitAccess}
                            className={`w-full py-2 rounded text-white ${popup.action === "grant"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}