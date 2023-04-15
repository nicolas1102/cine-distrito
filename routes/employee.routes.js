const express = require('express');

const employeeController = require('../controllers/employee.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

router.get('/profile', employeeController.getProfile);

router.post('/updatePersonalInfo',  imageUploadMiddleware, employeeController.uploadPersonalInfo);

router.post('/updatePassword', employeeController.updatePassword);



router.get('/orders', employeeController.getEmployeeOrderPayment);

module.exports = router;