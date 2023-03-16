const express = require('express');

const clientController = require('../controllers/client.controller');

const router = express.Router();



router.post('/logout', clientController.logout);



module.exports = router;