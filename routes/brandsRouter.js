import express from "express"

import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

import { 
    createBrandCtrl , 
    getAllBrandsCtrl, 
    getSingleBrandCtrl, 
    updateBrandCtrl, 
    deleteBrandCtrl
} from "../controllers/brandsCtrl.js";

const brandsRouter = express.Router();

brandsRouter.post("/",isLoggedIn,isAdmin,createBrandCtrl);
brandsRouter.get("/",getAllBrandsCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.delete("/:id",isLoggedIn,isAdmin,deleteBrandCtrl);
brandsRouter.put("/:id",isLoggedIn,isAdmin,updateBrandCtrl);

export default brandsRouter;