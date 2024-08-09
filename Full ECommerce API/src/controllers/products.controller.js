import service from '../services/products.service.js'

async function createProduct(req, res, next){
    let fields = req.body
    fields = {
        ...fields,
        user: req.user.email
    }
    const call = await service.createProduct(fields)
    if(!call){
        return res.status(200).send('Missing fields.')
    }else if(call === 1){
        return res.status(200).send('Code already exists.')
    }else if(call === 3){
        return res.status(200).send('You must be premium to create a product.')
    }

    return res.status(200).send('Product created.')
}

async function updateProduct(req, res, next){
    const fields = {
        body: req.body,
        user: req.user}
    const call = await service.updateProduct(fields)

    if(!call){
        return res.status(200).send('Product doesn`t found.')
    }else if(call === 1){
        return res.status(200).send('You can not change the code of the product.')
    }else if(call === 4){
        return res.status(200).send('You do not have access to this product.')

    }

    return res.status(200).send('Modified.')
}

async function deleteProduct(req, res, next){
    const id = req.body.id
    const call = await service.deleteProduct(id)
    if(!call){
        return res.status(200).send('Product doesn`t found.')
    }

    return res.status(200).send('Product deleted.')
}

async function totalPages(req, res, next){
    
}

async function getProduct(req, res, next){
    const id = req.body.id
    const call = await service.getProduct(id)
    if(!call){
        return res.status(200).send('Product don`t found.')
    }
    return res.send(call)
}

async function getAll() {
    const call = await service.getAll();
    if (!Array.isArray(call) || call.length < 1) {
        throw new Error('Unexpected error has occurred.');
    }
    return call;
}


export default{
    createProduct,
    updateProduct,
    deleteProduct,
    totalPages,
    getProduct,
    getAll
}