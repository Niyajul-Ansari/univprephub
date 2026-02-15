import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function Notes() {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [zoom, setZoom] = useState(0.9);

    const navigate = useNavigate();

    /* ========== FETCH NOTES ========== */
    const getNotes = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/note`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });

            setNotes(res.data.notes);
        } catch (err) {
            if (err.response?.status === 401) return navigate("/login");
            console.log("Error fetching notes:", err);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    /* ========== UPLOAD NOTE ========== */
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !link) return alert("Title & Link required");

        setLoading(true);
        try {
            await axios.post(
                `${BACKEND_URL}/note`,
                { title, link },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }
            );

            alert("Note Saved Successfully!");
            setTitle("");
            setLink("");
            getNotes();
        } catch (err) {
            if (err.response?.status === 403) {
                alert("❌ Only Admin Can Upload Notes!");
            } else if (err.response?.status === 401) {
                navigate("/login");
            } else {
                alert("Error Uploading!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6">

                {/* Upload Section */}
                <h1 className="text-2xl font-semibold mb-4">
                    Upload New Notes
                </h1>

                <form onSubmit={handleUpload} className="space-y-4 border-b pb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notes Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Enter notes title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Google Drive PDF Link
                        </label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="https://drive.google.com/..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-gray-700 text-white rounded-lg"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>

                {/* Notes List */}
                <h2 className="text-xl font-semibold mt-6 mb-3">
                    Uploaded Notes
                </h2>

                <div className="max-h-64 overflow-y-auto scrollbar-hide space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => {
                                const match = note.link.match(/[-\w]{25,}/);
                                if (!match) return alert("Invalid Google Drive link");

                                const fileId = match[0];
                                const preview = `https://drive.google.com/file/d/${fileId}/preview`;
                                setSelectedPdf(preview);
                            }}
                            className="block p-4 rounded-lg bg-gradient-to-r from-yellow-100 to-green-100 shadow-sm hover:bg-yellow-200 cursor-pointer"
                        >
                            <p className="font-medium text-gray-800">
                                {note.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* PDF Preview */}
                {selectedPdf && (
                    <div className="relative w-full h-[100vh] rounded-lg overflow-hidden border shadow mt-4">
                        <div className="relative w-full h-full overflow-auto">
                            <iframe
                                src={selectedPdf}
                                className="w-full h-full origin-center pt-9"
                                style={{ transform: `scale(${zoom})` }}
                            ></iframe>

                            {/* Black overlay */}
                            <div className="absolute bg-[#1e1e1e] rounded lg:top-[68px] lg:right-[60px] lg:w-[35px] lg:h-[40px] xl:top-[75px] xl:right-[69px] z-[50]" />
                        </div>

                        <style>
                            {`
                                iframe { border: none; }
                                .pdf-top-cover {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 65px;
                                    background: white;
                                    z-index: 20;
                                }
                                .pdf-bottom-cover {
                                    position: absolute;
                                    bottom: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 45px;
                                    background: white;
                                    z-index: 20;
                                }
                            `}
                        </style>

                        <div className="pdf-top-cover"></div>
                        <div className="pdf-bottom-cover"></div>
                    </div>
                )}
            </div>

            {/* Hide Scrollbar */}
            <style>
                {`
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>
        </>
    );
}
