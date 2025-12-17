import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            onLogin(data.name, data.token);
            navigate("/"); // redirect to Dashboard
        } else {
            alert(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
    );
}
