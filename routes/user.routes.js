const express = require('express');

const userController = require('../controllers/user.controller');

const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();



router.get('/', userController.get);

router.get('/home', userController.getHome);



router.get('/movies/:id', userController.getMovieDetails);

router.post('/movies/shows/theaters/:date', userController.getMovieTheatersByDate);

router.post('/movies/shows/showtimes/:theaterid', userController.getMovieShowTimesByTheater);

router.get('/movies/shows/:id', userController.getMovieShowtimeTickets);

router.post('/movies/shows/:id', userController.addCartItemTickets);



router.get('/cart', userController.getCart);

router.post('/cart/items/snack', userController.addCartItemSnack);
// 'cause we are updating parts of the exiting data
router.patch('/cart/items/snack', userController.updateCartItemSnack);



router.get('/signup', userController.getSignup);

router.post('/signup', imageUploadMiddleware, userController.signup);



router.get('/login', userController.getLogin);

router.post('/login', userController.login);



router.post('/logout', userController.logout);



router.get('/about-us', userController.getAboutUs);



router.get('/401', function (req, res) {
    res.status(401).render('shared/errors/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/errors/403');
});



module.exports = router;