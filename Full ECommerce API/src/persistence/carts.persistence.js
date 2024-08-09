import cartModel from '../models/cart.model.js'
import productClass from '../persistence/products.persistence.js'
import userClass from '../persistence/user.persistence.js'

class CartClass {
    async createCart(userId) {
        try {
            return await cartModel.create({ _id: userId, total: 0, cartProducts: [] });
        } catch (error) {
            return error;
        }
    }

    async getCart(cId) {
        try {
            const user = await userClass.getUser(cId);
            if (user) {
                const cart = await cartModel.findById(user._id);
                if (cart) {
                    return cart;
                }
            }
            const cart = await cartModel.findById(cId);
            if (cart) {
                return cart;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async sumTotal(fields) {
        try {
            const { cartId, pId, quantity = 1 } = fields;
            const cart = await this.getCart(cartId);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                let total = cart.total + product.price * quantity;
                await cartModel.updateOne({ _id: cartId }, { total: total });
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async lessTotal(fields) {
        try {
            const { user, pId, quantity = 1 } = fields;
            const cart = await this.getCart(user);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                let total = cart.total - product.price * quantity;
                await cartModel.updateOne({ _id: cart._id }, { total: total });
                return total;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async addProductToCart(fields) {
        try {
            const { user, pId, quantity = 1 } = fields;
            const userM = await userClass.getUser(user);
            const cart = await this.getCart(userM._id);
            const product = await productClass.getOne(pId);
            if (cart && product) {
                const cartId = cart._id;
                await this.sumTotal({ cartId, pId, quantity });
    
                const existingProductIndex = cart.cartProducts.findIndex(prod => {
                    return prod.productId.toString() === pId;
                });
    
                if (existingProductIndex !== -1) {
                    const newQuantity = cart.cartProducts[existingProductIndex].quantity + quantity;
                    cart.cartProducts[existingProductIndex].quantity = newQuantity;
                    cart.cartProducts[existingProductIndex].title = product.title;  
    
                    return await cartModel.updateOne(
                        { _id: cartId },
                        { $set: { cartProducts: cart.cartProducts } }
                    );
                } else {
                    return await cartModel.updateOne(
                        { _id: cartId },
                        { $push: { cartProducts: { quantity: quantity, productId: pId, title: product.title } } }  
                    );
                }
            }
            return false;
        } catch (error) {
            return error;
        }
    }
    

    async deleteProduct(fields) {
        try {
            const { user, pId } = fields;
            const cart = await this.getCart(user);

            if (cart) {
                const updatedProducts = cart.cartProducts.map(product => {
                    if (product.productId.toString() === pId && product.quantity > 1) {
                        product.quantity -= 1;
                    }
                    return product;
                }).filter(product => product.quantity > 0);

                await cartModel.updateOne(
                    { _id: cart._id },
                    { $set: { cartProducts: updatedProducts } }
                );

                await this.lessTotal({ user, pId });
                return true;
            }
            return false;
        } catch (error) {
            return { error: error.message };
        }
    }

    async cleanCart(cId) {
        try {
            const cart = await this.getCart(cId);
            if (cart) {
                return await cartModel.updateOne(
                    { _id: cId },
                    { $set: { total: 0, cartProducts: [] } }
                );
            }
            return 0;
        } catch (error) {
            return error;
        }
    }
}

const cartClass = new CartClass();
export default cartClass;