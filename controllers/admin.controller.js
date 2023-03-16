const Movie = require('../models/movie.model');

const fs = require('fs');

function getAdminMenu(req, res) {
    res.render('admin/admin-menu');
}



function getClients(req, res) {
    res.render('admin/clients/all-clients');
}

function getNewClient(req, res) {
    res.render('admin/clients/new-client');
}



function getEmployees(req, res) {
    res.render('admin/employees/all-employees');
}

function getNewEmployee(req, res) {
    res.render('admin/employees/new-employee');
}



function getProducts(req, res) {
    res.render('admin/products/all-products');
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

function createNewProduct() {

}



function getSnacks(req, res) {
    res.render('admin/snacks/all-snacks');
}

function getNewSnack(req, res) {
    res.render('admin/snacks/new-snack');
}



async function getMovies(req, res, next) {
    try {
        const movies = await Movie.findAll();
        res.render('admin/movies/admin-all-movies', { movies: movies });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

function getNewMovie(req, res) {
    res.render('admin/movies/new-movie');
}

async function createNewMovie(req, res) {
    let imageNameTemp = req.file.filename;

    const product = new Movie({
        ...req.body,
        imageName: imageNameTemp,
    });

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/movies');
}

async function getUpdateMovie(req, res, next) {
    let movie;
    try {
        // extracting the value we entered in the URL in the admin router
        movie = await Movie.findById(req.params.id);
        // const movie = await Movie.findById(req.params.id);
        res.render('admin/movies/update-movie', { movie: movie });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

async function updateMovie(req, res, next) {
    const movie = new Movie({
        ...req.body,
        _id: req.params.id
    });

    //  just if the admin provides a new image for the movie we change it
    if (req.file) {
        //  we search the database the movie we are uploading, so we can delete the old movie image
        const movieAux = await Movie.findById(req.params.id);
        // we delete the old movie image of the storage
        fs.unlink(movieAux.imagePath, (error) => {
            if (error) {
                console.log("The old movie image could not be deleted.");
                console.log(error);
            }
            console.log("Delete File successfully.");
        });

        // replace the old image with the new one
        movie.replaceImage(req.file.filename);
    }
    try {
        await movie.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/admin/movies');
}

async function deleteMovie(req, res, next) {
    let movie;
    try {
        movie = await Movie.findById(req.params.id);
        await movie.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted movie!' });
    // res.redirect('/admin/movies');
}



function getTickets(req, res) {
    res.render('admin/tickets/all-tickets');
}

function getNewTicket(req, res) {
    res.render('admin/tickets/new-ticket');
}



function getShows(req, res) {
    res.render('admin/shows/all-shows');
}

function getNewShow(req, res) {
    res.render('admin/shows/new-show');
}



function getMultiplexes(req, res) {
    res.render('admin/multiplexes/all-multiplexes');
}

function getNewMultiplex(req, res) {
    res.render('admin/multiplexes/new-multiplex');
}




module.exports = {
    getAdminMenu: getAdminMenu,

    getClients: getClients,
    getNewClient: getNewClient,

    getEmployees: getEmployees,
    getNewEmployee: getNewEmployee,

    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,

    getSnacks: getSnacks,
    getNewSnack: getNewSnack,

    getMovies: getMovies,
    getNewMovie: getNewMovie,
    createNewMovie: createNewMovie,
    getUpdateMovie: getUpdateMovie,
    updateMovie: updateMovie,
    deleteMovie: deleteMovie,

    getTickets: getTickets,
    getNewTicket: getNewTicket,

    getShows: getShows,
    getNewShow: getNewShow,

    getMultiplexes: getMultiplexes,
    getNewMultiplex: getNewMultiplex,
}



