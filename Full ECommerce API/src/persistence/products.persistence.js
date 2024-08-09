import productsModel from '../models/products.model.js'

class ProductsClass{
    async getAll(){
        try{
            const products = await productsModel.find()
            if(products){
                return products
            }
            return 0
        }catch(error){
            return error
        }
    }

    async totalPages(){
        try{

        }catch(error){
            return error
        }
    }

    async getOne(id){
        try{
            const product = await productsModel.findOne({_id: id})
            if(product){
                return product
            }
    
            return 0
        }catch(error){
            return error
        }
    }

    async verifyCode(code){
        const existingCode = await productsModel.findOne({code: code})
        
        return existingCode
    }

    async createProd(fields){
        try {
            return await productsModel.create(fields)
        } catch (error) {
            return error
        }
    }

    async deleteProd(id){
        try{
            return await productsModel.deleteOne({_id: id})
        }catch(error){
            return error
        }

    }

    async updateprod(fields) {
        try {
            const id = fields.id;
            const product = await this.getOne(id);  
            if (product.stock <= 0 || (product.stock - fields.stock) <= 0) {
                fields.stock = 0;
            }
            return await productsModel.updateOne({ _id: id }, fields);
        } catch (error) {
            return { error: error.message };
        }
    }

/**
 * FORMA VIEJA DE UPDATEPROD
 * async updateprod(fields){
        try{
            const id = fields.id
            const product = this.getOne(id)
            if(product.stock <= 0 || (product.stock - fields.stock) <= 0){
                fields.stock = 0
            }
            await productsModel.updateOne({_id: id}, fields)
            return true
        }catch(error){
            return error
        }
    }
esta bien esta logica?
 */


    async verifyStock(id){
        try {
            const product = await this.getOne(id)
            if(product && product.stock > 0){
                return product.stock
            }
            return 0
        } catch (error) {
            return error
        }
    }

    async modifyStock(id, quantity = 1){
        try {
            const stock = this.verifyCode(id)
            const product = await this.getOne(id)

            if(stock >= quantity){
                const newStock = stock - quantity
                this.updateprod(id, {stock: newStock})
            }
            return 0
            
        } catch (error) {
            return error
        }
    }
}

const productsClass = new ProductsClass()

export default productsClass