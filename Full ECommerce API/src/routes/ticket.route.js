import express from 'express'
import ticketController from '../controllers/ticket.controller.js'

import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/', verifyToken,async(req, res, next) => {
    await ticketController.generateTicket(req, res, next)
})

export default router