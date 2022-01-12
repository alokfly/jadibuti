const router = require('express').Router();
const { addBanner, editBanner, deleteBanner, getBannerbyid, getallBanner } = require("../Controllers/bannerController")
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

router.post('/addBanner', verifyTokenwithAdmin, upload.single('bannerimage'), addBanner)
router.get('/getallBanner', getallBanner);
router.get('/getBannerbyid/:id', verifyTokenwithAuthorization, getBannerbyid);
router.delete('/deleteBanner/:id', verifyTokenwithAdmin, deleteBanner);
router.put('/editBanner/:id', verifyTokenwithAdmin, editBanner);

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
