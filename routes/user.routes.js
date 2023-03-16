const express = require('express');

const userController = require('../controllers/user.controller');
const clientController = require('../controllers/client.controller');

const router = express.Router();

router.get('/', userController.get);

router.get('/home', userController.getPrincipalPage);

router.get('/signup', clientController.getSignup);

router.post('/signup', clientController.signup);

router.get('/login', userController.getLogin);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.get('/about-', userController.getAbout);

router.get('/401', function (req, res) {
    res.status(401).render('shared/errors/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/errors/403');
});


module.exports = router;

