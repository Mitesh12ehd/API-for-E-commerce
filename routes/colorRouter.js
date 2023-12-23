import express from "express"
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { 
    createColorCtrl,
    getAllColorsCtrl,
    getSingleColorCtrl,
    updateColorCtrl,
    deleteColorCtrl 
} from "../controllers/colorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn, isAdmin, createColorCtrl);
colorRouter.get("/",getAllColorsCtrl);
colorRouter.get("/:id",getSingleColorCtrl);
colorRouter.delete("/:id",isLoggedIn, isAdmin, deleteColorCtrl);
colorRouter.put("/:id",isLoggedIn, isAdmin, updateColorCtrl);

export default colorRouter;