//  we check if the current user have a cart in every incoming request (in every page loading); the role does not matter 

const Cart = require('../models/cart.model');


function initializeCart(req, res, next) {
    let cart;

    // only if we do not have a previously created cart
    if (!req.session.cart) {
        // new cart with no items
        cart = new Cart();
        // if we have a previously created cart, we refresh the cart wit the items we had
    } else {
        const sessionCart = req.session.cart;
        cart = new Cart(
            sessionCart.items,
            sessionCart.totalQuantity,
            sessionCart.totalPrice,
            sessionCart.totalPoints
        );
    }

    // we save the cart in locals; but the cart object, so we can use the method of the object class everywhere
    res.locals.cart = cart;

    next();
}

module.exports = initializeCart;