const router = require('express').Router();
const { 
 addCoupon,

 getCoupon,
 updateCoupon,
 deleteCoupon,

} = require("../Controllers/couponController");
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../middleware/verifyToken");


router.post('/addCoupon', addCoupon);

router.get('/get-coupon', getCoupon);
router.patch("/update-coupon/:id", updateCoupon);
router.get("/deleteCoupon/:id", deleteCoupon);






module.exports = router;





