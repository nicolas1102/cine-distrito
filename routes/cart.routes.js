const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);



router.post('/items/snack', cartController.addCartItemSnack);
// 'cause we are updating parts of the exiting data
router.patch('/items/snack', cartController.updateCartItemSnack);

// for check quantity of the product (of snack)
// router.post('/items/snack/:id', cartController.checkSnackQuantity);



module.exports = router;

