const express = require("express");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice"); // Your Invoice model
const Customer = require("../models/Customer"); // Customer model
const auth = require("../middleware/auth"); // Auth middleware
const router = express.Router();

// GET /api/v1/reports?fromDate=yyyy-mm-dd&toDate=yyyy-mm-dd&type=daily
router.get("/", auth, async (req, res) => {
    try {
        const { fromDate, toDate, type } = req.query;

        // Build date filter
        let dateFilter = {};
        if (fromDate || toDate) {
            dateFilter.createdAt = {};
            if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                dateFilter.createdAt.$lte = to;
            }
        }

        // Fetch invoices
        let invoices = await Invoice.find(dateFilter).populate("customer");

        // Prepare summary
        const totalInvoices = invoices.length;
        const totalSales = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        const totalTax = invoices.reduce((sum, inv) => sum + inv.taxTotal, 0);

        // Optionally group by type (daily/monthly/yearly) for chart
        if (type === "daily") {
            invoices.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (type === "monthly") {
            invoices.sort(
                (a, b) =>
                    new Date(a.createdAt).getFullYear() - new Date(b.createdAt).getFullYear() ||
                    new Date(a.createdAt).getMonth() - new Date(b.createdAt).getMonth()
            );
        } else if (type === "yearly") {
            invoices.sort(
                (a, b) => new Date(a.createdAt).getFullYear() - new Date(b.createdAt).getFullYear()
            );
        }

        res.json({
            invoices,
            totalInvoices,
            totalSales,
            totalTax
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
