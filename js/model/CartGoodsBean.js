const CartGoodsBean = function ( id, shopId, cover, name, displayCurrency, singlePrice, quantity, selectTypesMap, goodObject ) {
    return {
        id: id,
        shopId: shopId,
        cover: cover,
        name: name,
        singlePrice: singlePrice,
        displayCurrency: displayCurrency,
        quantity: quantity,
        selectTypesMap: selectTypesMap,
        goodObject: goodObject
    }
};
export default CartGoodsBean;