import { constants } from '../utils.js'
import productsClass from '../persistence/products.persistence.js'
import userClass from '../persistence/user.persistence.js'
import transport from '../utils/mailer.js'

async function createProduct(fields){
    const {title, description, code, price, status, stock, category,
        thumbnail, owner, user
    } = fields

    const userRole = await userClass.getUser(user)
    if(userRole.role === 'admin' || userRole.role === 'premium'){
        const existingCode = await productsClass.verifyCode(code)
    
        if(!title || !description || !code || !price || !category || !stock || !status){
            return 0
        }
    
        if(existingCode){
            return 1
        }
        
        if(!thumbnail){
            fields.thumbnail = 'No image'
        }
    
        
        fields.owner = userRole._id
        
    
        return productsClass.createProd(fields)
    }
    return 3
}

async function updateProduct(fields){
    const originalProd = await productsClass.getOne(fields.body.id)
    const userFound = await userClass.getUser(fields.user.email)
    console.log('ori', originalProd);
    if((userFound && userFound._id.toString() === originalProd.owner.toString()) || userFound.role === 'admin'){
        const prodCode = fields.body.code
        const originalCode = originalProd.code
        if(!originalProd){
            return 0
        }
        if(originalCode !== prodCode){
            return 1
        }
    
        if(prodCode){
            fields.body.code = originalCode
        }
        const { body, user } = fields
        fields = {
            ...body,
            user: userFound._id
        }
        return await productsClass.updateprod(fields)

    }
    return 4
}

async function deleteProduct(id){
    const product = await productsClass.getOne(id)
    if (!product) {
        return 0; 
    }
    
    const productOwner = product.owner
    if (productOwner !== 'admin') {
        const productCreator = await userClass.getUser(productOwner.toString())
        if (!productCreator || !productCreator.email) {
            return 0; 
        }

        await transport.sendMail({
            from: constants.USERMAILER,
            to: productCreator.email,
            subject: 'One of your products was deleted from the page.',
            html:`
              <div>
                  <h1>We noticed something suspicious or a problem with one of your products.</h1>
                  <p>We've decided to delete the product: ${product.title} from our ecommerce</p>
              </div>
          `
        })
    }
    
    return await productsClass.deleteProd(id)
}


async function totalPages(req, res, next){
    
}


async function changeAnyProduct(fields){

} 

async function getProduct(id){
    const product = await productsClass.getOne(id)
    if(product.length < 1){
        return product
    }
    return 0
}

async function getAll(){
    return await productsClass.getAll()
}


export default{
    createProduct,
    updateProduct,
    deleteProduct,
    totalPages,
    getProduct,
    getAll,
    changeAnyProduct
}