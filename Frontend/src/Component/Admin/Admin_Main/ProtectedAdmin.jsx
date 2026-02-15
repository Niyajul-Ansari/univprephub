import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function ProtectedAdmin({ children }) {
    const [checking, setChecking] = useState(true);  // loading state
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/admin`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAuthorized(true);
                } else {
                    window.location.href = `${FRONTEND_URL}/`;
                }
            })
            .catch(() => window.location.href = `${FRONTEND_URL}/`)
            .finally(() => setChecking(false));
    }, []);

    // 🚨 VERY IMPORTANT → DO NOT RENDER CHILD BEFORE AUTH CHECK
    if (checking) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl">
                Checking admin access...
            </div>
        );
    }

    return authorized ? children : null;
}
