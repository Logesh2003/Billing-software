import { useEffect, useState } from "react";

export default function Billing() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [customer, setCustomer] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/customers", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(setCustomers);

        fetch("http://localhost:5000/api/v1/products", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(setProducts);
    }, []);

    const addItem = (p) => {
        setItems([...items, {
            product: p._id,
            name: p.name,
            qty: 1,
            price: p.price,
            tax: p.tax
        }]);
    };

    const totals = items.reduce((acc, i) => {
        const taxAmount = (i.price * i.qty * i.tax) / 100;
        const total = i.price * i.qty + taxAmount;
        acc.sub += i.price * i.qty;
        acc.tax += taxAmount;
        acc.grand += total;
        return acc;
    }, { sub: 0, tax: 0, grand: 0 });

    const saveInvoice = async () => {
        await fetch("http://localhost:5000/api/v1/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                invoiceNumber: "INV-" + Date.now(),
                customer,
                items,
                subTotal: totals.sub,
                taxTotal: totals.tax,
                grandTotal: totals.grand
            })
        });
        alert("Invoice created");
        setItems([]);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create Invoice</h2>

            <select className="border p-2 rounded" onChange={e => setCustomer(e.target.value)}>
                <option value="">Select Customer</option>
                {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                    <button
                        key={p._id}
                        onClick={() => addItem(p)}
                        className="border p-2 rounded hover:bg-gray-100"
                    >
                        {p.name} - ₹{p.price}
                    </button>
                ))}
            </div>

            <div className="bg-white shadow rounded p-4">
                {items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{i.name} x {i.qty}</span>
                        <span>₹{(i.price * i.qty).toFixed(2)}</span>
                    </div>
                ))}
                <hr className="my-2" />
                <div>Subtotal: ₹{totals.sub}</div>
                <div>Tax: ₹{totals.tax}</div>
                <div className="font-bold">Total: ₹{totals.grand}</div>
            </div>

            <button
                onClick={saveInvoice}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={!customer || items.length === 0}
            >
                Save Invoice
            </button>
        </div>
    );
}
