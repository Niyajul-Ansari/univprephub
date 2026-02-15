import { useState } from "react";
import AddEbookModal from "./AddEbookModal";

export default function Ebooks() {
    const [showModal, setShowModal] = useState(false);

    const [ebooks, setEbooks] = useState([
        {
            id: 1,
            name: "Data Structures Basics",
            subject: "Computer Science",
            description: "Beginner friendly guide to Data Structures",
            pdf: "ebooks/dsa.pdf",
        },
    ]);

    const addEbook = (ebook) => {
        setEbooks([...ebooks, ebook]);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="text-2xl font-semibold">
                        Ebooks
                    </h1>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-10 h-10 rounded-lg bg-gray-700 text-white text-xl hover:bg-gray-800"
                    >
                        +
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Ebook Name
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {ebooks.map((ebook, index) => (
                                <tr
                                    key={ebook.id}
                                    className={`border-b ${index % 2 === 0
                                            ? "bg-white"
                                            : "bg-yellow-50"
                                        }`}
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {ebook.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {ebook.subject}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {ebook.description}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button className="px-3 py-1 bg-cyan-500 text-white rounded-md text-xs">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <AddEbookModal
                    onClose={() => setShowModal(false)}
                    onAdd={addEbook}
                />
            )}
        </>
    );
}
