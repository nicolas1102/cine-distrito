const express = require('express');

const employeeController = require('../controllers/employee.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();

router.get('/profile', employeeController.getProfile);



module.exports = router;