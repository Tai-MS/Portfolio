import mongoose from "mongoose";

const productCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: {type: String, required: [true, 'Missing field: ']},
    description: {type: String, required: [true, 'Missing field: description']},
    code: {type: String, required: [true, 'Missing field: code'], unique: [true, 'Code already in use']},
    price: {type: Number, required: [true, 'Missing field: price']},
    status: {type: Boolean, required: [true, 'Missing field: status']},
    stock: {type: Number, required: [true, 'Missing field: stock']},
    category: {
        type: String,
        required: [true, 'Missing field: Category'],
        set: function(word){
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
    },
    thumbnail: {type: String, default: 'No image'},
    owner: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: 'admin'
    },
})

const productModel = mongoose.model(productCollection, productsSchema)

export default productModel