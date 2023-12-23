import express from "express"
import { createOrderCtrl, 
    getAllordersCtrl,
    getSingleOrderCtrl,
    updateOrderCtrl,
    getStateticsCtrl} from "../controllers/orderCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = express.Router();

orderRouter.post("/",isLoggedIn,createOrderCtrl);
orderRouter.get("/",isLoggedIn,getAllordersCtrl);
orderRouter.get("/:id",isLoggedIn,getSingleOrderCtrl);
orderRouter.put("/update/:id",isLoggedIn,isAdmin,updateOrderCtrl);
orderRouter.get("/sales/stats",isLoggedIn,getStateticsCtrl);

export default orderRouter  