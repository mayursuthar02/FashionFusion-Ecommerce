import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PLPFeSHDy8obYAWHyJYv5erKFcXiOwcFAesWbLgpkB2HD7SiWbQakVgrKBXk7OWHTvH5JVmXv0ZvXifjynFtv9700MNUsyWqe');

const stripeCheckout = async(req,res) => {
    try {
        const {products} = req.body; 
        const address = req.user.address;
        if (!address.line1 || !address.city || !address.pinCode || !address.state) {
            return res.status(400).json({error: "Please add your address"});
        }
        const currency = "inr";
        const lineItems = products.map((product) =>{
            const originalPrice = product.productId.price;
            const discount = product.productId.discount;
            const discountedPrice = originalPrice - (originalPrice * (discount / 100));
            const unitAmount = Math.round(discountedPrice * 100);
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.images[0]]
                    },
                    unit_amount: unitAmount,
                },
                quantity: product.quantity
            }
        });
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/order/cancelled`,
            shipping_address_collection: {
                allowed_countries: ['IN'] // Allow only India for shipping
            },
            billing_address_collection: 'required',
            customer_email: req.user.email,
        });

        res.status(200).json({id: session.id});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in stripe checkout "+ error.message})
    }
}

export {
    stripeCheckout,
}