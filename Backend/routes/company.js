const express = require("express");
const Company = require("../models/Company");
const auth = require("../middleware/auth");

const router = express.Router();

/* Create / Update company (admin – once) */
router.post("/", auth, async (req, res) => {
    const existing = await Company.findOne();
    if (existing) {
        const updated = await Company.findByIdAndUpdate(
            existing._id,
            req.body,
            { new: true }
        );
        return res.json(updated);
    }

    const company = await Company.create(req.body);
    res.json(company);
});

/* Get company */
router.get("/", async (req, res) => {
    const company = await Company.findOne();
    res.json(company);
});

module.exports = router;
