import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SUBJECTS = [
    "Current Affairs & GK GS",
    "MCQ Bucket",
    "Quick Course",
    "Crash Course (50 Days)",
    "Indian Polity",
    "Indian History",
    "Indian Geography",
    "Sociology",
    "Psychology",
    "Business Studies",
    "Economics",
    "Accountancy",
    "Reasoning",
    "PYQs Analysis",
    "Mock Tests",
    "B03 Special",
    "B05 Special",
    "B26 Special",
    "B55 Special",
    "B67 Special",
    "AMU Special",
    "Marathon",
    "Islamic Studies",
    "German",
    "Japanese",
    "Legal Aptitude",
    "JMI CUET Special",
    "General English"
];

export default function PremiumContent() {
    const [contents, setContents] = useState([]);
    const [popup, setPopup] = useState(null);

    const [form, setForm] = useState({
        subject: "",
        topicName: "",
        videoLink: "",
        pdf: null
    });

    /* ================= FETCH ================= */
    const getContents = async () => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/admin/premium/all`,
                { credentials: "include" }
            );

            const data = await res.json();
            console.log("FULL API RESPONSE:", data);

            // Backend direct array bhej raha hai
            if (Array.isArray(data)) {
                setContents(data);
            } else {
                setContents([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setContents([]);
        }
    };

    useEffect(() => {
        getContents();
    }, []);

    /* ================= POPUP ================= */
    const openPopup = (item = null) => {
        if (item) {
            setForm({ ...item, pdf: null });
        } else {
            setForm({
                subject: "",
                topicName: "",
                videoLink: "",
                pdf: null
            });
        }
        setPopup(item ? "edit" : "add");
    };

    const closePopup = () => setPopup(null);

    /* ================= SUBMIT ================= */
    const submitContent = async () => {
        if (!form.subject || !form.topicName) {
            alert("Subject & Topic required");
            return;
        }

        const url =
            popup === "edit"
                ? `${BACKEND_URL}/admin/premium/${form._id}`
                : `${BACKEND_URL}/admin/premium/create`;

        const formData = new FormData();
        formData.append("subject", form.subject);
        formData.append("topicName", form.topicName);
        formData.append("videoLink", form.videoLink || "");

        if (form.pdf) {
            formData.append("pdf", form.pdf);
        }

        try {
            const res = await fetch(url, {
                method: popup === "edit" ? "PUT" : "POST",
                credentials: "include",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message || "Success");
                closePopup();
                getContents();
            } else {
                alert("Failed");
            }
        } catch {
            alert("Network error");
        }
    };

    /* ================= TOGGLE ================= */
    const toggleHide = async (id) => {
        await fetch(
            `${BACKEND_URL}/admin/premium/toggle/${id}`,
            {
                method: "PUT",
                credentials: "include"
            }
        );
        getContents();
    };

    return (
        <>
            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        Premium Content
                    </h2>
                    <button
                        onClick={() => openPopup()}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        + Add Content
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-2">
                    Total records: {contents.length}
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>Subject</th>
                                <th>Topic</th>
                                <th>Video</th>
                                <th>PDF</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {contents.map((c) => (
                                <tr key={c._id} className="border-b text-center">
                                    <td>{c.subject}</td>
                                    <td>{c.topicName}</td>

                                    {/* VIDEO — NOT CLICKABLE */}
                                    <td>
                                        {c.videoLink && c.videoLink.trim() !== "" ? (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>

                                    {/* PDF — NOT CLICKABLE */}
                                    <td>
                                        {c.pdfLink && c.pdfLink.trim() !== "" ? (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${c.isHidden
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                }`}
                                        >
                                            {c.isHidden ? "Hidden" : "Visible"}
                                        </span>
                                    </td>

                                    <td className="flex gap-2 justify-center py-2">
                                        <button
                                            onClick={() => openPopup(c)}
                                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => toggleHide(c._id)}
                                            className="px-3 py-1 bg-gray-200 rounded"
                                        >
                                            Toggle
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {contents.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-6 text-gray-500 text-center"
                                    >
                                        No premium content found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= POPUP ================= */}
            {popup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 relative">
                        <button
                            onClick={closePopup}
                            className="absolute top-3 right-3 text-lg"
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-semibold mb-3">
                            {popup === "add"
                                ? "Add Premium Content"
                                : "Edit Premium Content"}
                        </h3>

                        <select
                            value={form.subject}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    subject: e.target.value
                                })
                            }
                            className="w-full p-2 mb-2 border rounded"
                        >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>

                        <input
                            value={form.topicName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    topicName: e.target.value
                                })
                            }
                            placeholder="Topic Name"
                            className="w-full p-2 mb-2 border rounded"
                        />

                        <input
                            value={form.videoLink}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    videoLink: e.target.value
                                })
                            }
                            placeholder="Video Link"
                            className="w-full p-2 mb-2 border rounded"
                        />

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    pdf: e.target.files[0]
                                })
                            }
                            className="w-full p-2 mb-4 border rounded"
                        />

                        <button
                            onClick={submitContent}
                            className="w-full bg-green-600 text-white py-2 rounded"
                        >
                            {popup === "add"
                                ? "Save Content"
                                : "Update Content"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}