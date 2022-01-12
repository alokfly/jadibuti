const { Category } = require("../Model/categoryModel")



module.exports.addcategory = ("/", async (req, res) => {
    const newCategory = await new Category({
        categoryname: req.body.categoryname,
        categoryimage: req.file.path
    });

    try {
        //generate bcrpyt password
        const category = await newCategory.save();
        res.status(200).json({
            message: "Category Addedd Successfully",
            data: category
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})


//Edit Product code

module.exports.editCategory = ("/:id", async (req, res) => {

    var id = req.params.id
    var category_image = req.file.path
    var category_name = req.body.categoryname

    Category.findById(id, function (err, data) {
        data.categoryimage = category_image ? category_image : data.categoryimage;
        data.categoryname = category_name ? category_name : data.categoryname;
        data.save()
            .then(doc => {
                res.status(201).json({
                    message: "Category Updated Successfully",
                    result: doc
                })
            })
            .catch(err => {
                res.json(err)
            })
    });

})


//DELETE PRODUCT
module.exports.deletecategory = ("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Category Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE PRODUCT BY USERS AND ADMIN
module.exports.getcategorybyid = ("/:id", async (req, res) => {
    try {
        const singleCategory = await Category.findById(req.params.id)
        res.status(200).json({
            message: "success",
            data: singleCategory
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//GET ALL CATEGPRIES
module.exports.getallcategory = ("/", async (req, res) => {

    try {
        const allcategories = await Category.find();
        res.status(200).json({
            message: "success",
            data: allcategories
        });

    } catch (err) {
        res.status(500).json({ error: "Something ent Wrong" })
    }
})

/* module.exports = router */