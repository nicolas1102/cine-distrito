const mongodb = require('mongodb');

const Order = require('../models/order.model');
const Client = require('../models/client.model');
const Employee = require('../models/employee.model');
const Product = require('../models/product.model');
const Snack = require('../models/snack.model');
const Ticket = require('../models/ticket.model');
const Show = require('../models/show.model');
const Movie = require('../models/movie.model');
const Theater = require('../models/theater.model');

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



async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAll();
        res.render('admin/orders/admin-orders', {
            orders: orders
        });
    } catch (error) {
        next(error);
    }
}

async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;
    try {
        const order = await Order.findById(orderId);

        order.status = newStatus;

        await order.save();

        res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
        next(error);
    }
}

async function deleteOrder(req, res, next) {
    const orderId = req.params.id;
    let order;
    try {
        order = await Order.findById(orderId);
        await order.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }
    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted product!' });
}



async function getProducts(req, res, next) {
    try {
        const products = await Product.findAll();
        res.render('admin/products/admin-all-products', { products: products });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProduct(req, res) {
    let imageNameTemp = req.file.filename;

    const product = new Product({
        ...req.body,
        imageName: imageNameTemp,
    });

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
    let product;
    try {
        // extracting the value we entered in the URL in the admin router
        product = await Product.findById(req.params.id);
        res.render('admin/products/update-product', { product: product });
    } catch (error) {
        next(error);
        return;
    }
}

async function updateProduct(req, res, next) {
    const product = new Product({
        ...req.body,
        _id: req.params.id
    });

    //  just if the admin provides a new image for the product we change it
    if (req.file) {
        //  we search the database the product we are uploading, so we can delete the old product image
        const productAux = await Product.findById(req.params.id);
        // we delete the old product image of the storage
        fs.unlink(productAux.imagePath, (error) => {
            if (error) {
                console.log("The old product image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        // replace the old image with the new one
        product.replaceImage(req.file.filename);
    }
    try {
        await product.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);

        //  we search the database the product we are deleting, so we can delete the old product image
        const productAux = await Product.findById(req.params.id);
        // we delete the old product image of the storage
        fs.unlink(productAux.imagePath, (error) => {
            if (error) {
                console.log("The old product image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        await product.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted product!' });
    // res.redirect('/admin/movies');
}



async function getSnacks(req, res, next) {
    try {
        const snacks = await Snack.findAll();
        res.render('admin/snacks/admin-all-snacks', { snacks: snacks });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

async function getNewSnack(req, res, next) {
    let products;
    try {
        products = await Product.findAll();

        // just if there are products
        if (products) {
            const snacks = await Snack.findAll();
            let finalProducts = [];
            products.forEach(product => {
                // we show only the snack type products
                if (product.type === 'Snack') {
                    finalProducts.push(product);
                    //  we filter the products that there are not added to snacks collection
                    snacks.forEach(snack => {
                        finalProducts = finalProducts.filter(product => snack.id !== product.id);
                    });
                }
            });
            products = finalProducts;
        }

        res.render('admin/snacks/new-snack', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

async function createNewSnack(req, res, next) {
    // searching the seleted product
    let product;
    try {
        product = await Product.findById(req.body.product);
    } catch (error) {
        next(error);
        return;
    }
    let snackData = {
        product: { ...product },
        amount: req.body.amount,
    }
    const snack = new Snack(snackData);

    try {
        await snack.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/snacks');
}

async function getUpdateSnack(req, res, next) {
    let snack;
    let products;
    try {
        // extracting the value we entered in the URL in the admin router
        snack = await Snack.findById(req.params.id);
        products = await Product.findAll();
        const snacks = await Snack.findAll();

        let finalProducts = [];
        products.forEach(product => {
            // we show only the snack type products
            if (product.type === 'Snack') {
                finalProducts.push(product);
                //  we filter the products that there are not added to snacks collection
                snacks.forEach(snack => {
                    finalProducts = finalProducts.filter(product => snack.id !== product.id);
                });
            }
        });
        products = finalProducts;


        res.render('admin/snacks/update-snack', { snack: snack, products: products });
    } catch (error) {
        next(error);
        return;
    }
}

async function updateSnack(req, res, next) {
    let snackTemp;
    let product;
    try {
        snackTemp = await Snack.findById(req.params.id);
        product = await Product.findById(snackTemp.id);
    } catch (error) {
        next(error);
        return;
    }
    snackData = {
        product: { ...product },
        amount: req.body.amount,
        _id: req.params.id,
    }
    const snack = new Snack(snackData);

    try {
        await snack.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/admin/snacks');
}

async function deleteSnack(req, res, next) {
    let snack;
    try {
        snack = await Snack.findById(req.params.id);
        await snack.remove();
    } catch (error) {
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted product!' });
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

    const movie = new Movie({
        ...req.body,
        imageName: imageNameTemp,
    });

    try {
        await movie.save();
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
            } else {
                console.log("Delete File successfully.");
            }
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

        //  we search the database the product we are deleting, so we can delete the old product image
        const movieAux = await Movie.findById(req.params.id);
        // we delete the old product image of the storage
        fs.unlink(movieAux.imagePath, (error) => {
            if (error) {
                console.log("The old product image could not be deleted.");
                console.log(error);
            } else {
                console.log("Delete File successfully.");
            }
        });

        await movie.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted movie!' });
}



// async function getTickets(req, res, next) {
//     try {
//         const tickets = await Ticket.findAll();
//         res.render('admin/tickets/admin-all-tickets', { tickets: tickets });
//     } catch (error) {
//         console.log(error);
//         next(error);
//         return;
//     }
// }

// function getNewTicket(req, res) {
//     res.render('admin/tickets/new-ticket');
// }



async function getShows(req, res, next) {
    try {
        const shows = await Show.findAll();
        res.render('admin/shows/admin-all-shows', { shows: shows });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

async function getNewShow(req, res, next) {
    let movies;
    let theaters;
    try {
        movies = await Movie.findAll();
        theaters = await Theater.findAll();
        res.render('admin/shows/new-show', { movies: movies, theaters: theaters });
    } catch (error) {
        next(error);
        return;
    }
}

async function createNewShow(req, res, next) {
    let movie;
    let theater;
    try {
        movie = await Movie.findById(req.body.movie);
        theater = await Theater.findById(req.body.theater);

        // parsing data objects
        movie._id = new mongodb.ObjectId(movie.id);
        delete movie.id;
        theater._id = new mongodb.ObjectId(theater.id);
        delete theater.id;

        showData = {
            date: req.body.date,
            time: req.body.time,
            movie: movie,
            theater: theater,
            screen: req.body.screen,
        }
        const show = new Show(showData);
        await show.save();
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/admin/shows');
}

async function getUpdateShow(req, res, next) {
    let show;
    let movies;
    let theaters;
    try {
        show = await Show.findById(req.params.id);
        movies = await Movie.findAll();
        theaters = await Theater.findAll();
        res.render('admin/shows/update-show', { show: show, movies: movies, theaters: theaters });
    } catch (error) {
        next(error);
        return;
    }
}

async function updateShow(req, res, next) {
    let movie;
    let theater;
    try {
        movie = await Movie.findById(req.body.movie);
        theater = await Theater.findById(req.body.theater);

        // parsing data objects
        movie._id = new mongodb.ObjectId(movie.id);
        delete movie.id;
        theater._id = new mongodb.ObjectId(theater.id);
        delete theater.id;

        showData = {
            date: req.body.date,
            time: req.body.time,
            movie: movie,
            theater: theater,
            screen: req.body.screen,
            _id: req.params.id
        }
        const show = new Show(showData);
        await show.save();
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/admin/shows');
}

async function deleteShow(req, res, next) {
    let show;
    try {
        show = await Show.findById(req.params.id);
        await show.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted show!' });
}



async function getTheaters(req, res, next) {
    try {
        const theaters = await Theater.findAll();
        res.render('admin/theaters/admin-all-theaters', { theaters: theaters });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

function getNewTheater(req, res) {
    res.render('admin/theaters/new-theater');
}

async function getNumberTheaterScreens(req, res, next) {
    let theater;
    try {
        theater = await Theater.findById(req.body.theaterId);
    } catch (error) {
        next(error);
        return;
    }

    res.status(201).json({
        message: 'Number Theater Screens found!',
        numScreens: theater.numScreens,
    });
}

async function createNewTheater(req, res, next) {
    theaterData = {
        name: req.body.name,
        address: req.body.address,
        numScreens: req.body['num-screens'],
        rating: 0,
        amountRatings: 0,
    }
    const theater = new Theater(theaterData);

    try {
        await theater.save();
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/admin/theaters');
}

async function getUpdateTheater(req, res, next) {
    let theater;
    try {
        theater = await Theater.findById(req.params.id);
        res.render('admin/theaters/update-theater', { theater: theater });
    } catch (error) {
        next(error);
        return;
    }
}

async function updateTheater(req, res, next) {
    theaterData = {
        name: req.body.name,
        address: req.body.address,
        numScreens: req.body['num-screens'],
        rating: 0,
        amountRatings: 0,
        _id: req.params.id
    }
    const theater = new Theater(theaterData);

    try {
        await theater.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/admin/theaters');
}

async function deleteTheater(req, res, next) {
    let theater;
    try {
        theater = await Theater.findById(req.params.id);
        await theater.remove();
    } catch (error) {
        console.log(error);
        return next(error);
    }

    // we are using AJAX, so we dont need to redirect to anywhere, just responses something
    res.json({ message: 'Deleted theater!' });
}



module.exports = {
    getAdminMenu: getAdminMenu,

    getClients: getClients,
    getNewClient: getNewClient,

    getEmployees: getEmployees,
    getNewEmployee: getNewEmployee,

    getOrders: getOrders,
    updateOrder: updateOrder,
    deleteOrder: deleteOrder,

    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,

    getSnacks: getSnacks,
    getNewSnack: getNewSnack,
    createNewSnack: createNewSnack,
    getUpdateSnack: getUpdateSnack,
    updateSnack: updateSnack,
    deleteSnack: deleteSnack,

    getMovies: getMovies,
    getNewMovie: getNewMovie,
    createNewMovie: createNewMovie,
    getUpdateMovie: getUpdateMovie,
    updateMovie: updateMovie,
    deleteMovie: deleteMovie,

    // getTickets: getTickets,
    // getNewTicket: getNewTicket,

    getShows: getShows,
    getNewShow: getNewShow,
    createNewShow: createNewShow,
    getUpdateShow: getUpdateShow,
    updateShow: updateShow,
    deleteShow: deleteShow,

    getTheaters: getTheaters,
    getNewTheater: getNewTheater,
    getNumberTheaterScreens: getNumberTheaterScreens,
    createNewTheater: createNewTheater,
    getUpdateTheater: getUpdateTheater,
    updateTheater: updateTheater,
    deleteTheater: deleteTheater,

}



