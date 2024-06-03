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
};


const getVenderProducts = async(req,res) => {
    try {
        const userId = req.user._id;
        const products = await productModel.find({vendorId: userId}).sort({createdAt: -1});
        if (!products) {
            return res.status(400).json({error: "Products not found"});
        }        
        res.status(200).json(products);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get vender products "+error.message});
    }
}

const updateProduct = async(req,res) => {
    try {
        const {name, brandName, description, price, category, subCategory, sizes, color, material, images, stock, discount} = req.body;
        const {id} = req.params;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(400).json({error: "Product not found"});
        }

        // Update
        product.name = name || product.name;
        product.brandName = brandName || product.brandName;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes || product.sizes;
        product.color = color || product.color;
        product.material = material || product.material;
        product.images = images || product.images;
        product.stock = stock;
        product.discount = discount;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get update product "+error.message});
    }
}


const getProductDetails = async(req,res) => {
    try {
        const {id} = req.params;
        
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(400).json({error: "Product not found."});
        }
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get product "+error.message});
    }
}

export {createProduct, getVenderProducts, updateProduct, getProductDetails};