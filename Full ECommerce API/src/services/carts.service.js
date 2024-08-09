import cartClass from "../persistence/carts.persistence.js"
import userClass from "../persistence/user.persistence.js"

async function createCart(){
    return await cartClass.createCart()
}

async function deleteCart(fields){
    return await cartClass.deleteCart(fields)    
}

async function addProductToCart(fields){
    return await cartClass.addProductToCart(fields)    
}

async function deleteProductFromCart(fields){
    return await cartClass.deleteProduct(fields)    
}

async function getAll(){
    return await cartClass.getAll()
}

async function getCart(fields){
        const cart = await cartClass.getCart(fields._id)
        return cart 
    
    return 0
}

async function clearCart(fields){
    return await cartClass.cleanCart(fields)
}

export default{
    createCart,
    deleteCart,
    addProductToCart,
    deleteProductFromCart,
    getAll,
    getCart, 
    clearCart
}