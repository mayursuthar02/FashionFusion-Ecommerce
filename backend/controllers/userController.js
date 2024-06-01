import express from 'express';
const router = express.Router();
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import {v2 as cloudinary} from 'cloudinary';


const SignupUser = async(req,res) => {
    try {
        const {fullName, businessName, brandName, email, password, isBusinessAccount} = req.body;
        
        const user = await UserModel.findOne({email});
        if (user) {
            return res.status(409).json({error: "User already exists"});
        }

        // Hased Password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user
        const newUser = new UserModel({
            fullName, 
            businessName,
            brandName,
            email,
            password: hashedPassword,
            isBusinessAccount
        });
        await newUser.save();

        res.status(200).json({message: "User signup successfully."});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in signup user "+error.message});
    }
};


const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) return res.status(401).json({error: "Invalid email and password"});

        // Generate token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '15d'
        });

        res.cookie("token", token, {
            httpOnly: true, //more secure
            maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
            sameSite: "strict" // CSRF
        });
        
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            businessName: user.businessName,
            brandName: user.brandName,
            email: user.email,
            isBusinessAccount: user.isBusinessAccount,
            profilePic: user.profilePic,
            address: user.address,
            phone: user.phone,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in login user "+error.message});
    }
};

const UpdateUserProfile = async(req,res) => {
    try {
        const {fullName, businessName, brandName, email, address, phone} = req.body;
        let {profilePic} = req.body;
        const userId = req.user._id;
        
        const user = await UserModel.findById(userId);
        if(!user) return res.status(400).json({error: "User not found"});

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        // Update User
        user.fullName = fullName || user.fullName;
        user.businessName = businessName || user.businessName;
        user.brandName = brandName || user.brandName;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.address = address || user.address;
        user.phone = phone || user.phone;

        await user.save();

        // Password should be null in response
        user.password = null;
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in update user "+error.message});
    }
}

export {SignupUser, loginUser, UpdateUserProfile};