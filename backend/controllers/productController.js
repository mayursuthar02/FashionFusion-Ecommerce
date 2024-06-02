import productModel from "../models/ProductModel.js";

const createProduct = async(req,res) => {
    try {
        const userId = req.user._id;
        const {name, brandName, description, price, category, subCategory, sizes, color, material, images, stock, discount} = req.body;

        if (!images) {
            return res.status(400).json({error: "Images are not provided"});
        }

        const newProduct = new productModel({
            name,
            brandName,
            description,
            price,
            category,
            subCategory,
            sizes,
            color,
            material,
            images,
            stock,
            discount,
            vendorId: userId
        });

        await newProduct.save();
        
        res.status(200).json(newProduct);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in create product "+error.message});
    }
}


export {createProduct};