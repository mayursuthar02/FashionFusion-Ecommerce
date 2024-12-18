import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({error: "Unauthorized"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({_id:decoded.userId}).select("-password");
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({error: err.message});
        console.log("Unexpected error: ", err.message);
    }
}

export default protectRoute;