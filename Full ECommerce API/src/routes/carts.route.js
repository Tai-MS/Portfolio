import express from 'express'
import cartsController from '../controllers/carts.controller.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getCart',verifyToken, async(req, res, next) => {
    await cartsController.getCart(req, res, next)
})

router.put('/addProd/:pId', verifyToken,async(req, res, next) => {
    await cartsController.addProductToCart(req, res, next)
})


router.put('/cleanCart', verifyToken, async(req, res, next) => {
    await cartsController.cleanCart(req, res, next)
})

router.put('/delProd/:pId', verifyToken, async(req, res, next) => {
    await cartsController.deleteProductFromCart(req, res, next)
})


export default router