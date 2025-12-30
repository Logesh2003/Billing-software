const express = require("express");
const Invoice = require("../models/Invoice");
const auth = require("../middleware/auth");

const router = express.Router();


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

router.post("/:id/pay", auth, async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        if (invoice.status === "PAID") {
            return res.status(400).json({ message: "Invoice is already paid" });
        }

        invoice.status = "PAID";
        invoice.paidAt = new Date(); // optional: track payment date
        await invoice.save();

        res.status(200).json({ message: "Invoice paid successfully", invoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
