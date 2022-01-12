const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const { User } = require('../Model/userModel')
const { Otp } = require('../Model/otpModel');
const Userprofile = require("../Model/userProfileModel");
const shortId = require("shortid")

module.exports.signUp = async (req, res) => {
    const { number } = req.body
    const user = await User.findOne({ number });
    if (user) {
        /*  return res.status(400).json("User already Registered"); */
        const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
        console.log(OTP);
        const otp = new Otp({ number: number, otp: OTP });
        const salt = await bcrypt.genSalt(10)
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        return res.status(200).json(
            {
                message: "OTP sent Successfully",
                data: result,
                otp: OTP
            }
        );
    }

    const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
    console.log(OTP);
    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).json(
        {
            message: "OTP sent Successfully",
            data: result,
            otp: OTP
        }
    );
}

module.exports.verifyOtp = async (req, res) => {
    const { number } = req.body
    const user = await User.findOne({ number });
    if (user) {
        const otpHolder = await Otp.find({
            number: req.body.number
        });
        if (otpHolder.length === 0)
            return res.status(400).json("Expired OTP or Your Number Doesnt Correspond with This Token");
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

        if (rightOtpFind.number === req.body.number && validUser) {
            const newuser = new User(_.pick(req.body, ["number"]));
            const token = user.generateJWT();
            console.log(newuser);
            /*  const result = await user.find({number}); */
            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });
            return res.status(200).send({
                message: "User Registration Succesful",
                token: token,
                data: {
                    "number": number,
                    "id": user._id,
                    "isRegistered": user.isRegistered
                }
            })
        } else {
            return res.status(400).json("OTP was wrong")
        }
    }


    const otpHolder = await Otp.find({
        number: req.body.number
    });
    if (otpHolder.length === 0)
        return res.status(400).json("Expired OTP or Your Number Doesnt Correspond with This Token");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

    if (rightOtpFind.number === req.body.number && validUser) {
        const user = new User(_.pick(req.body, ["number"]));
        const userprofile = new Userprofile(_.pick(req.body, ["number"]));


        const token = user.generateJWT();
        const result = await user.save();
        const results = await userprofile.save();



        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        });
        return res.status(200).send({
            message: "User Registration Succesful",
            token: token,
            data: result
        })
    } else {
        return res.status(400).json("OTP was wrong")
    }
}

module.exports.EditUserProfile = (req, res, next) => {
    var id = req.params.id
    var userpicture = req.file.path
    var hindiname_name = req.body.hindiname
    var email_name = req.body.email
    var address_name = req.body.address
    var is_Registered = req.body.isRegistered

    User.findById(id, function (err, data) {
        data.profilepic = userpicture ? userpicture : data.profilepic;
        data.address = address_name ? address_name : data.address;
        data.email = email_name ? email_name : data.email;
        data.hindiname = hindiname_name ? hindiname_name : data.hindiname;
        data.isRegistered = is_Registered ? is_Registered : data.isRegistered;
        data.save()
            .then(doc => {
                res.status(201).json({
                    message: "Users Updated Successfully",
                    result: doc
                })
            })
            .catch(err => {
                res.json(err)
            })
    });
}

module.exports.getuserinformatin = ("/id", async (req, res, next) => {
    const userid = req.params.id;

    try {
        const getsingleuser = await User.findById(req.params.id)
        res.status(200).json({
            message: "success",
            data: getsingleuser
        })
    } catch {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

module.exports.getallusers = async (req, res) => {
    let query = {};
    if (req.query._id) {
        query._id = req.query._id
    }
    let total = await User.countDocuments(query);
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    let perPage = (req.query.perPage) ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;
    query.push = ({
        $skip: skip
    });
    query.push = ({
        $limit: perPage
    })

    if (req.query.hindiname) {
        query.$or = [
            { "hindiname": { $regex: req.query.hindiname, $options: 'i' } },
        ]
    } else if (req.query.number) {
        query.$or = [
            { "number": { $regex: req.query.number, $options: 'i' } }
        ]
    } else if (req.query.email) {
        query.$or = [
            { "email": { $regex: req.query.email, $options: 'i' } }
        ]
    }
    let diplayallUsers = await User.find(query)

        .sort({ createdAt: -1 });
    return res.status(200).json({
        message: "success",
        data: {
            data: diplayallUsers,
            meta: {
                total: total,
                currentPage: page,
                perPage: perPage,
                totalPages: Math.ceil(total / perPage)
            }
        }
    })
}

module.exports.deleteuser = async (req, res) => {
    try {
        const deleteuser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch {
        res.status(500).json({
            message: "User Does not Delete"
        })
    }
}