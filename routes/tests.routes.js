const express = require('express');

const testsController = require('../controllers/tests.controller');

const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();


router.get('/all-movies', testsController.getAllMovies);



router.post('/signup', testsController.testSignup);



module.exports = router;