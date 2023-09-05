

const addTotalQuantityForProduct = (products)=>{
    let newProducts = []
    for (let {_doc} of products) {
    let totalQuantity = 0
    _doc.inventory.quantities.map(({quantity})=>{
        totalQuantity+=Number(quantity)
    })
    _doc.totalQuantity = totalQuantity
    _doc.isAvailable = totalQuantity>0?true:false 
       newProducts.push(_doc)
    }
    products._doc = newProducts
    return products
}
const removeSensativeContent = (products)=>{

    let newProducts = []
    for (let {_doc} of products) {
        _doc.updated = undefined 
        _doc.created_at = undefined 
        _doc.created_by= undefined
        _doc.costPrice = undefined
    }
    products._doc = newProducts
    return  products
}

module.exports = {
    addTotalQuantityForProduct,
    removeSensativeContent
}