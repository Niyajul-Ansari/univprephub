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

export default function AssignSubjects() {
    const [course, setCourse] = useState("");
    const [available, setAvailable] = useState([]);
    const [checked, setChecked] = useState({});
    const [assigned, setAssigned] = useState([]);
    const [allMappings, setAllMappings] = useState([]);

    /* AVAILABLE SUBJECTS (FROM PREMIUM CONTENT) */
    const loadAvailable = async () => {
        const res = await fetch(
            `${BACKEND_URL}/admin/course-subjects/available-subjects`,
            { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
            setAvailable(data.subjects);
        }
    };

    /* ASSIGNED FOR SELECTED COURSE */
    const loadAssigned = async (code) => {
        const res = await fetch(
            `${BACKEND_URL}/admin/course-subjects/${code}`,
            { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
            setAssigned(data.subjects);
            const map = {};
            data.subjects.forEach(s => (map[s] = true));
            setChecked(map);
        }
    };

    const loadAllMappings = async () => {
        const res = await fetch(
            `${BACKEND_URL}/admin/course-subjects`,
            { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) setAllMappings(data.data);
    };

    useEffect(() => {
        loadAvailable();
        loadAllMappings();
    }, []);

    const toggle = (s) =>
        setChecked(prev => ({ ...prev, [s]: !prev[s] }));

    const submit = async () => {
        const subjects = Object.keys(checked).filter(k => checked[k]);

        await fetch(
            `${BACKEND_URL}/admin/course-subjects/assign`,
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseCode: course, subjects })
            }
        );

        alert("Assigned");
        loadAssigned(course);
        loadAllMappings();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
                Assign Subjects to Course
            </h2>

            <select
                className="border p-2 w-full mb-4"
                value={course}
                onChange={(e) => {
                    setCourse(e.target.value);
                    loadAssigned(e.target.value);
                }}
            >
                <option value="">Select Course</option>
                {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {available.map(s => (
                    <label
                        key={s}
                        className="flex items-center justify-between gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer"
                    >
                        <span className="text-sm">{s}</span>

                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={!!checked[s]}
                                onChange={() => toggle(s)}
                                className="sr-only"
                            />

                            <div
                                className={`
                        w-10 rounded-full transition-colors duration-300
                        ${checked[s] ? "bg-blue-600" : "bg-gray-300"}
                    `}
                            >
                                <div
                                    className={`
                            w-4 h-4 bg-white rounded-full shadow
                            transform transition-transform duration-300
                            ${checked[s] ? "translate-x-5" : "translate-x-1"}
                        `}
                                />
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            <button
                onClick={submit}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Assign Subjects
            </button>

            <div className="mt-6">
                <h3 className="font-semibold mb-2">Current Assignments</h3>
                {allMappings.map(m => (
                    <div key={m.courseCode} className="text-sm mb-1">
                        <b>{m.courseCode}:</b> {m.subjects.join(", ")}
                    </div>
                ))}
            </div>
        </div>
    );
}
