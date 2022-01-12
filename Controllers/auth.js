const { AdminAuth } = require("../Model/adminauth");
const Validator = require('fastest-validator');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const path = require('path');


module.exports.adminregistration = async (req, res) => {
    const schema = {
        password: { type: "string", optional: false, max: "100", empty: false, },
        fullname: { type: "string", optional: false, empty: false, },
        role: { type: "string", optional: false, empty: false, unique: true },
        number: { type: "string", optional: false, empty: false, unique: true },
        email: { type: "string", optional: false, empty: false },

    }
    const v = new Validator();
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse !== true) {
        return res.status(404).json({
            message: "Validation is Required",
            errors: validationResponse
        })
    }
    const { email } = req.body
    AdminAuth.findOne({ email }).exec((err, admin) => {
        if (admin) {
            return res.status(401).json("Email Already Exist");
        }

        const newAdmin = new AdminAuth({
            adminpicture: req.file.path,
            fullname: req.body.fullname,
            role: req.body.role,
            number: req.body.number,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORDECRPY).toString(),
        })
        try {
            const saveAdmin = newAdmin.save();
            res.status(201).json({
                message: "Success",
                data: newAdmin
            })
        } catch (err) {
            res.status(500).json(err)
        }
    })
}

module.exports.authlogin = async (req, res) => {
    try {
        const user = await AdminAuth.findOne({ email: req.body.email })
        !user && res.status(401).json("Wrong Email")
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORDECRPY
        );
        const originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalpassword !== req.body.password &&
            res.status(401).json("Invalid Password");

        //accesstoken generator
        const accessToken = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.SECRETK, { expiresIn: "1d" });

        const { password, ...others } = user._doc;
        res.status(200).json({
            message: "You have successfully Logged in",
            data: { ...others, accessToken }
        })

    } catch (err) {
        res.status(500).json();
    }
}