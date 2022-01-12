const router = require('express').Router();
const { addReview, GetAllReview, GetReviewsbyid, EditReview, DeleteReview } = require("../Controllers/reviewController")
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
    limits:
    {
        fileSize: 1024 * 1024 * 1
    },
    filefilter: filefilter
});



router.post('/addReview', verifyTokenwithAuthorization, upload.single('reviewersimage'), addReview);
router.get('/getallreview', verifyTokenwithAuthorization, GetAllReview);
router.get('/getsinglereview/:id', verifyTokenwithAuthorization, GetReviewsbyid);
router.put('/editreviewbyid/:id', verifyTokenwithAuthorization, upload.single('reviewersimage'), EditReview);
router.delete('/DeleteReview/:id', verifyTokenwithAdmin, DeleteReview);




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





