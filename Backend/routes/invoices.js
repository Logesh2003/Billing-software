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
router.get("/", auth, async (req, res) => {
    const invoices = await Invoice.find()
        .populate("customer")
        .sort({ createdAt: -1 });
    res.json(invoices);
});

module.exports = router;
