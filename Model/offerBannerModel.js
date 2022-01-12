const { Schema, model } = require("mongoose");

module.exports.Offer = model("Offer", Schema({
    offerinformation: { type: String },
    offercode: { type: String },
    expire: {
        type: Date, default: Date.now, index: { expires: 4000000 }
    },
    offerimage: { type: String },
    termcondition: [{ type: String }]
}, { timestamps: true }))