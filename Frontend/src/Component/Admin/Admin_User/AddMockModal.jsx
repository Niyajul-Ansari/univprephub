import { useState } from "react";

export default function AddMockModal({ onClose, onAdd }) {
    const [title, setTitle] = useState("");
    const [pdfLink, setPdfLink] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !pdfLink) return;

        onAdd({
            id: Date.now(),
            title,
            pdf: pdfLink,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-yellow-50 rounded-xl shadow-lg w-[90%] max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    Add Mock Test
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mock Test Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="MOCK TEST - 6"
                        />
                    </div>

                    {/* PDF Link */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            PDF Link
                        </label>
                        <input
                            type="text"
                            value={pdfLink}
                            onChange={(e) => setPdfLink(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-300"
                            placeholder="mock_tests/mock6.pdf"
                        />
                    </div>

                    {/* Upload Button (UI only) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Upload PDF
                        </label>
                        <input
                            type="file"
                            className="w-full text-sm"
                            accept=".pdf"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
