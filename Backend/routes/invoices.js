const express = require("express");
const Invoice = require("../models/Invoice");
const auth = require("../middleware/auth");

const router = express.Router();


async function getMonthlyReport(month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const invoices = await Invoice.find({
        createdAt: { $gte: start, $lte: end }
    }).populate("customer");

    return invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        customer: inv.customer.name,
        total: inv.grandTotal
    }));
}

/* Create Invoice */
router.post("/", auth, async (req, res) => {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
});

/* Get All Invoices */
router.get("/getAllInvoices", auth, async (req, res) => {
    const invoices = await Invoice.find()
        .populate("customer")
        .sort({ createdAt: -1 });
    res.json(invoices);
});

/* Get single invoice */
router.get("/:id", auth, async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate("customer")
        .populate("items.product");

    res.json(invoice);
});


router.get("/", auth, async (req, res) => {
    const { invoiceNumber, customerId, fromDate, toDate } = req.query;

    let filter = {};

    if (invoiceNumber) {
        filter.invoiceNumber = { $regex: invoiceNumber, $options: "i" };
    }

    if (customerId) {
        filter.customer = customerId;
    }

    if (fromDate && toDate) {
        filter.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate),
        };
    }

    const invoices = await Invoice.find(filter)
        .populate("customer")
        .sort({ createdAt: -1 });

    res.json(invoices);
});


module.exports = router;
