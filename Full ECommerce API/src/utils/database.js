import { mongoose } from 'mongoose'
import { constants } from '../utils.js'

export function connections(){
    mongoose.connect(constants.MONGO_CONNECT)
        .then(()=>{
            console.log('Connected to DB');
        })
        .catch(error => {
            console.error('Error connecting to DB. Error: ', error);
        })
}

export const connectDB = async () => {
    try {
        await mongoose.connect(constants.MONGO_CONNECT)
        console.log('Connect to DB');
    } catch (error) {
        console.log(err);
    }
}

