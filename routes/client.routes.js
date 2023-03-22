const express = require('express');

const clientController = require('../controllers/client.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();



router.get('/profile', clientController.getProfile);

router.post('/updatePersonalInfo',  imageUploadMiddleware, clientController.uploadPersonalInfo);

router.post('/updatePassword', clientController.updatePassword);

router.post('/deleteAccount',  imageUploadMiddleware, clientController.deleteClient);


router.get('/orders', clientController.getOrders);

router.post('/orders', clientController.addOrder);


module.exports = router;