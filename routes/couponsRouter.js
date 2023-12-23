import express from "express"
import { 
    createCoupenCtrl, 
    deleteCouponCtrl, 
    getAllcouponsCtrl, 
    getCouponCtrl, 
    updateCouponCtrl 
} from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const coupensRouter = express.Router();

coupensRouter.post("/",isLoggedIn, isAdmin, createCoupenCtrl);
coupensRouter.get("/",getAllcouponsCtrl);
coupensRouter.get("/:id",getCouponCtrl);
coupensRouter.put("/update/:id",isLoggedIn, isAdmin, updateCouponCtrl);
coupensRouter.delete("/delete/:id",isLoggedIn, isAdmin, deleteCouponCtrl);

export default coupensRouter;