const mongoose = require("mongoose");
const { User } = require("../Model/userModel");

const UserProfileSchema = mongoose.Schema({

    hindiname: { type: String, default: "null" },
    profilepic: { type: String, default: "null" },
    address: { type: String, default: "null" },
    email: { type: String, default: "null" },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        index: true
    }

}, { timestamps: true })
module.exports = mongoose.model("UserProfile", UserProfileSchema);