import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function ProtectedUser({ children }) {
    const [checking, setChecking] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/user/me`, {
            credentials: "include"
        })
            .then(async (res) => {
                if (res.status === 401) {
                    alert("⚠️ Please login first to access User Dashboard!");
                    window.location.href = `${FRONTEND_URL}/`;
                    return;
                }

                if (res.status === 403) {
                    alert("⚠️ Your account is not approved by admin yet!");
                    window.location.href = `${FRONTEND_URL}/`;
                    return;
                }

                const data = await res.json();
                if (data?.success) {
                    setAuthorized(true);
                } else {
                    alert("⚠️ Access denied!");
                    window.location.href = `${FRONTEND_URL}/`;
                }
            })
            .catch(() => {
                alert("⚠️ Something went wrong, please login again!");
                window.location.href = `${FRONTEND_URL}/`;
            })
            .finally(() => setChecking(false));
    }, []);

    if (checking) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl">
                Checking access...
            </div>
        );
    }

    return authorized ? children : null;
}
