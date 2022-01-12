const Userprofile = require("../Model/userProfileModel");
const User = require("../Model/userModel");


/* module.exports.adduser = async (req, res) => {
    const { email } = req.body;
    Userprofile.findOne({ email }).exec((err, user) => {
        if (user) {
            res.status(401).json("Email Already Exist")
        } else {
            const Newregistration = new User({
                profilepic: req.file.path,
                address: req.body.address,
                email: req.body.email,
                hindiname: req.body.hindiname,
            })
            try {
                const Registeruser = Newregistration.save();
                res.status(201).json({
                    message: "You have successfully Registered",
                    data: Newregistration
                })
            } catch (err) {
                res.status(500).json(err)
            }
        }
    });
} */




module.exports.EditUserProfile = (req, res, next) => {
    var id = req.params.id
    var userpicture = req.file.path
    var hindiname_name = req.body.hindiname
    var email_name = req.body.email
    var address_name = req.body.address

    User.findById(id, function (err, data) {
        data.profilepic = userpicture ? userpicture : data.profilepic;
        data.address = address_name ? address_name : data.address;
        data.email = email_name ? email_name : data.email;
        data.hindiname = hindiname_name ? hindiname_name : data.hindiname;
        data.save()
        console.log(data)
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

