import userModel from "../models/user.model.js";

class User{
    async signUp(fields){
        const create = await userModel.create(fields)
        return create
    }

    async login(fields){
        try {
            const { password, email } = fields

            const user = await this.getUser(email)

            

        } catch (error) {
            return error
        }
    }

    async update(fields){
        try {
            const response = await userModel.updateOne({email: fields.email}, fields, { new: true });
            return response;
        } catch (error) {
            return error
        }
    }

    async deleteUser(email){
        try {
            return await userModel.deleteOne({email: email})
        } catch (error) {
            return error
        }
    }

    async getUser(email){
        try {
            const user = await userModel.findOne({email: email})

            if(!user){
                return `User doesn't found`
            }
            return user
        } catch (error) {
            return error
        }
    }
}

const userClass = new User()

export default userClass