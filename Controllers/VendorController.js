const Vendor= require("../Model/Vendor");


module.exports.vendorLogin = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ email: req.body.email })
        !vendor && res.status(401).json("Wrong Email")
        const hashedPassword = CryptoJS.AES.decrypt(
            vendor.password,
            process.env.PASSWORDECRPY
        );
        const originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalpassword !== req.body.password &&
            res.status(401).json("Invalid Password");

        //accesstoken generator
        const accessToken = jwt.sign({
            id: vendor._id,
            role: vendor.role
        }, process.env.SECRETK, { expiresIn: "1d" });

        const { password, ...others } = vendor._doc;
        res.status(200).json({
            message: "You have successfully Logged in",
            data: { ...others, accessToken }
        })

    } catch (err) {
        res.status(500).json();
    }
}