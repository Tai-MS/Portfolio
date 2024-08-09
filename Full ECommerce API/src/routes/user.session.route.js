import express from 'express'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/chat', verifyToken,(req, res) => {
    const username = req.user.email
    console.log(username);
    res.render('chat', {username})
  })






export default router