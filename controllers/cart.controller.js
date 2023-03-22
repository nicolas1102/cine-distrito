const Product = require('../models/product.model');
const Snack = require('../models/snack.model');
// const Ticket = require('../models/ticket.model');

function getCart(req, res) {
    res.render('user/cart/cart');
}

async function addCartItemSnack(req, res, next) {
    let snack;
    try {
        snack = await Snack.findById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }
    // we save the item in the cart 
    const cart = res.locals.cart;
    //  we access to the cart saved in the locals; we created it in the cart middleware
    cart.addItem(snack);

    // and we update the session cart; this cart survive this request response cycle
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated!',
        newTotalItems: cart.totalQuantity,
    });
}

function updateCartItemSnack(req, res) {
    const cart = res.locals.cart;

    const updatedItemData = cart.updateItem(
        req.body.productId,
        req.body.quantity
    );

    // we update the session
    req.session.cart = cart;

    res.json({
        message: 'Item updated!',
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice,
        },
    });
}

// async function checkSnackQuantity(req, res, next) {
//     let snack;
//     try {
//         snack = await Snack.findById(req.params.id);
//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }

//     req.body.quantity = +req.body.quantity;
//     if (snack.amount < req.body.quantity) {
//         res.json({
//             message: 'The Snack quantity selected exceeds that available!',
//             exceededQuantity: true,
//         });
//         return;
//     }

//     res.json({
//         message: 'Product quantity available at the moment!',
//         exceededQuantity: false,
//     });
// }

module.exports = {
    getCart: getCart,
    addCartItemSnack: addCartItemSnack,
    updateCartItemSnack: updateCartItemSnack,
    // checkSnackQuantity: checkSnackQuantity,
}