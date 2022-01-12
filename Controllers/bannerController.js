const Banner = require("../Model/bannerModel")

module.exports.addBanner = ("/", async (req, res) => {
    const newBanner = await new Banner({
        bannerimage: req.file.path
    });

    try {
        //generate bcrpyt password
        const banner = await newBanner.save();
        res.status(200).json({
            message: "Banner Image Addedd Successfully",
            data: banner
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})


//Edit Product code

module.exports.editBanner = ("/:id", async (req, res) => {
    try {
        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Banner Updated Successfully",
            data: updatedBanner
        })
    } catch (err) {
        res.status(500).json(err)
    }
})


//DELETE PRODUCT
module.exports.deleteBanner = ("/:id", async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Banner Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE PRODUCT BY USERS AND ADMIN
module.exports.getBannerbyid = ("/:id", async (req, res) => {
    try {
        const singleBanner = await Banner.findById(req.params.id)
        res.status(200).json({
            message: "success",
            data: singleBanner
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//GET ALL CATEGPRIES
module.exports.getallBanner = ("/", async (req, res) => {

    try {
        const allBanners = await Banner.find();
        res.status(200).json({
            message: "success",
            data: allBanners
        });

    } catch (err) {
        res.status(500).json({ error: "Something ent Wrong" })
    }
})

/* module.exports = router */