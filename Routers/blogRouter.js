const router = require('express').Router();
const { addblog, GetallBlogs, GetBlogbyID, EditBlog, DeleteBlog } = require("../Controllers/blogController");
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
    /* limits:
    {
        fileSize: 1024 * 1024 * 1
    },
    filefilter: filefilter */
});

var multipleuploads = upload.fields([{ name: 'blogimage', maxCount: 1 }, { name: 'authorimage', maxCount: 1 }])
router.post('/addblog', verifyTokenwithAuthorization, multipleuploads, addblog);
router.get('/GetallBlogs', verifyTokenwithAuthorization, GetallBlogs);
router.get('/GetBlogbyID/:id', verifyTokenwithAuthorization, GetBlogbyID);
router.put('/EditBlog/:id', verifyTokenwithAdmin, EditBlog);
router.delete('/DeleteBlog/:id', verifyTokenwithAdmin, DeleteBlog)


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
