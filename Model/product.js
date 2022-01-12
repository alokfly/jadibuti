
const mongoose = require("mongoose")
require("mongoose-double")(mongoose);
const { Category } = require("../Model/categoryModel")

const SchemaTypes = mongoose.Schema.Types
const ProductSchema = new mongoose.Schema({
    productimage: { type: Array },
    productname: { type: String },
    status: { type: String, default:"pending" },
    specialprice: { type: SchemaTypes.Double },
    discountAvailable: { type: String },
    productinfo: { type: String },
    notes: [{ type: String }],
    hindiname: { type: String },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    }


}, { timestamps: true })
module.exports = mongoose.model("Product", ProductSchema)