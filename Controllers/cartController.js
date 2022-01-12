const router = require("express").Router();
const Cart = require("../Model/cartModel");

/* const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("./verifyToken"); */

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}


module.exports.addcart = async (req, res) => {
    const newCart = await new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json({
            message: "Cart Addedd Successfully",
            data: savedCart
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

module.exports.getallcart = async (req, res) => {
    try {
        const getcarts = await Cart.find()
            .populate('productId')
        res.status(200).json({
            message: "Success",
            data: getcarts
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports.getsingleusercart = async (req, res) => {
    try {
        const singleCart = await Cart.find({ userId: req.params.userId })
            .populate('productId')
        res.status(200).json({
            message: "success",
            data: singleCart
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
}
//0245252912
module.exports.deletecart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Cart Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
}

