const mongoose = require("mongoose");
require('mongoose-double')(mongoose);

const { Schema, model } = require("mongoose");
const Product = require("../Model/product")

var SchemaTypes = mongoose.Schema.Types;
module.exports.Review = model("Review", Schema({
    reviewcount: { type: SchemaTypes.Double, required: true },
    reviewcontent: { type: String },
    reviewsname: { type: String },
    reviewersimage: { type: String },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        index: true
    }
}, { timestamps: true }))