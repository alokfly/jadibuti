const router = require('express').Router();
const { AddOrder, GetAllOrder, Getorderbyuserid, DeleteOrder, OrderStatistics, editorderstatus, getmostsellproduct } = require("../Controllers/orderController");
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../middleware/verifyToken");





router.post('/addorder',  AddOrder);
router.get('/GetAllOrder',  GetAllOrder);
router.get('/Getorderbyuserid/:userId',  Getorderbyuserid);
router.delete('/DeleteOrder/:id', verifyTokenwithAdmin, DeleteOrder);
router.get('/OrderStatistics', OrderStatistics);
//router.get('/OrderStatistics', verifyTokenwithAdmin, OrderStatistics);
router.patch('/editorderstatus/:id', editorderstatus);
router.get('/getmostsellproduct', getmostsellproduct);
/* router.get('/getsinglereview/:id', GetReviewsbyid);
router.put('/editreviewbyid/:id', EditReview);
router.delete('/DeleteReview/:id', DeleteReview); */
/* router.get('/getalloffer', GetAllOffer);
router.get('/GetProductbyID/:id', GetProductbyID);
router.delete('/DeleteOffer/:id', DeleteOffer);
router.put('/EditProduct/:id', EditProduct); */



module.exports = router;





