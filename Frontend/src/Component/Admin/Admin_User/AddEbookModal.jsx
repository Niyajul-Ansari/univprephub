import { useState } from "react";

export default function AddEbookModal({ onClose, onAdd }) {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !subject || !description) return;

        onAdd({
            id: Date.now(),
            name,
            subject,
            description,
            pdf: "uploaded.pdf",
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-yellow-50 rounded-xl shadow-lg w-[95%] max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    Upload Ebook
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Ebook Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Ebook Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                            placeholder="Enter ebook name"
                        />
                    </div>

                    {/* Subject List */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Select Subject
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300"
                        >
                            <option value="">Select Subject</option>
                            <option>Computer Science</option>
                            <option>Mathematics</option>
                            <option>Physics</option>
                            <option>Chemistry</option>
                            <option>Biology</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300 resize-none"
                            placeholder="Short description of ebook"
                        ></textarea>
                    </div>

                    {/* Upload PDF */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Upload PDF
                        </label>
                        <input type="file" accept=".pdf" />
                    </div>

                    {/* Cover Photo */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Cover Photo
                        </label>
                        <input type="file" accept="image/*" />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                        >
                            Upload Ebook
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
