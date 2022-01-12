const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema({
    bannerimage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Banner", BannerSchema)