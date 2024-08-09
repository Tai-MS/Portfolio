import mongoose from 'mongoose'

//Enum with the differect roles
const rolesEnum = [
    'admin',
    'premium',
    'user'
]

const documentSchema = new mongoose.Schema({
    name: String,
    reference: String
});

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: [true, 'Missing field: Name']},
    email: {type: String, required: [true, 'Missing field: Email']},
    age: {type: Number, required: [true, 'Missing field: Age']},
    password: {type: String, required: [true, 'Missing field: Password']},
    role: {type: String, enum: rolesEnum, default:rolesEnum[2]},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
    documents: {
        profile: [documentSchema],
        products: [documentSchema],
        documents: [documentSchema],
    },
    lastConnection: { type: Date, default: Date.now },
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel