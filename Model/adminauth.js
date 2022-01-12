const { Schema, model } = require("mongoose")

module.exports.AdminAuth = model('AdminAuth', Schema({
    fullname: { type: String },
    role: { type: String },
    number: { type: String },
    email: { type: String },
    password: { type: String },
    adminpicture: { type: String }
}, { timestamps: true }))