import mongoose from 'mongoose'

const usersCollection = 'users'

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: [true, 'Missing field: Name']},
    email: {type: String, required: [true, 'Missing field: Email']},
    password: {type: String, required: [true, 'Missing field: Password']}
})

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel
