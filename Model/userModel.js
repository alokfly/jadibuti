const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema({
    number: { 
        type: String, 
        required: true 
    },

    hindiname: { 
        type: String, 
        default: null 
    },

    profilepic: { 
        type: String, 
        default: null 
    },

    address: { 
        type: String,
         default: null 
     },

    email: {
     type: String, 
     default: null 
 },
    referCode: {
        type: String,
          },
          
    couponcodeUsed :{
        type:String,
        default:null
    },

    isRegistered: { type: Boolean, default: false }
}, { timestamps: true })


userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number

    }, process.env.SECRET_KEY, { expiresIn: "7d" });
    return token;
}
module.exports.User = model("User", userSchema);