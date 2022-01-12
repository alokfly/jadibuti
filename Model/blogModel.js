const mongoose = require("mongoose")

const BlogScheme = mongoose.Schema({

    blogimages: { type: Array },
    blogtitle: { type: String },
    blogauthor: { type: String },
    blogcontent: { type: String }
}, { timestamps: true })
module.exports = mongoose.model("Blog", BlogScheme)