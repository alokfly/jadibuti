const router = require("express").Router();
const { Review } = require("../Model/productreview")






module.exports.addReview = ("/", async (req, res) => {

    const newReview = await new Review({
        reviewersimage: req.file.path,
        product_id: req.body.product_id,
        reviewsname: req.body.reviewsname,
        reviewcontent: req.body.reviewcontent,
        reviewcount: req.body.reviewcount

    });
    try {
        const ReviewView = await newReview.save();
        res.status(200).json({
            message: "Review Added Successfully",
            data: ReviewView
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});






//EDIT Business Profile
module.exports.EditReview = ("/:id", async (req, res) => {
    var id = req.params.id
    var reviewers_image = req.file.path
    var product_id_id = req.body.product_id
    var reviews_name = req.body.reviewsname
    var review_content = req.body.reviewcontent
    var review_count = req.body.reviewcount

    Review.findById(id, function (err, data) {
        data.reviewersimage = reviewers_image ? reviewers_image : data.reviewersimage;
        data.product_id = product_id_id ? product_id_id : data.product_id;
        data.reviewsname = reviews_name ? reviews_name : data.reviewsname;
        data.reviewcontent = review_content ? review_content : data.reviewcontent;
        data.reviewcount = review_count ? review_count : data.reviewcount;

        data.save()
            .then(doc => {
                res.status(201).json({
                    message: "Review Updated Successfully",
                    result: doc
                })
            })
            .catch(err => {
                res.json(err)
            })
    });


    /* try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Review Updated Successfully",
            data: updatedReview
        })
    } catch (err) {
        res.status(500).json(err)
    } */
})


//DELETE Business Profile
module.exports.DeleteReview = ("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Review Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE TESTIMONY BY ADMIN
module.exports.GetReviewsbyid = ("/:id", async (req, res) => {
    try {
        const singleReview = await Review.findById(req.params.id)
            .populate('product_id')
        res.status(200).json({
            message: "success",
            data: singleReview
        })

    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL Products

module.exports.GetAllReview = ("/", async (req, res) => {

    let query = {};

    if (req.query.product_id) {
        query.product_id = req.query.product_id
    }
    let total = await Review.countDocuments(query);
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    let perPage = (req.query.perPage) ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;

    query.push = ({
        $skip: skip
    });
    query.push = ({
        $limit: perPage
    })

    if (req.query.keyword) {
        query.$or = [
            { "product_id": { $regex: req.query.keyword, $options: 'i' } },
        ]
    }
    let diplayallReview = await Review.find(query)
        .populate('product_id')
        .sort({ createdAt: -1 });
    return res.status(200).json({
        message: "success",
        data: {
            data: diplayallReview,
            meta: {
                total: total,
                currentPage: page,
                perPage: perPage,
                totalPages: Math.ceil(total / perPage)
            }
        }
    })

})





