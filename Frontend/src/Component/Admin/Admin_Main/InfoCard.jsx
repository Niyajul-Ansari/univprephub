export default function InfoCard({ label, value }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold mt-1">{value}</p>
        </div>
    );
}
