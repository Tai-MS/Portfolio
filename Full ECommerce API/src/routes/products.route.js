import express from 'express'
import { verifyToken } from '../middlewares/auth.js'
import productsController from '../controllers/products.controller.js'


const router = express.Router()

router.get('/',verifyToken ,async(req, res, next) => {
    await productsController.getAll(req, res, next)
})

router.get('/getOne', verifyToken, async(req, res, next) => {
    await productsController.getProduct(req, res, next)
})

router.post('/createProd', verifyToken, async(req, res, next) => {
    await productsController.createProduct(req, res, next)
})

router.put('/editProd', verifyToken, async(req, res, next) => {
    await productsController.updateProduct(req, res, next)
})

router.delete('/deleteProd', verifyToken, async(req, res, next) => {
    await productsController.deleteProduct(req, res, next)
})

export default router