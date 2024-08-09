import userClass from "../persistence/user.persistence.js";
import bcrypt from 'bcrypt'

async function signUp(fields){

    /**
     * Meaning of each return number:
     *  - M: Missing fields
     *  - A: Email Already in use
     *  - P: Passwor doesn't match
     */
    const { firstName, lastName, email, password, confirmPass } = fields
    if(!firstName || !lastName || !email || !password || !confirmPass){
        return 'M'
    }

    const user = await userClass.getUser(email)
    if(typeof user === 'object'){
        return 'A'
    }

    if(password !== confirmPass){
        return `P`
    }

    const hashPass = await bcrypt.hash(password, 10)
    const newFields = {
        fullName: `${firstName} ${lastName}`,
        email,
        password: hashPass
    };

    const createUser = await userClass.signUp(newFields)

    return createUser
}

async function login(fields){
    /**
     * Meaning of each return code:
     *  -M: missing fields
     *  -U: User doesn't found
     *  -P: Password doesn't match
     */
    const { email, password } = fields

    if(!email || !password){
        return 'M'
    }
    const user = await userClass.getUser(email)
    
    if(!user){
        return `U`
    }

    const comparedPass = await bcrypt.compare(password, user.password)
    if(!comparedPass){
        return `P`
    }

    return 'logged in'

}

async function update(fields){
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

    return await userClass.update(newFields);
}

async function deleteUser(email){
    const user = await userClass.getUser(email)

    if(!user){
        return 'User dont found'
    }

    return await userClass.deleteUser(email)
}

async function getUser(email){
    /**
     * Meaning of each return code:
     *  -D: user doesn`t found
     */
    const user = await userClass.getUser(email)

    if(!user){
        return `D`
    }
    const formatedInfo = {
        fullName: user.fullName,
        email: user.email
    }
    return formatedInfo
}

export default {
    getUser,
    deleteUser,
    signUp,
    login,
    update
}