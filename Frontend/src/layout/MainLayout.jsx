import { Navigate, Outlet } from "react-router-dom";

export default function MainLayout() {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 bg-gray-100">
                <Header />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
