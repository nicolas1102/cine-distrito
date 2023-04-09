const express = require('express');

const clientController = require('../controllers/client.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();



router.get('/profile', clientController.getProfile);

router.post('/updatePersonalInfo',  imageUploadMiddleware, clientController.uploadPersonalInfo);

router.post('/updat ePassword', clientController.updatePassword);

router.post('/deleteAccount',  imageUploadMiddleware, clientController.deleteClient);


router.get('/orders', clientController.getOrders);

router.post('/orders', clientController.getPayment);

// router.post('/orders/success', clientController.addOrder);

router.get('/orders/success', clientController.getSuccessOrder);

router.get('/orders/failure', clientController.getFailureOrder);


module.exports = router;