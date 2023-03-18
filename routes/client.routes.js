const express = require('express');

const clientController = require('../controllers/client.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();



router.get('/profile', clientController.getProfile);

router.post('/updatePersonalInfo',  imageUploadMiddleware, clientController.uploadPersonalInfo);

router.post('/updatePassword',  imageUploadMiddleware, clientController.updatePassword);

router.post('/deleteAccount',  imageUploadMiddleware, clientController.deleteClient);



module.exports = router;