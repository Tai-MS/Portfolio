import userClass from "../persistence/user.persistence.js";
import bcrypt from 'bcrypt'
import { generateToken, verifyToken } from "../middlewares/auth.js";
import transport from '../utils/mailer.js'
import { constants } from "../utils.js";
import path from "path";

async function createUser(fields){
    
    const {firstName, lastName, email, age, password, confirmPass } = fields

    password.toString()
    confirmPass.toString()

    if(!firstName || !lastName || !email || !age || !password ||!confirmPass){
        return 0
    }
    const fullName = firstName + " " + lastName

    if(password !== confirmPass){
        return 2
    }
        
    const hashedPass = await bcrypt.hash(password, 10);
    const userData = {
        fullName: fullName,
        email: email,
        age: age,
        password: hashedPass,
        role: 'user',
        documents: [],
        lastConnection: 'None'
    }

    return await userClass.createUser(userData)
}

async function getAll(verifyUser){
    const user = await userClass.getUser(verifyUser)
    if(user.role === 'admin'){
        return await userClass.getAll()
    }
    return 0
}

async function login(fields){
    const {email, password} = fields
    const date = new Date()
    if(!email || !password){
        return 0
    }
    fields.date = date

    
    return userClass.login(fields)
}

async function loginPassportGH(){
    
}

async function reqChangePass(req, res, next){
    const email = req.email
    const user = userClass.getUser(email)
    if(!user){
        return 0
    }
}

async function changePassword(fields){
    const {email, password, confirmPass} = fields
    const user = await userClass.getUser(email)
    if(!email || !password || !confirmPass || !user){
        return 0
    }
    const comparedWithOldPass = await bcrypt.compare(password, user.password)
    if(comparedWithOldPass){
        return 3
    }
    
    if(password != confirmPass){
        return 2
    }
    const hashedNewPass = await bcrypt.hash(password, 10)
    fields = {
        ...fields,
        user: user,
        newPass: hashedNewPass
    }

    return await userClass.changePassword(fields)
}

async function updateUser(fields) {
    let user = await userClass.getUser(fields.email);

    if(user.role !== 'admin'){
        delete fields.role
        delete fields.password
    }

    if(user.role === 'admin' && fields.emailOfOther !== undefined){
        user = await userClass.getUser(fields.emailOfOther)
        fields.email = fields.emailOfOther
    }
    if (!user) {
        return 1; 
    }

    const [firstName, lastName] = user.fullName.split(' ');

    let newFields = { ...fields };


    if (firstName !== fields.firstName && lastName !== fields.lastName) {
        newFields = {
            ...fields,
            fullName: fields.firstName + " " + fields.lastName
        };
    } else if (firstName !== fields.firstName) {
        newFields.fullName = fields.firstName + " " + lastName;
    } else if (lastName !== fields.lastName) {
        newFields.fullName = firstName + " " + fields.lastName;
    }
    delete newFields.firstName;
    delete newFields.lastName;
    delete newFields.password

    return await userClass.updateUser(newFields);
}

async function upload(req){
    const fields = {
        file: req.body.file,
        body: req.body,
        user: req.user
    }
    const user = await userClass.getUser(fields.user)
    const file = await fields.file
    let documentData
    if(user && file !== null){
        documentData = {
            name: file[1],
            reference: path.join('multer', req.body.file[0] == 0 ? 'profiles' : req.body.file[0] == 1 ? 'products' : 'documents', req.file.filename)
        }
    }
    if(fields.body.file[0] == 0){
        user.documents.profile = documentData
    }else if(fields.body.file[0] == 1){
        user.documents.products = documentData
    }else{
        user.documents.documents = documentData
    }

    return await user.save()
}

async function logout(){
    
}

async function changeRole(fields){
    const user = await userClass.getUser(fields.email)
    let newFields = {}
    const newRole = fields.role.toLowerCase()
    if(newRole !== 'user' && newRole !== 'admin' && newRole !== 'premium'){
        return 2
    }
    if(user.role === 'admin'){
        
        const otherUser = await userClass.getUser(fields.otherUserEmail)
        
        if(otherUser && fields.role){
            newFields = {
                email: otherUser.email,
                role: newRole
            }
            return await userClass.updateUser(newFields)
        }
    }
    newFields = {
        email: fields.email,
        role: 'premium'
    }
    const docsProducts = user.documents.products
    const docsProfile = user.documents.profile
    const docsDocuments = user.documents.documents
    
    
    if(docsDocuments.length > 0 && docsProducts.length > 0 && docsProfile.length > 0){
        return await userClass.updateUser(newFields)
    }
    return "0"
}

async function getUserByEmail(email) {
    return await userClass.getUser(email);
}

async function deleteUser(fields){
    const { token, otherUser } = fields
    const userToken = await userClass.getUser(token)
    const otherUserToDelete = await userClass.getUser(otherUser)
    if(userToken.role === 'admin' && otherUserToDelete){
        return await userClass.deleteUser(otherUser)
    }

    if(!userToken){
        return 'error'
    }
    return await userClass.deleteUser(token)
}

async function deleteInactive(fields){
    const { userToken, days } = fields
    const user = await userClass.getUser(userToken)
    if(user.role === 'admin'){
        return await userClass.deleteInactive(days)
    }
}

export default {
    createUser,
    getAll,
    login,
    loginPassportGH,
    changePassword,
    updateUser,
    logout,
    changeRole,
    reqChangePass,
    getUserByEmail,
    upload,
    deleteInactive,
    deleteUser
}