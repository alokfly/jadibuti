const express = require("express")
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require('./Routers/userRouter');
const adminRouter = require('./Routers/adminRouter');
const categoryRouter = require('./Routers/categoryRouter');
const productRouter = require('./Routers/productRouter');
const offerRouter = require('./Routers/offerRouter');
const reviewRouter = require('./Routers/reviewRouter');
const blogRouter = require('./Routers/blogRouter');
const orderRouter = require('./Routers/orderRouter')
const bannerRouter = require('./Routers/bannerRouter');
const EditUserProfileRouter = require('./Routers/userUpdateRouter');
const cartRouter = require('./Routers/cartRouter');
const couponRouter = require('./Routers/couponRouter');
const superAdminRouter = require('./Routers/superAdminRouter');
const vendorRouter = require('./Routers/VendorRouter');

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected Successfuly")
}).catch(() => {
    console.log("Opps!!! Error in Connection");
})

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/offer', offerRouter);
app.use('/api/review', reviewRouter);
app.use('/api/blog', blogRouter);
app.use('/api/order', orderRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/cart', cartRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/superadmin', superAdminRouter);
// app.use('/api/vendor', vendorRouter);

/* response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
response.setHeader("Expires", "0"); // Proxies. */

app.get("/", (req, res) => {
    res.send("This is Jatibuti Application");
})





app.use('uploads', express.static('uploads'))
const port = process.env.PORT || 8083;

app.listen(port, () => {
    console.log(`We are running on port ${port}`);
})
/* module.exports = app */