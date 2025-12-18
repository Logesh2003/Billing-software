const express = require("express");
const Customer = require("../models/Customer");
const auth = require("../middleware/auth");

const router = express.Router();

/* Create customer */
router.post("/", auth, async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* Get all customers */
router.get("/", auth, async (req, res) => {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
});

/* Update customer */
router.put("/:id", auth, async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
});

/* Delete customer */
router.delete("/:id", auth, async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
});

module.exports = router;
