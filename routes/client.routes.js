const express = require('express');

const clientController = require('../controllers/client.controller');

const router = express.Router();



router.get('/profile', clientController.getProfile);





module.exports = router;