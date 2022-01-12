const router = require("express").Router();
const Product = require("../Model/product")
const { Category } = require("../Model/categoryModel")


module.exports.addproduct = ("/", async (req, res) => {
    const productimage = req.file ? req.file.path : null;
    const newProduct = await new Product({
        productimage: req.files,
        productname: req.body.productname,
        specialprice: req.body.specialprice,
        discountAvailable: req.body.discountAvailable,
        productinfo: req.body.productinfo,
        notes: [req.body.notes],
        hindiname: req.body.hindiname,
        category_id: req.body.category_id

    });
    try {
        //generate bcrpyt password

        const productview = await newProduct.save();
        res.status(200).json({
            message: "Product Added Successfully",
            data: productview
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});



//EDIT Business Profile
module.exports.EditProduct = ("/:id", async (req, res) => {

    var id = req.params.id
    var product_image = req.files
    var product_name = req.body.productname
    var special_price = req.body.specialprice
    var discount_Available = req.body.discountAvailable
    var product_info = req.body.productinfo
    var notes_ = req.body.notes
    var hindi_name = req.body.hindiname
    var category_id_id = req.body.category_id

    Product.findById(id, function (err, data) {
        data.productimage = product_image ? product_image : data.productimage;
        data.productname = product_name ? product_name : data.productname;
        data.specialprice = special_price ? special_price : data.specialprice;
        data.discountAvailable = discount_Available ? discount_Available : data.discountAvailable;
        data.productinfo = product_info ? product_info : data.productinfo;
        data.notes = notes_ ? notes_ : data.notes;
        data.hindiname = hindi_name ? hindi_name : data.hindiname;
        data.category_id = category_id_id ? category_id_id : data.category_id;

        data.save()
            .then(doc => {
                res.status(201).json({
                    message: "Product Updated Successfully",
                    result: doc
                })
            })
            .catch(err => {
                res.json(err)
            })
    });

})


//DELETE Business Profile
module.exports.DeleteProduct = ("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET SINGLE TESTIMONY BY ADMIN
module.exports.GetProductbyID = ("/:id", async (req, res) => {
    try {
        const singleProduct = await Product.findById(req.params.id)
            .populate('category_id')
        res.status(200).json({
            message: "success",
            data: singleProduct
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//GET ALL Products

module.exports.GetallProducts = ("/", async (req, res) => {

    let query = {};
    let qNew = req.query.new

    if (req.query.category_id) {
        query.category_id = req.query.category_id
    }


    let total = await Product.countDocuments(query);
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
            { "productname": { $regex: req.query.keyword, $options: 'i' } },
            { "categoryname": { $regex: req.query.keyword, $options: 'i' } }
        ]
    }
    let diplayallproduct = await Product.find(query)
        .populate('category_id')
        .sort({ createdAt: -1 });
    if (qNew) {
        diplayallproduct = await Product.find().sort({ createdAt: -1 })
            .populate('category_id')
    }

    return res.status(200).json({
        message: "success",
        data: {
            data: diplayallproduct,
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



module.exports.approveProduct = async (req, res) => {
    var approveId = req.params.id
    var status_status = req.body.status
    Product.findById(approveId, function (err, data) {
        data.status = status_status ? status_status : data.status
        data.save()
            .then(doc => {
                res.status(200).json({
                    message: "Product Approved Successfully",
                        
                })
            })
            .catch(error => {
                res.status(500).json({
                    message: "Failed",

                })
            })
    })

}

exports.search = async (req, res) => {
  try {
    const searchtext = await Product.find({
      $text: { $search: "Lipsum" },
    });
    return res.status(200).json(searchtext);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

