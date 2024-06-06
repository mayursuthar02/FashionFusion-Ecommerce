import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName : {
        type: String,
        default: ""
    },
    businessName : {
        type: String,
        default: ""
    },
    brandName : {
        type: String,
        default: ""
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },
    isBusinessAccount: {
        type: Boolean, 
        default: false
    },
    profilePic : {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    wishlist : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        default: []
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('User', UserSchema);
export default userModel;