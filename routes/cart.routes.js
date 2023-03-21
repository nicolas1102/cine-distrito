const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);



router.post('/items', cartController.addCartItem);
// 'cause we are updating parts of the exiting data
router.patch('/items', cartController.updateCartItem);



module.exports = router;

