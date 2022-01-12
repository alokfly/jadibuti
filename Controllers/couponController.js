const router = require("express").Router();
const Coupon = require("../Model/couponModel");
const { User } = require("../Model/userModel");
const Product = require("../Model/product");
var ObjectId = require("mongodb").ObjectID;
const _ = require("lodash");

const bcrypt = require("bcrypt");



module.exports.addCoupon = async (req, res) => {

    const { couponcode } = req.body

    Coupon.findOne({ couponcode }).exec((err, couponuse) => {
        if (couponuse) {
            res.status(500).json("Coupon Code Already Been Taken or Expired")
        } else {
            const newCoupon = new Coupon({
                couponcode: req.body.couponcode,
                expirydate: req.body.expirydate,
                couponamont: req.body.couponamont,
                productId: req.body.productId,
                

            });
            try {
                const CouponView = newCoupon.save();
                res.status(200).json({
                    message: 'Coupon Added',
                    data: newCoupon
                })
            } catch (err) {
                res.status(500).json({
                    error: err
                })
            }
        }
    })
};


exports.getCoupon = async (req, res) => {
  try {
    const response = await Coupon.find();
    res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);
  }
};



exports.updateCoupon = async (req, res) => {
  let { couponcode, expirydate, couponamont, productId } = req.body;
  try {
    const response = await Coupon.findByIdAndUpdate(
      { _id: ObjectId(req.params.id) },
      {
        couponcode,
        expirydate,
        couponamont,
        productId,
      }
    );
    res.status(200).send({ msg: response });
  } catch (error) {
    console.log(error);
  }
};

 exports.deleteCoupon = async (req, res) => {
  try {
    const response = await Coupon.findByIdAndDelete({
      _id: ObjectId(req.params.id),
    });
    res.status(200).send({ msg: "Coupon deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};


module.exports.redeemCode = async (req, res) => {
  const { code, email, couponCode } = req.body;
  try {
    const userApplyingCode = await User.findOne({ email });

    if (code) {
      const checkCode = await User.findOne({ code });
      const findUserAlreayApplyCode = await User.findOne({
        userReedemCode: { $in: userApplyingCode._id },
      });
      if (findUserAlreayApplyCode == null) {
        if (checkCode != null) {
          const totalPointsUpdated = 10 + checkCode.points;
          const updatePointsOwner = await User.findByIdAndUpdate(
            {
              _id: ObjectId(checkCode._id),
            },
            {
              $push: { userReedemCode: userApplyingCode._id },
              points: totalPointsUpdated,
            },
            {
              new: true,
            }
          );
          const totalPointsUpdatedUser = 10 + userApplyingCode.points;
          const updatePointsWhoApplyCoupon = await User.findByIdAndUpdate(
            {
              _id: ObjectId(userApplyingCode._id),
            },
            {
              points: totalPointsUpdatedUser,
            }
          );
          return res.status(201).json({ msg: "Code applied successfully" });
        } else {
          return res.status(400).json({ msg: "Code not found" });
        }
      } else {
        return res.status(404).json({ msg: "You already applied the code" });
      }
    } else {
      const userId = userApplyingCode._id;
      const checkCouponCode = await Coupon.findOne({ couponCode });
      if (checkCouponCode) {
        const getExpiryDateofCoupon = checkCouponCode.expiryDate;
        var m = new Date();
        var todaysDate =
          m.getUTCFullYear() +
          "-" +
          (m.getUTCMonth() + 1) +
          "-" +
          m.getUTCDate();
        if (getExpiryDateofCoupon >= todaysDate) {
          const findUserAlreayApplyCouponCode = await Coupon.findOne({
            _id: ObjectId(checkCouponCode._id),
            userReedemCoupon: { $in: userApplyingCode._id },
          });
          console.log();
          const totalRecord = await Coupon.aggregate([
            { $match: { _id: ObjectId(checkCouponCode._id) } },
            {
              $project: {
                item: 1,
                numberOfUser: {
                  $cond: {
                    if: { $isArray: "$userReedemCoupon" },
                    then: { $size: "$userReedemCoupon" },
                    else: "NA",
                  },
                },
              },
            },
          ]);
          console.log(totalRecord);
          totalRecord.forEach(async (element) => {
            if (element.numberOfUser < checkCouponCode.numberOfUserReedem) {
              if (!findUserAlreayApplyCouponCode) {
                await Coupon.findByIdAndUpdate(
                  { _id: ObjectId(checkCouponCode._id) },
                  {
                    $push: { userReedemCoupon: userApplyingCode._id },
                  },
                  {
                    new: true,
                  }
                ).exec((err, result) => {
                  if (err) {
                    console;
                    return res.status(422).json(err);
                  } else {
                    res.json({ msg: "Coupon Applied successfully", result });
                  }
                });
                const totalPoints =
                  checkCouponCode.points + userApplyingCode.points;
                const updatePoints = await User.findByIdAndUpdate(
                  {
                    _id: ObjectId(userApplyingCode._id),
                  },
                  { points: totalPoints }
                );
              } else {
                res
                  .status(400)
                  .json({ msg: "You already applied this coupon" });
              }
            } else {
              res.status(400).json({
                msg: "Sorry, You can not apply this coupon because limit is over",
              });
            }
          });
        } else {
          res.status(400).json({
            msg: "coupon is expired",
          });
        }
      } else {
        res.status(400).json({
          msg: "Coupon code not exist",
        });
        console.log("Coupon code not exist");
      }
    }
  } catch (error) {
    console.log(error);
  }
};









//EDIT Business Profile
/* module.exports.EditReview = ("/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            }, { new: true });
        res.status(200).json({
            message: "Review Updated Successfully",
            data: updatedReview
        })
    } catch (err) {
        res.status(500).json(err)
    }
})
 */

//DELETE Business Profile
/* module.exports.DeleteReview = ("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Review Deleted Successfully" })
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
}); */

//GET SINGLE TESTIMONY BY ADMIN
/* module.exports.GetReviewsbyid = ("/:id", async (req, res) => {
    try {
        const singleReview = await Review.findById(req.params.id)
            .populate('product_id')
        res.status(200).json({
            message: "success",
            data: singleReview
        })

    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" })
    }
}) */

//GET ALL Products

/* module.exports.GetAllReview = ("/", async (req, res) => {

    let query = {};

    if (req.query.product_id) {
        query.product_id = req.query.product_id
    }
    let total = await Review.countDocuments(query);
    let page = (req.query.page) ? parseInt(req.query.page) : 1;
    let perPage = (req.query.perPage) ? parseInt(req.query.perPage) : 10;
    let skip = (page - 1) * perPage;

    query.push = ({
        $skip: skip
    });
    query.push = ({
        $limit: perPage
    })
 */
/* if (req.query.keyword) {
    query.$or = [
        { "productname": { $regex: req.query.keyword, $options: 'i' } },
        { "short_Description": { $regex: req.query.keyword, $options: 'i' } }
    ]
} */
/* let diplayallReview = await Review.find(query)
    .populate('product_id')
    .skip(0)
    .limit(2)
    .sort({ createdAt: -1 });
return res.status(200).json({
    message: "success",
    data: {
        data: diplayallReview,
        meta: {
            total: total,
            currentPage: page,
            perPage: perPage,
            totalPages: Math.ceil(total / perPage)
        }
    }
}) */

/* })
 */




