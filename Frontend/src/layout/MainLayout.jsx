import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ user, onLogout }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 bg-gray-100">
                <Header user={user} onLogout={onLogout} />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
