const Product = require('../models/product.model');


async function addCartItem(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }
    // we save the item in the cart 
    const cart = res.locals.cart;
    //  we access to the cart saved in the locals; we created it in the cart middleware
    cart.addItem(product);

    // and we update the session cart; this cart survive this request response cycle
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated',
        newTotalItems: cart.totalQuantity,
    });
}

module.exports = {
    addCartItem: addCartItem,
}