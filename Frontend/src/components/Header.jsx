export default function Header() {
    return (
        <div className="bg-white shadow p-4 flex justify-between">
            <h1 className="font-semibold">Dashboard</h1>
            <button className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
            </button>
        </div>
    );
}
