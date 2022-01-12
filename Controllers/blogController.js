const router = require("express").Router();
const Blog = require("../Model/blogModel")
const { Category } = require("../Model/categoryModel")


module.exports.addblog = ("/", async (req, res) => {
    const newBlog = await new Blog({
        blogimages: req.files,
        blogtitle: req.body.blogtitle,
        blogauthor: req.body.blogauthor,
        blogcontent: req.body.blogcontent,
    });
    try {
        //generate bcrpyt password

        const blogview = await newBlog.save();
        res.status(200).json({
            message: "Blog Posted Successfully",
            data: blogview

        })
        //console.log(authorimage);
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});



//EDIT Business Profile
module.exports.EditBlog = ("/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Blog Updated Successfully",
            data: updatedBlog
        })
    } catch (err) {
        res.status(500).json(err)
    }
})


//DELETE Business Profile
module.exports.DeleteBlog = ("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Blog Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE TESTIMONY BY ADMIN
module.exports.GetBlogbyID = ("/:id", async (req, res) => {
    try {
        const singleBlog = await Blog.findById(req.params.id)
        /*  .populate('category_id') */
        res.status(200).json({
            message: "success",
            data: singleBlog
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//GET ALL Products

module.exports.GetallBlogs = ("/", async (req, res) => {

    let query = {};
    let qNew = req.query.new

    if (req.query.category_id) {
        query.category_id = req.query.category_id
    }

    let total = await Blog.countDocuments(query);
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
            { "blogtitle": { $regex: req.query.keyword, $options: 'i' } },
            { "blogauthor": { $regex: req.query.keyword, $options: 'i' } }
        ]
    }


    let diplayallBlogs = await Blog.find(query)
        /* .populate('category_id') */

        .skip(0)

        .sort({ createdAt: -1 });
    if (qNew) {
        diplayallBlogs = await Blog.find().sort({ createdAt: -1 }).limit(2);
    }
    return res.status(200).json({
        message: "success",
        data: {
            data: diplayallBlogs,
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





