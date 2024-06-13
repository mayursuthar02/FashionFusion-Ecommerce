import ProductModel from '../models/ProductModel.js';
import cartModel from '../models/CartModel.js';

const addToCart = async(req,res) => {
    try {
        const {productId, size} = req.body;
        const userId = req.user._id;
        
        if (!productId) return res.status(404).json({error: "ProductId not found"});
        if (!size) return res.status(404).json({error: "size not found"});
        if (!userId) return res.status(404).json({error: "userId not found"});

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
        if (!userId) return res.status(404).json({error: "userId not found"});

        const cartItems = await cartModel.find({userId})
        .sort({createdAt: -1})
        .populate({path: 'productId', select: "_id category subCategory name images color discount price vendorId brandName"})

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
        if (!cartId) return res.status(404).json({error: "cartId not found"});
        if (!quantity) return res.status(404).json({error: "quantity not found"});

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
        if (!cartId) return res.status(404).json({error: "cartId not found"});

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


const DeleteUserCarts = async(req,res) => {
    try {
        const userId = req.user._id;
        if (!userId) return res.status(404).json({error: "userId not found"});

        const deleteCarts = await cartModel.deleteMany({ userId: userId });

        if (deleteCarts.deletedCount === 0) {
          return res.status(404).json({ message: 'No cart items found for this user.' });
        }
    
        res.status(200).json({ message: 'Cart cleared successfully.' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in delete user carts "+error.message});
    }
}


export {
    addToCart,
    getCartItems,
    updateQuantity,
    DeleteCart,
    DeleteUserCarts
}