import service from '../services/carts.service.js'

async function createCart(req, res, next){
    const call = await service.createCart()
    res.status(200).send(call)
}

async function deleteCart(req, res, next){
    const fields = {
        pId: req.params.pId,
        user: req.user.email
    }
    await service.deleteCart(fields)    
    res.status(200).send('Produc deleted')
}

async function addProductToCart(req, res, next){
    // const pId = req.params.pId
    const user = req
    console.log('req controle',req);
    const fields = {
        pId: req.pId,
        user: req.cId
    }
    console.log('req controle',fields.pId);
    console.log('req controle',fields.cId);

    const call = await service.addProductToCart(fields)    
}

async function deleteProductFromCart(req, res, next){
    const fields = {
        user: req.user.email,
        pId: req.params.pId
    }
    const call = service.deleteProductFromCart(fields)    
    res.status(200).send('Product deleted')
}


async function getCart(req, res, next){
    console.log("controller",req);
    const user = req
    const call = await service.getCart(user)
    return call
}

async function cleanCart(req, res, next){
    const user = req.user.email
    await service.clearCart(user)    
    res.status(200).send('Cart cleanned')
}

export default{
    createCart,
    deleteCart,
    addProductToCart,
    deleteProductFromCart,
    getCart,
    cleanCart
}