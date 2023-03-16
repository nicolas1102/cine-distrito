const express = require('express');

const clientController = require('../controllers/client.controller');

const router = express.Router();

router.get('/signup', clientController.getSignup);

router.post('/signup', clientController.signup);


module.exports = router;