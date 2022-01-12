const {model,Schema} = require("mongoose")


const CartSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref:"User",
         },

    productId: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref:"Product",
         },

    quantity: {
        type: Number,
        default: 1,
    }

}, { timestamps: true })
module.exports = model("Cart", CartSchema)

