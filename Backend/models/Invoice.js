const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, required: true },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                qty: Number,
                price: Number,
                tax: Number,
                total: Number
            }
        ],
        subTotal: Number,
        taxTotal: Number,
        grandTotal: Number,
        status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
