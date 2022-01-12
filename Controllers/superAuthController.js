const  {superAdmin}  = require("../Model/superAdmin");
const Product = require("../Model/product");
const Vendor = require("../Model/Vendor");
const { Category } = require("../Model/categoryModel");
const Validator = require('fastest-validator');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const path = require('path');


module.exports.superAdminRegistration = async (req, res) => {
    const schema = {
        password: { type: "string", optional: false, max: "100", empty: false, },
        fullname: { type: "string", optional: false, empty: false, },
        role: { type: "string", optional: false, empty: false, unique: true },
        number: { type: "string", optional: false, empty: false, unique: true },
        email: { type: "string", optional: false, empty: false },

      }
   

        const newAdmin = new superAdmin({
           
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
  
}


module.exports.superAuthlogin = async (req, res) => {
    try {
        const user = await superAdmin.findOne({ email: req.body.email })
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


exports.addProductBySuperAdmin = ("/", async (req, res) => {
    const newProduct = await new Product({
        productimage: req.body.files,
        productname: req.body.productname,
        specialprice: req.body.specialprice,
        discountAvailable: req.body.discountAvailable,
        productinfo: req.body.productinfo,
        notes: [req.body.notes],
        hindiname: req.body.hindiname,
        category_id: req.body.category_id

    });
    try {
        

        const productview = await newProduct.save();
        res.status(200).json({
            message: "Product Added Successfully",
            data: productview
        })
    } catch (err) {
        res.status(500).json(
              err.message
        )
    }
});



module.exports.EditProductbySuperAdmin = ("/:id", async (req, res) => {

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

});



module.exports.DeleteProductBySuperAdmin = ("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Product Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});



  exports.addVendorBySuperAdmin = async(req, res) => {
  const { name,number,address, email,
           } =req.body

      const saveVendor = await new Vendor({
           name: req.body.name,
        number: req.body.number,
        address: req.body.address,
        email: req.body.email,
      })


     saveVendor.save((err,data) =>{
        if (err) {
          return res.status(400).json({
            message:"Something Went Wrong"
          })
        }

        if (data) {
          res.status(200).json({
            message:"Vendor Add Successfully..!"
          })
        }
      })
    }