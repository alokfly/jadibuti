const router = require("express").Router();
const { Offer } = require("../Model/offerBannerModel")
/* const { Category } = require("../Model/categoryModel") */
const otpGenerator = require('otp-generator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits:
    {
        fileSize: 1024 * 1024 * 1
    },
    filefilter: filefilter
});


module.exports.addoffer = ("/", async (req, res) => {
    const OTP = otpGenerator.generate(10, { digits: true, upperCaseAlphabets: false, specialChars: false });
    const newofferBanner = await new Offer({
        offerimage: req.file.path,
        termcondition: [req.body.termcondition],
        offercode: req.body.offercode,
        expire: req.body.expire,
        offercode: OTP,
        offerinformation: req.body.offerinformation

    });
    try {
        const offerview = await newofferBanner.save();
        res.status(200).json({
            message: "Product Added Successfully",
            data: offerview
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});


function errhandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.status(501).json({
            success: 0,
            message: err.message
        })
    }
}

router.use(errhandler);



//EDIT Business Profile
module.exports.EditProduct = ("/:id", async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Product Updated Successfully",
            data: updatedOffer
        })
    } catch (err) {
        res.status(500).json(err)
    }
})


//DELETE Business Profile
module.exports.DeleteOffer = ("/:id", async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Offer Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE TESTIMONY BY ADMIN
module.exports.GetProductbyID = ("/:id", async (req, res) => {
    try {
        const singleoffer = await Offer.findById(req.params.id)
        res.status(200).json({
            message: "success",
            data: singleoffer
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//GET ALL Products

module.exports.GetAllOffer = ("/", async (req, res) => {

    let query = {};

    if (req.query.category_id) {
        query.category_id = req.query.category_id
    }


    let total = await Offer.countDocuments(query);
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    let perPage = (req.query.perPage) ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;

    query.push = ({
        $skip: skip
    });
    query.push = ({
        $limit: perPage
    })

    /* if (req.query.keyword) {
        query.$or = [
            { "productname": { $regex: req.query.keyword, $options: 'i' } },
            { "short_Description": { $regex: req.query.keyword, $options: 'i' } }
        ]
    } */
    let diplayalloffer = await Offer.find(query)
        /* .populate('category_id') */
        .skip(0)
        .sort({ createdAt: -1 });
    return res.status(200).json({
        message: "success",
        data: {
            data: diplayalloffer,
            meta: {
                total: total,
                currentPage: page,
                perPage: perPage,
                totalPages: Math.ceil(total / perPage)
            }
        }
    })
    /* const qNew = req.query.new
    const qCategory = req.query.category

    const query = {};
    try {
        let productview;
        if (qNew) {
            productview = await Product.find().sort({ createdAt: -1 }).limit(2);
        } else if (qCategory) {
            productview = await Product.find({
                category_id: {
                    $in: [qCategory]
                },

            });
            console.log(productview);
        } else {
            productview = await Product.find();
        }
        res.status(200).json({
            message: "success",
            data: productview
        });

    } catch (err) {
        res.status(500).json({ error: "Something went Wrong" })
    } */
})





