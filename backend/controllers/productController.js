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


const deleteProduct = async(req,res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(404).json({error: "ProductId not found"});
            }
            
        const deleteProduct = await productModel.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({error: "Product not found"});
        }

        res.status(200).json(deleteProduct);
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
};


const getProductByName = async(req,res) => {
    try {
        const {name} = req.params;
        
        const product = await productModel.find({name});
        if (!product) {
            return res.status(400).json({error: "Product not found."});
        }
        
        res.status(200).json(product);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get product "+error.message});
    }
};


const getFilterProperties = async(req,res) => {
    try {
        const sizes = await productModel.distinct("sizes").sort({sizes: 1});
        const colors = await productModel.distinct("color").sort({color: 1});
        const brandName = await productModel.distinct("brandName").sort({brandName: 1});

        if (!sizes || !colors || !brandName) {
            return res.status(400).json({error: "Not found"});
        }
        
        res.status(200).json({sizes, colors, brandName});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get filter properties "+error.message});
    }
}


const getFilterProducts = async (req, res) => {
    try {
      const { category, subCategory, sizes, colors, minPrice, maxPrice, brandNames} = req.body;
  
      // Build the query based on provided criteria
      let query = {};
      if (category) {
        query.category = category;
      }
      if (subCategory) {
        query.subCategory = subCategory;
      }
  
      // Check if sizes array is provided and use $in operator for efficient size matching
      if (sizes && sizes.length > 0) {
        query.sizes = { $in: sizes };
      }
      
      // Check if brandNames array is provided and use $in operator for efficient brandName matching
      if (brandNames && brandNames.length > 0) {
        query.brandName = { $in: brandNames };
      }

      // Check if color array is provided and use $in operator for efficient color matching
      if (colors && colors.length > 0) {
        query.color = { $in: colors };
      }
      
    //   Price range filtering (optional)
      if (minPrice && maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice }; // Price between min and max (inclusive)
      }
  
      const products = await productModel.find(query).sort({createdAt: -1});
  
      if (!products) {
        return res.status(400).json({ error: "Product not found." });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Error in get product " + error.message });
    }
};


const getAllProduct = async (req, res) => {
    try {

        const products = await productModel.find().sort({createdAt: -1});
        if (!products) {
          return res.status(400).json({ error: "Products not found." });
        }
    
        res.status(200).json(products);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in get all products " + error.message });
      }
};
  

const searchProductV1 = async(req,res) => {
    try {
        // const query = req.query.q;
        const {query} = req.params;
        
        const regex = new RegExp(query, 'i');

        const products = await productModel.find({
            "$or" : [
                {name: regex},
                {category: regex},
                {subCategory: regex},
                {color: regex},
                {brandName: regex},
            ]
        });

        res.status(200).json(products);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in search product " + error.message });
    }
}
  

const searchProductV2 = async(req,res) => {
    try {
        const query = req.query.q;        
        const regex = new RegExp(query, 'i');

        const products = await productModel.find({
            "$or" : [
                {name: regex},
                {category: regex},
                {subCategory: regex},
                {color: regex},
                {brandName: regex},
            ]
        });

        res.status(200).json(products);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in search product " + error.message });
    }
}


export {
    createProduct, 
    getVenderProducts, 
    updateProduct, 
    deleteProduct, 
    getProductDetails, 
    getProductByName, 
    getFilterProperties, 
    getFilterProducts, 
    getAllProduct,
    searchProductV1,
    searchProductV2
};