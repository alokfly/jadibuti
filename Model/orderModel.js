const mongoose = require("mongoose");
const User = require("../Model/userModel");
const Product = require("../Model/product");
const Cart = require("../Model/cartModel");

const OrderSchema = new mongoose.Schema({
    /* userId: { type: String, required: true }, */
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        index: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart' ,
        index: true
    },

    totalAmount:{
        type:String,
        required:true
    },

    quantity: {
        type: Number,
        default: 1,
    },
    shippingaddress: [{
        phonenumber: { type: String },
        country: { type: String },
        state: { type: String },
        postalcode: { type: String },
        address: { type: String },
    }],
    paymentmethod: { type: String },
    itemtotal: { type: String },
    pricediscount: { type: String },
    shippingprice: { type: String },
    totalprice: { type: String },
    yousaved: { type: String },
    status: { type: String, default: "pending" },

}, { timestamps: true })
module.exports = mongoose.model("Order", OrderSchema)