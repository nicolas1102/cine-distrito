const express = require('express');

const userController = require('../controllers/user.controller');
const clientController = require('../controllers/client.controller');

const router = express.Router();

router.get('/signup', clientController.getSignup);

router.post('/signup', clientController.signup);

router.get('/login', userController.getLogin);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

module.exports = router;

