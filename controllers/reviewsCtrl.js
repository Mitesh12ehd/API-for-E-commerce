import Product from "../model/Product.js";
import Review from "../model/Review.js";
import asyncHandler from "express-async-handler"

export const createReviewCtrl = asyncHandler(
    async(req,res) => {
        const {product, message,rating} = req.body;
        
        //find the product
        const {productID} = req.params;
        const productFound = await Product.findById(productID).populate("reviews");
        if(!productFound){
            throw new Error("product not found");
        }

        //check if user already reviews this product
        const hasReviewed = productFound?.reviews?.find( (review) => {
            return review?.user?.toString() === req?.userAuthId?.toString();
        } );
        if(hasReviewed){
            throw new Error("you have already reviewed this product");
        }

        //create review
        const review = await Review.create({
            message,
            rating,
            product : productFound?.id,
            user : req.userAuthId
        })

        //push review into product Found
        productFound.reviews.push(review?._id);

        //resave
        await productFound.save();

        //return response
        res.status(201).json({
            success:true,
            message: "review created successfully"
        })
    }
)