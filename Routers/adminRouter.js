const router = require('express').Router();
const { adminregistration, authlogin } = require("../Controllers/auth")

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

router.post('/registration', upload.single('adminpicture'), adminregistration);
router.post('/adminlogin', authlogin);


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
