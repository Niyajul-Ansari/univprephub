import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function AuthModal({ onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const resetFields = () => {
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleLogin = async () => {
        const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        // NOT APPROVED
        if (data.pending) {
            alert("Your account is pending admin approval.");
            onClose();                          // close modal
            window.location.href = `${FRONTEND_URL}/`; // redirect to homepage
            return;
        }

        // WRONG CREDENTIALS
        if (!data.success) {
            alert(data.message || "Login failed");
            return;
        }

        // SUCCESS
        resetFields();
        if (data.role === "admin") {
            window.location.href = `${FRONTEND_URL}/admin`;
        } else {
            window.location.href = `${FRONTEND_URL}/user-dashboard`;
        }
    };

    const handleRegister = async () => {
        const res = await fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Registration failed");
            return;
        }

        alert("Registration successful! Please login.");
        resetFields();     // clear form
        setIsLogin(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[90%] max-w-md p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                {/* Google Auth */}
                <button
                    className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 mb-4 hover:bg-gray-50"
                    onClick={() =>
                        window.location.href = `${BACKEND_URL}/auth/google`
                    }
                >
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        className="w-5 h-5"
                        alt="google"
                    />
                    {isLogin ? "Login with Google" : "Sign up with Google"}
                </button>

                <div className="text-center text-gray-400 text-sm mb-4">
                    OR
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        isLogin ? handleLogin() : handleRegister();
                    }}
                    className="space-y-4"
                >
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border rounded-lg px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded-lg px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border rounded-lg px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {isLogin && (
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" />
                            Remember me
                        </label>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#1c2b2b] text-white py-2 rounded-lg hover:bg-black"
                    >
                        {isLogin ? "Login" : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-yellow-600 font-medium"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}
