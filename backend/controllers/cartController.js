import ProductModel from '../models/ProductModel.js';
import cartModel from '../models/CartModel.js';

const addToCart = async(req,res) => {
    try {
        const {productId, size} = req.body;
        const userId = req.user._id;

        const existsCart = await cartModel.findOne({ productId, userId, size });
        
        if (existsCart) {
            existsCart.quantity = existsCart.quantity + 1;
            await existsCart.save();
            
            res.status(200).json(existsCart);

        } else {
            const product = await ProductModel.findById(productId);
            if (!product) return res.status(404).json({error: "Product not found"});

            const newCart = new cartModel({
                productId,
                userId,
                price: product.price,
                discount: product.discount,
                size
            });
    
            await newCart.save();

            res.status(200).json(newCart);
        }
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in add to cart "+error.message});
    }
}


const getCartItems = async(req,res) => {
    try {
        const userId = req.user._id;
        
        const cartItems = await cartModel.find({userId})
        .sort({createdAt: -1})
        .populate({path: 'productId', select: "_id category subCategory name images color discount price"})
        if(!cartItems) return res.status(404).json({error: "Cart items not found"});
        
        res.status(200).json(cartItems);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get cart "+error.message});
    }
}


const updateQuantity = async(req,res) => {
    try {
        const {cartId, quantity} = req.body;

        const updateCartQty = await cartModel.findById(cartId);
        if (!updateCartQty) {
            return res.status(400).json({error: "Cart item not found"});
        }
        
        updateCartQty.quantity = quantity || updateCartQty.quantity;
        await updateCartQty.save();
    
        res.status(200).json(updateCartQty);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get cart "+error.message});
    }
}


const DeleteCart = async(req,res) => {
    try {
        const {cartId} = req.body;

        const deleteCart = await cartModel.findByIdAndDelete(cartId);
        if (!deleteCart) {
            return res.status(404).json({error: "Cart not found"});
        }
        res.status(200).json({message: "Cart deleted"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in delete cart "+error.message});
    }
}


export {
    addToCart,
    getCartItems,
    updateQuantity,
    DeleteCart
}