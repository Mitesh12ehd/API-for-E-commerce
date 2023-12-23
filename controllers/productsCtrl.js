import Category from "../model/Category.js";
import Product from "../model/Product.js"
import asyncHandler from "express-async-handler"
import Brand from "../model/Brand.js";

export const createProductCtrl = asyncHandler(
    async (req,res) => {
        console.log(req.body);

        const {
            name,
            description,
            category,
            sizes,
            colors,
            price,
            totalQty,
            brand   
        } = req.body;

        const convertedImgs = req.files.map(
            (file) => file?.path
        );
        
        //check if product already exist
        const productExists = await Product.findOne({name});
        if(productExists){
            throw new Error("Product already exist");
        }

        //find the brand
        const brandFound = await Brand.findOne({
            name: brand,
        })
        if(!brandFound){
            throw new Error(
                "Brand not found, please create Brand first or check Brand name"
            )
        }

        //find the category
        const categoryFound = await Category.findOne({
            name:category
        })
        if(!categoryFound){
            throw new Error(
                "Category not found, please create category first or check category name"
            )
        }

        //create the product
        const product = await Product.create({
            name,
            description,
            category,
            sizes,
            colors,
            user: req.userAuthId,
            price,
            totalQty,
            brand,
            images: convertedImgs
        })
        //push the product into category
        categoryFound.products.push(product._id);
        //resave
        await categoryFound.save();
        //push the product into brand
        brandFound.products.push(product._id);
        //resave
        await brandFound.save();

        res.json({
            status:"success",
            message:"product created successfully",
            product
        })
    }
)

export const getProductsCtrl = asyncHandler(
    async(req,res) => {
        console.log(req.query);
        //query
        let productQuery = Product.find();

        //search by name
        if(req.query.name){
            productQuery = productQuery.find({
                name:{ $regex: req.query.name , $options:"i"}
            })
        }
        //filter by brand
        if(req.query.brand){
            productQuery = productQuery.find({
                brand:{ $regex: req.query.brand , $options:"i"}
            })
        }
        //filter by category
        if(req.query.category){
            productQuery = productQuery.find({
                category:{ $regex: req.query.category , $options:"i"}
            })
        }
        //filter by colors
        if(req.query.colors){
            productQuery = productQuery.find({
                colors:{ $regex: req.query.colors , $options:"i"}
            })
        }
        //filter by size
        if(req.query.sizes){
            productQuery = productQuery.find({
                sizes:{ $regex: req.query.sizes , $options:"i"}
            })
        }
        //filter by price range
        if(req.query.price){
            const priceRange = req.query.price.split("-");
            // gte = greater or equal
            // lte = less than or equal
            productQuery = productQuery.find({
                price: { $gte:priceRange[0] , $lte:priceRange[1]}
            })
        }

        //pagination
        //page
        const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1
        //limit
        const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10
        //start index
        const startIndex = (page-1) * limit;
        //end index
        const endIndex = (page) * limit;
        //total
        const total = await Product.countDocuments();

        productQuery = productQuery.skip(startIndex).limit(limit);

        //pagination result
        const pagination = {};
        if(endIndex < total){
            pagination.next = {
                page: page+1,
                limit
            }
        }
        if(startIndex>0){
            pagination.prev = {
                page: page-1,
                limit
            }
        }

        //await the query
        const products= await productQuery.populate("reviews");

        res.json({
            status:"success",
            total,
            result: products.length,
            pagination,
            message:"product fetched successfully",
            products
        })
    }
)

//fetch single product
export const getProductCtrl = asyncHandler(
    async(req,res) => {
        const product = await Product.findById(req.params.id).populate({
            path: "reviews",
            populate:{
                path:"user",
                select:"fullname",
            }
        });
        if(!product){
            throw new Error("product not found")
        }
        res.json({
            status:"success",
            message:"product fetched successfully",
            product
        })
    }
)

export const updateProductCtrl = asyncHandler(
    async(req,res) => {
        const {
            name,
            description,
            category,
            sizes,
            colors,
            price,
            totalQty,
            brand
        } = req.body;

        const product = await Product.findByIdAndUpdate(req.params.id,{
            name,
            description,
            category,
            sizes,
            colors, 
            user:req.userAuthId, 
            price,
            totalQty,
            brand
        },
        {
            new:true,
            runValidators: true
        })
        res.json({
            status:"success",
            message:"product updated successfully",
            product
        })
    }
)

export const deleteProductCtrl = asyncHandler(
    async(req,res) => {
        await Product.findByIdAndDelete(req.params.id);
        res.json({
            status:"success",
            message:"product deletede successfully",
        })
    }
)