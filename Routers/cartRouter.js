const router = require('express').Router();
const { addcart, getallcart, getsingleusercart, deletecart } = require("../Controllers/cartController")
const { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin } = require("../middleware/verifyToken");


router.post('/addcart', addcart)
router.get('/getallcart', getallcart)
router.get('/getsingleusercart/:userId', getsingleusercart)
router.delete('/deletecart/:id', deletecart)
/* router.get('/getallcategory', verifyTokenwithAuthorization, getallcategory);
router.get('/singlecategory/:id', verifyTokenwithAuthorization, getcategorybyid);
router.delete('/deletecategory/:id', verifyTokenwithAdmin, deletecategory);
router.put('/editcategory/:id', verifyTokenwithAdmin, editCategory); */



module.exports = router;




