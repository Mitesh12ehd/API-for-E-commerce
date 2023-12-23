import User from "../model/User.js";
import bcrypt from "bcryptjs"
import asyncHandler from "express-async-handler"
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";
// import { verify } from "jsonwebtoken";

export const registerUserCtrl = asyncHandler(
    async(req,res) => {
        const {fullname, email, password} = req.body;
    
        //check if user is already exist
        const userExists = await User.findOne({email});
        if(userExists){
            throw new Error("user already exist");
        }
    
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
    
        //create the user
        const user = await User.create({
            fullname,
            email,
            password : hashedPassword,
        });
        //return succesfull response
        res.status(201).json({
            status:'success',
            message:"user registered succesfully",
            data: user,
        });
    }
)

export const loginUserCtrl = asyncHandler(
    async(req,res) => {
        const {email,password} = req.body;
        const userfound = await User.findOne({email});
        if( userfound && await bcrypt.compare(password , userfound?.password)){
            res.json({
                status: "success",
                msg: "user logged in successfully",
                userfound,
                token: generateToken(userfound?._id)
            })
        }
        else{
            throw new Error("invalid login credentials");
        }
    }
)

export const getUserProfileCtrl = asyncHandler(
    async(req,res) => {
        //find the user
        const user = await User.findById(req.userAuthId).populate("orders");
        res.json({
            status:"success",
            message:"user profile fetched successfully",
            user
        })
    }
)

//update shipping address
export const updateShippingAddresCtrl = asyncHandler(
    async(req,res) => {
        const {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            province,
            phone,
            country,
        } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userAuthId ,
            {
                shippingAddress : {
                    firstName,
                    lastName,
                    address,
                    city,
                    postalCode,
                    province,
                    phone,
                    country,
                },
                hasShippingAddress:true,
            },
            {
                new:true,
            }
        );
        res.json({
            status:"success",
            message:"user shipping address updated successfully",
            user
        })
    }
);