const CategoryModel = require("../../models/CategoryModel");
const productModel = require("../../models/productModel");

class ProductService {
    async getProductByStoreId({storeId}){
        return await productModel.find({storeId:storeId});
    }
    async getCategoryByStoreId({storeId}){
        return await CategoryModel.find({storeId});
    }


}


const ProductS = new ProductService();

module.exports = ProductS;