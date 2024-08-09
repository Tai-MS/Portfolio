import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });  

const cartSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total: { type: Number, required: true },
    cartProducts: [cartProductSchema]
});

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;
