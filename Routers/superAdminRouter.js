const router = require('express').Router();
const { superAdminRegistration,superAuthlogin,addProductBySuperAdmin,EditProductbySuperAdmin, DeleteProductBySuperAdmin,addVendorBySuperAdmin} = require("../Controllers/superAuthController")

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
router.post('/super-adminlogin', superAuthlogin);
router.post('/super-admin-registration',upload.single('superadminpicture'), superAdminRegistration);
router.post('/add-product-by-super-admin',upload.array('productimage', 4), addProductBySuperAdmin);
router.put('/edit-product-by-super-admin/:id',upload.array('superadminbyproductimage', 4), EditProductbySuperAdmin);
router.delete('/deleteproduct-by-super-admin/:id',  DeleteProductBySuperAdmin);
router.post('/add-vendor-by-super-admin',  addVendorBySuperAdmin);


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
