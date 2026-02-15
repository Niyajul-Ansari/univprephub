export default function Topbar({ adminName, onMenuClick }) {
    return (
        <header
            className="
                fixed top-0 left-0 z-30 lg:z-50
                w-full h-16
                bg-[#282828] text-white
                px-4 md:px-8
                flex justify-between items-center
            "
        >
            {/* Left */}
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-yellow-400 text-2xl"
                >
                    ☰
                </button>

                <h1 className="text-lg font-semibold text-yellow-400">
                    UnivPrepHub
                </h1>
            </div>

            {/* Right */}
            <nav className="hidden md:flex items-center gap-6">
                <a className="hover:text-yellow-400" href="#">Home</a>
                <a className="hover:text-yellow-400" href="#">Premium</a>
                <a className="hover:text-yellow-400" href="#">Notes</a>
                <a className="hover:text-yellow-400" href="#">YouTube</a>

                <button className="bg-yellow-400 text-[#282828] px-4 py-1 rounded-lg font-medium">
                    {adminName} ▾
                </button>
            </nav>
        </header>
    );
}
