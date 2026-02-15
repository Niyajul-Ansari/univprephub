import { useState } from "react";
import Header from "../Component/Web/Header";
import AuthModal from "../Component/Web/AuthModal";
import MainDashboard from "../Component/Web/MainDashboard";

export default function WebLayout() {
    const [showAuth, setShowAuth] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <>
            {/* ✅ Header ALWAYS visible */}
            <Header onLoginClick={() => setShowAuth(true)} />

            {/* ✅ Main Dashboard ALWAYS visible (testing purpose) */}
            <MainDashboard />

            {/* ✅ Auth Modal only when Login clicked */}
            {showAuth && (
                <AuthModal
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => {
                        setLoggedIn(true);
                        setShowAuth(false);
                    }}
                />
            )}
        </>
    );
}
