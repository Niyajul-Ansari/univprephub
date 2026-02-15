export default function ActionCard({ title, onClick, isActive = false }) {
    return (
        <button
            onClick={onClick}
            className={`
                transition-colors duration-200
                rounded-xl p-5 text-left shadow-sm
                ${isActive
                    ? "bg-black text-white"
                    : "bg-yellow-100 hover:bg-yellow-200 text-black"
                }
            `}
        >
            <p className="font-medium">{title}</p>
        </button>
    );
}
