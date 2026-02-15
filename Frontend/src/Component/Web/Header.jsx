export default function Header({ onLoginClick }) {
    return (
        <header className="bg-[#1c2b2b] text-white">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <h1 className="text-xl font-semibold">
                    UnivPrepHub
                </h1>

                <button
                    onClick={onLoginClick}
                    className="border border-yellow-400 text-yellow-400 px-4 py-1.5 rounded-md text-sm hover:bg-yellow-400 hover:text-black transition"
                >
                    Login →
                </button>
            </div>
        </header>
    );
}
