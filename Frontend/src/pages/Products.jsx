import { useState, useEffect } from "react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: "", price: "", stock: "", tax: "" });
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    // Fetch all products
    const fetchProducts = async () => {
        const res = await fetch("http://localhost:5000/api/v1/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => { fetchProducts(); }, []);

    // Add or Update Product
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:5000/api/v1/products/${editingId}`
            : "http://localhost:5000/api/v1/products";
        const method = editingId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(formData),
        });

        setFormData({ name: "", price: "", stock: "", tax: "" });
        setEditingId(null);
        fetchProducts();
    };

    // Edit product
    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            tax: product.tax,
        });
        setEditingId(product._id);
    };

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await fetch(`http://localhost:5000/api/v1/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Products</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
                <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border p-2" />
                <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="border p-2" />
                <input placeholder="Stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="border p-2" />
                <input placeholder="Tax %" type="number" value={formData.tax} onChange={e => setFormData({ ...formData, tax: e.target.value })} className="border p-2" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editingId ? "Update Product" : "Add Product"}
                </button>
            </form>

            {/* Products Table */}
            <table className="w-full border">
                <thead>
                    <tr>
                        <th className="border px-2">Name</th>
                        <th className="border px-2">Price</th>
                        <th className="border px-2">Stock</th>
                        <th className="border px-2">Tax</th>
                        <th className="border px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td className="border px-2">{p.name}</td>
                            <td className="border px-2">{p.price}</td>
                            <td className="border px-2">{p.stock}</td>
                            <td className="border px-2">{p.tax}</td>
                            <td className="border px-2 space-x-2">
                                <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
