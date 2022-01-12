const router = require('express').Router();
const { addproduct, GetallProducts, EditProduct, DeleteProduct, GetProductbyID,approveProduct,search } = require("../Controllers/productController");
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../middleware/verifyToken");
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
    /*  limits:
     {
         fileSize: 1024 * 1024 * 1
     },
     filefilter: filefilter */
});


router.post('/createproduct',  upload.array('productimage', 4), addproduct);
router.get('/getproduct', GetallProducts);
router.put('/updateproduct/:id', verifyTokenwithAdmin, upload.array('productimage', 4), EditProduct);
router.delete('/deleteproduct/:id',  DeleteProduct);
router.get('/getsingleproduct/:id', verifyToken, GetProductbyID);
router.get('/approve-Product-by-superAdmin-admin/:id',  approveProduct);
router.post('/search-product-by-name', search);



function errhandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.status(501).json({
            success: 0,
            message: err.message
        })
    }
}

router.use(errhandler);

module.exports = router;
