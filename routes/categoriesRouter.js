import express from "express"
import { 
    createCategoryCtrl,
    getAllCategoriesCtrl, 
    getSingleCategoryCtrl, 
    updateCategoryCtrl, 
    deleteCategoryCtrl }  from "../controllers/categoriesCtrl.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryFileUpload from "../config/categoryFileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, isAdmin, categoryFileUpload.single("file"),createCategoryCtrl);
categoriesRouter.get("/",getAllCategoriesCtrl);
categoriesRouter.get("/:id",getSingleCategoryCtrl);
categoriesRouter.delete("/:id",isLoggedIn,isAdmin, deleteCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn,isAdmin,updateCategoryCtrl);

export default categoriesRouter;    