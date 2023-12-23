import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req,res,next) => {
    //get tokem from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    if(!decodedUser){
        throw new Error("invalid/expired token please log in again");
    }
    else{
        //save the user into req object
        req.userAuthId = decodedUser?.id;
        next();
    }
}