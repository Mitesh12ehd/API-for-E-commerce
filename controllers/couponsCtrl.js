import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler"

//create new Coupon
export const createCoupenCtrl = asyncHandler(
    async(req,res) => {
        const {code,startDate,endDate,discount} = req.body;

        //check if coupon already exists
        const couponExists = await Coupon.findOne({code});
        if(couponExists){
            throw new Error("coupon already exist");
        }

        //check if discount is a number 
        if(isNaN(discount)){
            throw new Error("please provide valid discount value number");
        }

        //create coupon
        const coupon = await Coupon.create({
            code : code,
            startDate,
            endDate,
            discount,
            user:req.userAuthId
        });

        //send response
        res.status(201).json({
            status:"success",
            message:"Coupon created successfully",
            coupon,
        })

    }
)

//get all coupon with current date
export const getAllcouponsCtrl = asyncHandler(
    async(req,res) => {
        const coupons = await Coupon.find();
        res.status(200).json({
            status:"success",
            message:"All coupens",
            coupons,
        })
    }
)

//get single coupon
export const getCouponCtrl = asyncHandler(
    async(req,res) => {
        const coupon = await Coupon.findById(req.params.id); //use instead
                                                // findOne({code: req.query.code})
        //check if is not found
        if (coupon === null) {
            throw new Error("Coupon not found");
        }
        //check if expired
        if (coupon.isExpired) {
            throw new Error("Coupon Expired");
        }
        res.json({
            status:"success",
            message:"coupon fetched",
            coupon
        })
    }
)

//update coupen 
export const updateCouponCtrl = asyncHandler(
    async(req,res) => {
        const {code,startDate,endDate,discount} = req.body;
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            {
                code: code?.toUpperCase(),
                discount,
                startDate,
                endDate,
            },
            {
                new:true,
            }
        );
        res.json({
            status:"success",
            message:"coupon updated",
            coupon,
        });
    }
)

//delete coupon
export const deleteCouponCtrl = asyncHandler(
    async(req,res) => {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        res.json({
            status:"success",
            message:"coupon deleted",
            coupon,
        });
    }
)