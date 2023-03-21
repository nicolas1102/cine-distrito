function addCartItem(req, res) {
    //  we access to the cart saved in the locals; we created it in the cart middleware
    res.locals.cart.addItem();
}

module.exports = {
    addCartItem: addCartItem,
}