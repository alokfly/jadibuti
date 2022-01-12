const { Schema, model } = require("mongoose");
module.exports.Category = model('Category', Schema({
    categoryname: { type: String, required: true, unique: true },
    categoryimage: { type: String }
}, { timestamps: true }));