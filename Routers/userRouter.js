const router = require('express').Router();
const { signUp, verifyOtp, EditUserProfile, getuserinformatin, getallusers, deleteuser } = require("../Controllers/userController");
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


router.post('/signup', signUp);
router.post('/signup/verify', verifyOtp)
router.put('/updateuser/:id', upload.single('profilepic'), EditUserProfile)
router.get('/getsingleuser/:id', getuserinformatin);
router.get('/getallusers', getallusers);
router.delete('/deleteuser/:id', deleteuser);

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
