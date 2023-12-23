import Category from "../model/Category.js";
import asyncHandler from "express-async-handler"

export const createCategoryCtrl = asyncHandler(
    async(req,res) => {
        const {name} = req.body;
        //check if category already exist
        const categoryFound = await Category.findOne({name});
        if(categoryFound){
            throw new Error("Category already exist");
        }
        //create category
        const category = await Category.create({
            name: name?.toLowerCase(),
            user: req.userAuthId,
            image: req?.file?.path,
        });

        res.json({
            status:"success",
            message:"Category created successfully",
            category
        })
    }
)

export const getAllCategoriesCtrl = asyncHandler(
    async(req,res) => {
        const categories = await Category.find();

        res.json({
            status:"success",
            message:"Category fetched successfully",
            categories
        })
    }
)

export const getSingleCategoryCtrl = asyncHandler(
    async(req,res) => {
        const category = await Category.findById(req.params.id);

        res.json({
            status:"success",
            message:"Category fetched successfully",
            category
        })
    }
)

export const updateCategoryCtrl = asyncHandler(
    async(req,res) => {
        const {name} = req.body;

        const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name
        },
        {
            new:true 
        });

        res.json({
            status:"success",
            message:"category updated successfully",
            category
        })
    }
)

export const deleteCategoryCtrl = asyncHandler(
    async(req,res) => {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status:"success",
            message:"category deleted successfully",
        })
    }
)