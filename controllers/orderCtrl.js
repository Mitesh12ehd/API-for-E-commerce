import asyncHandler from "express-async-handler"
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

//create order controller
export const createOrderCtrl = asyncHandler(
    async(req,res) => {
        // //get the coupon
        // // const {coupon} = req?.query;
        // // const couponFound = await Coupon.findOne({
        // //     code: coupon?.toUpperCase(),
        // // })
        // // if(couponFound?.isExpired){
        // //     throw new Error("coupon has expired")
        // // }
        // // if(!couponFound){
        // //     throw new Error("coupon not found")
        // // }
        
        // // //get the discount
        // // const discount = couponFound?.discount /100;

        //get the payload
        const {orderItems , shippingAddress, totalPrice} = req.body;

        //find the user
        const user = await User.findById(req.userAuthId);

        //check if user has shipping address
        if(!user?.hasShippingAddress){
            throw new Error("please provide shipping address");
        }

        //check is order is empty
        if(orderItems?.length <=0){
            throw new Error("No order Items");
        }

        //place/create order save into db
        const order = await Order.create({
            user: user?._id,
            orderItems,
            shippingAddress,
            // totalPrice : couponFound ? totalPrice - totalPrice * discount : totalPrice,
            totalPrice,
        });

        //update the product quantity and sold items in product model
        const products = await Product.find( {_id:{$in:orderItems}} );

        orderItems?.map( async(order) => {
            const product = products?.find((product) => {
                return product?._id?.toString() === order?._id?.toString();
            });
            if(product){
                product.totalSold += order.qty
            }
            await product.save();
        } );

        // push order into user
        user.orders.push(order?._id);
        await user.save();

        //make payment - stripe
        //convert order items to same structure that stripe need
        const convertedOrderes = orderItems.map((item) => {
            return{
                price_data:{
                    currency:"inr",
                    product_data:{
                        name: item?.name,
                        description: item?.description
                    },
                    unit_amount: item?.price * 100  //multiply 100 into price
                },
                quantity:item?.qty
            }
        })
        const session = await stripe.checkout.sessions.create({
            line_items:convertedOrderes,
            metadata:{
                orderId : JSON.stringify(order?._id)
            },
            mode:"payment",
            success_url:"http://localhost:3000/success", //frontend url
            cancel_url:"http://localhost:3000/cancel"    //frontend url
        });
 
        res.send({ url: session.url });

        // //payment web hook --inside app.js

        // //update the user order --inside app.js
    }
)

//fetching order controller
export const getAllordersCtrl = asyncHandler(
    async(req,res) => {
        //find all orders
        const orders = await Order.find().populate("user");
        res.json({
            success:true,
            message:"All orders",
            orders,
        })
    }
)

//fetch single order
export const getSingleOrderCtrl = asyncHandler(
    async(req,res) => {
        //get the id of order form params
        const id = req.params.id;
        const order = await Order.findById(id);
        res.status(200).json({
            success:true,
            message:"single orders",
            order
        })
    }
)

export const updateOrderCtrl = asyncHandler(
    async(req,res) => {
        const id = req.params.id;
        const updateOrder = await Order.findByIdAndUpdate(
            id,
            {
                status: req.body.status,
            },
            {
                new:true
            }
        );
        res.status(200).json({
            success:true,
            message:"order updated",
            updateOrder,
        })
    }
)

//get sum of orders
export const getStateticsCtrl = asyncHandler(
    async(req,res) => {
        //get the minimum orders
        const orders = await Order.aggregate([
            {
                $group:{
                    _id:null,
                    minimumSale:{
                        $min: "$totalPrice",
                    },
                    totalSales:{
                        $sum : "$totalPrice",
                    },
                    maxSale:{
                        $max : "$totalPrice",
                    },
                    avgSales:{
                        $avg : "$totalPrice",
                    },
                },
            },
        ])
        
        //get the date
        const date = new Date();
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const salesToday = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte : today, //greater than or equal to
                    },
                },
            },
            {
                $group:{
                    _id:null,
                    totalSales:{
                        $sum: "$totalPrice"
                    },
                },
            },
        ])

        //send response
        res.status(200).json({
            success:true,
            msg:"sum of orders",
            orders,
            salesToday,
        })
    }
)