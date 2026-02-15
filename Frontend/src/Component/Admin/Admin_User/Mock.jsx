import { useState } from "react";
import AddMockModal from "./AddMockModal";

export default function Mock() {
    const [showModal, setShowModal] = useState(false);

    const [mockTests, setMockTests] = useState([
        {
            id: 1,
            title: "MOCK TEST - 1",
            pdf: "mock_tests/mock1.pdf",
        },
        {
            id: 2,
            title: "MOCK TEST - 2",
            pdf: "mock_tests/mock2.pdf",
        },
    ]);

    const addMockTest = (newMock) => {
        setMockTests([...mockTests, newMock]);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h1 className="text-2xl font-semibold">
                        MOCK Tests
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
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left">
                                    PDF
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {mockTests.map((mock, index) => (
                                <tr
                                    key={mock.id}
                                    className={`border-b ${index % 2 === 0
                                            ? "bg-white"
                                            : "bg-yellow-50"
                                        }`}
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {mock.title}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {mock.pdf}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="px-3 py-1 bg-cyan-500 text-white rounded-md text-xs">
                                                View
                                            </button>
                                            <button className="px-3 py-1 bg-red-500 text-white rounded-md text-xs">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <AddMockModal
                    onClose={() => setShowModal(false)}
                    onAdd={addMockTest}
                />
            )}
        </>
    );
}
