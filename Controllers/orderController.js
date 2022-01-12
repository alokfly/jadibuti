const router = require("express").Router();
const Order = require("../Model/orderModel")




//CREATE ORDER
module.exports.AddOrder = ("/", async (req, res) => {
    const newOrder = await new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json({
            message: "Order Added",
            data: savedOrder
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})


//Edit order code

/* module.exports.Editorder = ("/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Order Updated Successfully",
            data: updatedOrder
        })
    } catch (err) {
        res.status(500).json(err)
    }
}) */


//DELETE PRODUCT
module.exports.DeleteOrder = ("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Order Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
});

//GET ORDER BY USERS AND ADMIN
module.exports.Getorderbyuserid = ("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('productId')
            .populate('userId')
        res.status(200).json({
            message: "success",
            data: orders
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
})

//Get all the order By Admin
module.exports.GetAllOrder = ("/", async (req, res) => {

    let query = {};
    let qNew = req.query.new

    if (req.query.productId) {
        query.productId = req.query.productId
    }

    let total = await Order.countDocuments(query);
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    let perPage = (req.query.perPage) ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;

    query.push = ({
        $skip: skip
    });
    query.push = ({
        $limit: perPage
    })

    if (req.query.keyword) {
        query.$or = [
            { "status": { $regex: req.query.keyword, $options: 'i' } },
            /*  { "productId": { $regex: req.query.keyword, $options: 'i' } } */
        ]
    }
    let diplayallOrder = await Order.find(query)
        .populate('cartId')
        .populate('userId')
        .skip(0)
        /*   .limit(2) */
        .sort({ createdAt: -1 });
    if (qNew) {
        diplayallOrder = await Order.find().sort({ createdAt: -1 }).limit(2)
            .populate('productId')
            .populate('userId')
    }
    return res.status(200).json({
        message: "success",
        data: {
            data: diplayallOrder,
            meta: {
                total: total,
                currentPage: page,
                perPage: perPage,
                totalPages: Math.ceil(total / perPage)
            }
        }
    })
})


//montly income

module.exports.OrderStatistics = ("/", async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }

            }
        ]);
        res.status(200).json({
            message: "success",
            data: income
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports.editorderstatus = async (req, res) => {
    var newstatus = req.body.status
    var id = req.params.id

    Order.findById(id, function (err, data) {
        data.status = newstatus ? newstatus : data.status;
        data.save()
            .then(doc => {
                res.status(201).json({
                    message: "Product Delivered Successfully",
                    result: doc
                })
            })
            .catch(err => {
                res.json(err);
            })
    });
}

module.exports.getmostsellproduct = async (req, res) => {
    const productid = req.params.productId
    // const counters = productid;
    try {
        const DisplaySellProducts = await Order.find();
        // const counters = DisplaySellProduct.productId.length;
        res.status(200).json({
            message: "succeaass",
            data: DisplaySellProducts.map(DisplaySellProduct => {

                return {
                    // const counting = DisplaySellProduct.productId.length,
                    counters: DisplaySellProduct.productId.length,
                    //data: DisplaySellProduct
                }


            })
            // numbers: counters
        })
    }
    catch {
        res.status(500).json({ error: "SOmething went Wrong" });
    }
}


