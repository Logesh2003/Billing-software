import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        customerId: "",
        fromDate: "",
        toDate: "",
        invoiceNumber: ""
    });

    const filteredInvoices = invoices.filter((inv) => {
        if (!filters.invoiceNumber) return true;
        return inv.invoiceNumber === filters.invoiceNumber;
    });

    const fetchInvoices = async () => {
        const params = new URLSearchParams(filters).toString();

        const res = await fetch(
            `http://localhost:5000/api/v1/invoices?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();
        setInvoices(data);
    };


    useEffect(() => {
        fetch("http://localhost:5000/api/v1/invoices/getAllInvoices", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setInvoices(data));
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Invoices</h2>
            <div className="flex gap-3 mb-4">
                <select
                    className="border p-2 rounded"
                    value={filters.invoiceNumber}
                    onChange={(e) =>
                        setFilters({ ...filters, invoiceNumber: e.target.value })
                    }
                >
                    <option value="">All Invoices</option>

                    {invoices.map((inv) => (
                        <option key={inv._id} value={inv.invoiceNumber}>
                            {inv.invoiceNumber}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.fromDate}
                    onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                    }
                />

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.toDate}
                    onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                    }
                />

                <button
                    className="bg-blue-600 text-white px-4 rounded"
                    onClick={fetchInvoices}
                >
                    Filter
                </button>
            </div>


            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Invoice No</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-right">Total</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.map(inv => (
                        <tr key={inv._id} className="border-t border-gray-200">
                            <td className="p-3 text-left">{inv.invoiceNumber}</td>
                            <td className="p-3 text-left">{inv.customer?.name}</td>
                            <td className="p-3 text-left">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 text-right font-semibold">₹{inv.grandTotal}</td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => navigate(`/invoices/${inv._id}`)}
                                    className="bg-blue-600 text-white px-4 py-1 rounded"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}

                    {filteredInvoices.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center p-4 text-gray-500">
                                No invoices found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}
