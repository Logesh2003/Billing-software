const express = require("express");
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// Dashboard Stats
router.get("/stats", auth, async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesAgg = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);

        res.json({
            totalInvoices,
            totalCustomers,
            totalProducts,
            totalSales: salesAgg[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Monthly Sales for Graph
router.get("/sales-chart", auth, async (req, res) => {
    try {
        const data = await Invoice.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$grandTotal" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Summary for Paid / Pending Invoices (for charts)
router.get("/summary", auth, async (req, res) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: "PAID" });
        const pendingInvoices = await Invoice.countDocuments({ status: "PENDING" });

        const salesAgg = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$grandTotal" } } }
        ]);

        res.json({
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            totalSales: salesAgg[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
