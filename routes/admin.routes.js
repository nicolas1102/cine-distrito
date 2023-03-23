const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();


router.get('/', adminController.getAdminMenu);



// router.get('/clients', adminController.getClients);

// router.get('/clients/new', adminController.getNewClient);



// router.get('/employees', adminController.getEmployees);

// router.get('/employees/new', adminController.getNewEmployee);



router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

router.delete('/orders/:id', adminController.deleteOrder);



router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, adminController.createNewProduct);

router.get('/products/:id', adminController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);
// using ajax http methods 
router.delete('/products/:id', adminController.deleteProduct);



router.get('/snacks', adminController.getSnacks);

router.get('/snacks/new', adminController.getNewSnack);

router.post('/snacks', adminController.createNewSnack);

router.get('/snacks/:id', adminController.getUpdateSnack);

router.post('/snacks/:id', adminController.updateSnack);
// using ajax http methods 
router.delete('/snacks/:id', adminController.deleteSnack);



router.get('/movies', adminController.getMovies);

router.get('/movies/new', adminController.getNewMovie);

router.post('/movies', imageUploadMiddleware, adminController.createNewMovie);

router.get('/movies/:id', adminController.getUpdateMovie);

router.post('/movies/:id', imageUploadMiddleware, adminController.updateMovie);
// using ajax http methods 
router.delete('/movies/:id', adminController.deleteMovie);



// router.get('/tickets', adminController.getTickets);

// router.get('/tickets/new', adminController.getNewTicket);



// router.get('/shows', adminController.getShows);

// router.get('/shows/new', adminController.getNewShow);



// router.get('/theaters', adminController.getTheaters);

// router.get('/theaters/new', adminController.getNewTheater);



module.exports = router;

