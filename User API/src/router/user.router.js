// User Registration, User Login, Get User Profile, Update User Profile, Delete User.
// Implement JWT-based authentication.
import express from 'express'
import { verifyToken, generateToken } from '../middlewares/auth.js'
import userController from '../controller/user.controller.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    return res.send('Welcome to the API of users.')
})

router.post('/signup', userController.signUp)

router.post('/login', generateToken, userController.login)

router.get('/getUser/:user', verifyToken, userController.getUser)

router.put('/updateUser', verifyToken, userController.update)

router.delete('/deleteUser', verifyToken, userController.deleteUser)

export default router