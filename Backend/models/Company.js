const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: String,
        email: String,
        phone: String,
        gstNumber: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
