const { removeAttribute } = require("../../../common/user.hide.secrete")
const StoreModel = require("../../admin/store/model/StoreModel")


exports.storeById = async({storeId})=>{
    let store = await StoreModel.findOne({_id:storeId})
    if(store){
        store = removeAttribute([store],['created_by','creation_date','paymentMethod','websiteLayout','subscriptionDetails','__v','updateHistory'])
    }
    return store[0]
}