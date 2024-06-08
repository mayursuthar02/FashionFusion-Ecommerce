import mongoose from 'mongoose';
import randomstring from 'randomstring';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  stripeSessionId: {
    type: String,
    default: '',
    required: true
  }
}, {
    timestamps: true
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
