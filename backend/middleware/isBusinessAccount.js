import userModel from "../models/UserModel.js";

const verifyBusinessAccount = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({error: "Unauthorized"});
        }
        if (!user.isBusinessAccount) {
            return res.status(400).json({error: "This feature requires a business account."});
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Unexpected error", error});
    }
};

export default verifyBusinessAccount;