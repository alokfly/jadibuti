const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const vendorSchema = Schema({
    number: { type: String, required: true },
    name: { type: String, default: null },
    profilepic: { type: String, default: null },
    address: { type: String, default: null },
    email: { type: String, default: null },
    isRegistered: { type: Boolean, default: false }
}, { timestamps: true })


vendorSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number

    }, process.env.SECRET_KEY, { expiresIn: "7d" });
    return token;
}
module.exports.Vendor = model("Vendor", vendorSchema);