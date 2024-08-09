// ticket.persistence.js:
import ticketModel from "../models/ticket.model.js";
import productClass from '../persistence/products.persistence.js';
import cartClass from '../persistence/carts.persistence.js';
import userClass from "./user.persistence.js";
import { v4 as uuidv4 } from 'uuid';

class TicketClass {
    async verifyStock(cart) {
        try {
            const missingStock = [];
            let totalCashToReduce = 0;
            for (const product of cart.cartProducts) {
                const productInfo = await productClass.getOne(product.productId);
                const quantity = product.quantity;
                let stock = productInfo.stock;
                const fields = {
                    id: product.productId,
                    stock: stock - quantity
                };

                const isInMissingStock = missingStock.some(missingProd => missingProd.pId === product.productId);

                if (stock === 0 && !isInMissingStock) {
                    const cashToReduce = productInfo.price * quantity;
                    missingStock.push({
                        pId: product.productId,
                        quantity: quantity,
                        cashToReduce: cashToReduce
                    });
                    totalCashToReduce += cashToReduce;
                } else if (stock < quantity && !isInMissingStock) {
                    const cashToReduce = productInfo.price * (quantity - stock);
                    missingStock.push({
                        pId: product.productId,
                        quantity: quantity - stock,
                        cashToReduce: cashToReduce
                    });
                    totalCashToReduce += cashToReduce;
                    fields.stock = 0;
                } else {
                    fields.stock = stock - quantity;
                }

                await productClass.updateprod(fields);
            }

            return { missingStock, totalCashToReduce };
        } catch (error) {
            return { error: error.message };
        }
    }

    async generateTicket(fields) {
        try {
            const cart = await cartClass.getCart(fields);
            const id = cart._id.toString()
            const user = await userClass.getUser(id);
            if (cart.cartProducts.length < 1 || !user) {
                return '1';
            }

            const oldTotal = cart.total;
            const { missingStock, totalCashToReduce } = await this.verifyStock(cart);
            if (missingStock.error) {
                return { error: missingStock };
            }
            if (missingStock.length > 0) {
                for (let i = 0; i < missingStock.length; i++) {
                    for (let j = 0; j < missingStock[i].quantity; j++) {
                        await cartClass.deleteProduct({ user: user._id, pId: missingStock[i].pId });
                    }
                }
            }
            await cartClass.cleanCart(cart._id);
            const newTotal = oldTotal - totalCashToReduce;
            const randomCode = uuidv4();
            const ticket = await ticketModel.create({
                code: randomCode,
                date: new Date().toISOString(),
                total: newTotal,
                purchaser: user.fullName
            });

            return ticket;
        } catch (error) {
            return { error: error.message };
        }
    }
}

const ticketClass = new TicketClass();
export default ticketClass;
