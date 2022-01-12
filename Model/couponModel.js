const mongoose = require("mongoose");
const Product = require("../Model/product")
const { User } = require("../Model/userModel")

const CouponSchema = mongoose.Schema({
    couponcode: { type: String, required: true },
    
    expirydate: { 
        type: String, 
        required: true 
    },
   
    couponamont: { 
        type: String,
     required: true 
 },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        index: true,
        default: null
    },

    



}, { timestamps: true });
module.exports = mongoose.model("Coupon", CouponSchema)