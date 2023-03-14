const express = require('express');

const adminController = require('../controllers/admin.controller');
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = express.Router();


router.get('/', adminController.getAdminMenu);

router.get('/clients', adminController.getClients);

router.get('/clients/new', adminController.getNewClient);


router.get('/employees', adminController.getEmployees);

router.get('/employees/new', adminController.getNewEmployee);


router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);


router.get('/snacks', adminController.getSnacks);

router.get('/snacks/new', adminController.getNewSnack);


router.get('/movies', adminController.getMovies);

router.get('/movies/new', adminController.getNewMovie);

router.post('/movies', imageUploadMiddleware, adminController.createNewMovie);

router.get('/movies/:id', adminController.getUpdateMovie);

router.post('/movies/:id', adminController.updateMovie);


router.get('/tickets', adminController.getTickets);

router.get('/tickets/new', adminController.getNewTicket);


router.get('/plays', adminController.getPlays);

router.get('/plays/new', adminController.getNewPlay);


router.get('/multiplexes', adminController.getMultiplexes);

router.get('/multiplexes/new', adminController.getNewMultiplex);


module.exports = router;

