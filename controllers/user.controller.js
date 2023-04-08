const mongodb = require('mongodb');

// importing the models
const Employee = require('../models/employee.model');
const Client = require('../models/client.model');
const Snack = require('../models/snack.model');
const Movie = require('../models/movie.model');
const Show = require('../models/show.model');
const Ticket = require('../models/ticket.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

function get(req, res) {
    res.redirect('/home');
}

async function getHome(req, res) {
    let movies;
    let snacks;
    try {
        movies = await Movie.findAll();
        snacks = await Snack.findAll();
        res.render('user/cine-distrito', { movies: movies, snacks: snacks });
    } catch (error) {
        console.log(error);
        next(error);
    }
}



async function getMovieDetails(req, res, next) {
    let movie;
    let shows;
    let dates = [];
    try {
        // movie datails
        movie = await Movie.findById(req.params.id);
        const hoursDuration = Math.floor(movie.duration / 60);
        const minutesDuration = movie.duration - (hoursDuration * 60);
        movie.duration = {
            hours: hoursDuration,
            minutes: minutesDuration,
        }

        shows = await Show.findAllByMovie(req.params.id);

        // filter dates of the shows for movie
        let finalDates = [];
        if (shows) {
            shows.forEach(show => {
                finalDates.push(show.date);
            });
            // removing duplicates
            finalDates = new Set(finalDates);
            dates = [...finalDates];
            dates.sort();
        }

        res.render('user/movies/movie-details', {
            movie: movie,
            dates: dates,
        });
    } catch (error) {
        next(error);
    }
}

async function getMovieTheatersByDate(req, res, next) {
    let shows;
    let theaters = [];
    try {
        shows = await Show.findByMovieAndDate(req.body.movieId, req.params.date);
    } catch (error) {
        next(error);
        return;
    }


    let finalTheaters = [];
    if (shows) {
        shows.forEach(show => {
            finalTheaters.push(show.theater);
        });

        // removing duplicates
        finalTheaters = Array.from(new Set(finalTheaters.map(JSON.stringify))).map(JSON.parse);
        theaters = [...finalTheaters];
        theaters.sort();
    }

    res.status(201).json({
        message: 'Theaters found!',
        theaters: theaters,
    });
}

async function getMovieShowTimesByTheater(req, res, next) {
    let shows;
    try {
        shows = await Show.findByMovieAndDateAndTheater(req.body.movieId, req.params.theaterid, req.body.date);
    } catch (error) {
        next(error);
        return;
    }

    res.status(201).json({
        message: 'Theaters found!',
        shows: shows,
    });
}

async function getMovieShowtimeTickets(req, res, next) {
    let show;
    let tickets;
    let snacks;
    let productsTickets;
    try {
        show = await Show.findById(req.params.id);
        const hoursDuration = Math.floor(show.movie.duration / 60);
        const minutesDuration = show.movie.duration - (hoursDuration * 60);
        show.movie.duration = {
            hours: hoursDuration,
            minutes: minutesDuration,
        }
        tickets = await Ticket.findByShow(show.id);
        // tickets = await Order.findByShow(show.id);
        snacks = await Snack.findAll();

        // finding the price of for type of ticket
        productsTickets = await Product.findByType('Ticket');
        let ticketGeneral;
        let ticketPreferential;
        productsTickets.forEach(productsTicket => {
            if (productsTicket.name === 'Ticket (General)') {
                ticketGeneral = productsTicket;
            } else if (productsTicket.name === 'Ticket (Preferential)') {
                ticketPreferential = productsTicket;
            }
        });

        res.render('user/shows/show-details', { show: show, tickets: tickets, snacks: snacks, ticketGeneral: ticketGeneral, ticketPreferential: ticketPreferential });
    } catch (error) {
        next(error);
        return;
    }
}



function getCart(req, res) {
    let sessionData = sessionFlash.getSessionData(req);
    // if there's no saved data, we define the dafault data
    if (!sessionData) {
        // default data
        sessionData = {};
    }
    res.render('user/cart/cart', { inputData: sessionData });
}

async function addCartItemSnack(req, res, next) {
    let snack;
    try {
        snack = await Snack.findById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }
    // we save the item in the cart 
    const cart = res.locals.cart;
    //  we access to the cart saved in the locals; we created it in the cart middleware
    cart.addItem(snack);

    // and we update the session cart; this cart survive this request response cycle
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated!',
        newTotalItems: cart.totalQuantity,
    });
}

function updateCartItemSnack(req, res) {
    const cart = res.locals.cart;

    const updatedItemData = cart.updateItem(
        req.body.productId,
        +req.body.quantity
    );

    // we update the session
    req.session.cart = cart;

    res.json({
        message: 'Item updated!',
        updatedCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updatedItemData.updatedItemPrice,
        },
    });
}

// async function checkSnackQuantity(req, res, next) {
//     let snack;
//     try {
//         snack = await Snack.findById(req.params.id);
//     } catch (error) {
//         console.log(error);
//         return next(error);
//     }

//     req.body.quantity = +req.body.quantity;
//     if (snack.amount < req.body.quantity) {
//         res.json({
//             message: 'The Snack quantity selected exceeds that available!',
//             exceededQuantity: true,
//         });
//         return;
//     }

//     res.json({
//         message: 'Product quantity available at the moment!',
//         exceededQuantity: false,
//     });
// }

async function addCartItemTickets(req, res, next) {
    let generalTicketProduct;
    let preferentialTicketProduct;
    let show;
    try {
        generalTicketProduct = await Product.findById(req.body.generalTicketProductId);
        preferentialTicketProduct = await Product.findById(req.body.preferentialTicketProductId);
        show = await Show.findById(req.body.showId);
    } catch (error) {
        next(error);
        return;
    }

    // parsing data objects
    generalTicketProduct._id = new mongodb.ObjectId(generalTicketProduct.id);
    delete generalTicketProduct.id;
    preferentialTicketProduct._id = new mongodb.ObjectId(preferentialTicketProduct.id);
    delete preferentialTicketProduct.id;
    show._id = new mongodb.ObjectId(show.id);
    delete show.id;

    const ticketsGeneralPositions = req.body.generalTickets;
    const ticketsPreferentialPositions = req.body.preferentialTickets;

    const tickets = [];
    let ticket;

    for (let i = 0; i < ticketsGeneralPositions.length; i++) {
        ticketData = {
            product: { ...generalTicketProduct },
            rowChair: ticketsGeneralPositions[i].row,
            columnChair: ticketsGeneralPositions[i].column,
            isPreferencial: false,
            show: show,
            status: 'pending',
        }
        ticket = new Ticket(ticketData);

        try {
            // await ticket.save();
            // ticket = await Ticket.findByPositionAndShow(ticket.rowChair, ticket.columnChair, ticket.isPreferencial, show._id);
        } catch (error) {
            next(error);
            return;
        }
        tickets.push(ticket);
    };

    for (let i = 0; i < ticketsPreferentialPositions.length; i++) {
        ticketData = {
            product: { ...preferentialTicketProduct },
            rowChair: ticketsPreferentialPositions[i].row,
            columnChair: ticketsPreferentialPositions[i].column,
            isPreferencial: true,
            show: show,
            status: 'pending',
        }
        ticket = new Ticket(ticketData);

        try {
            // await ticket.save();
            // ticket = await Ticket.findByPositionAndShow(ticket.rowChair, ticket.columnChair, ticket.isPreferencial, show._id);
        } catch (error) {
            next(error);
            return;
        }
        tickets.push(ticket);
    };

    const cart = res.locals.cart;

    tickets.forEach(ticket => {
        cart.addItem(ticket);
    });

    // and we update the session cart; this cart survive this request response cycle
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated!',
    });
}



function getSignup(req, res) {
    // we get the session data saved
    let sessionData = sessionFlash.getSessionData(req);

    // if there's no session data saved we define the default data
    if (!sessionData) {
        // default data
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            name: '',
            identification: '',
            imageName: '',
        }
    }
    // we pass the input data to the view, so we can display the error message and show the data that the user wrote lately
    res.render('user/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        confirmPassword: req.body['confirm-password'],
        name: req.body.name,
        identification: req.body.identification,
        imageName: req.file.filename,
    }

    // we access of the data of the form sent and we make a data validation
    if (
        !validation.clientDetailsAreValid(
            req.body.email,
            req.body.password,
            req.body.name,
            req.body.identification,
            req.file.filename
        ) ||
        !validation.emailIsConfirmed(
            req.body.email,
            req.body['confirm-email']
        ) ||
        !validation.passwordIsConfirmed(
            req.body.password,
            req.body['confirm-password']
        )
    ) {
        // saving the data that the user has write, so if the request fail, the user wont lose the data the has wrote. we also, sent the message if there's any error in user input, so we can show the message in the webpage
        sessionFlash.flashDataToSession(
            req,
            {
                title: 'INVALID CREDENTIALS',
                errorMessage: 'Please check your input. Password must be at least 6 characters long and Identification Card must be 10 characters and the image is not optional.',
                // spread operator, so we save the user entered data (object created above)
                ...enteredData,
            },
            // once the data has been saved, we sent the request to reset the page
            function () {
                res.redirect('/signup');
            }
        );
        return;
    }

    // we access of the data of the form sent and create the new user
    const client = new Client(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.identification,
        req.file.filename,
    );

    // implementing our own error handling
    // activating of a error handling for the asychronous errors;
    try {
        // validating user created previusly 
        const existsAlready = await client.existAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
                    title: 'INVALID CREDENTIALS',
                    errorMessage: 'User exist already! Try logging in instead!',
                    ...enteredData,
                },
                function () {
                    res.redirect('/signup');
                }
            );
            return;
        }

        // we sign up the user once he passes the validations
        await client.save();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }


    sessionFlash.flashDataToSession(
        req,
        {
            title: 'THANK FOR SINGING UP',
            errorMessage: ' Thank you 😀. You have successfully registered. Now you can enter our system as a client with your new user.',
        },
        function () {
            res.redirect('/login');
        }
    );

}



function getLogin(req, res) {
    // we validate if the user has submitting any data before
    let sessionData = sessionFlash.getSessionData(req);

    // if there's no saved data, we define the dafault data
    if (!sessionData) {
        // default data
        sessionData = {
            email: '',
            password: '',
        };
    }

    // we pass the input data to the view, so we can display the error message
    res.render('user/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    // using the data sent by the client form we create a new client
    let user = new Client(req.body.email, req.body.password);
    // we searching the created user
    let existingUser;
    try {
        // in the clients collection in database
        existingUser = await user.getUserWithSameEmail();
        if (!existingUser) {
            user = new Employee(req.body.email, req.body.password);
            existingUser = await user.getUserWithSameEmail();
        }
    } catch (error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        title: 'INVALID CREDENTIALS',
        errorMessage: 'Invalid credentials - please double-check your email and password!',
        email: user.email,
        password: user.password,
    }

    // if there's no user registrated
    if (!existingUser) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                // refresh the page
                res.redirect('/login');
            }
        );
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    // if the password is not correct
    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                // refresh the page
                res.redirect('/login');
            }
        );
        return;
    }

    // setting default user role 
    if (existingUser.role === undefined) {
        existingUser = new Client(
            existingUser.email,
            existingUser.password,
            existingUser.name,
            existingUser.identification,
            existingUser.imageName,
            existingUser._id,
        );
        existingUser.role = 'client';
    } else {
        existingUser = new Employee(
            existingUser.email,
            existingUser.password,
            existingUser.name,
            existingUser.identification,
            existingUser.imageName,
            existingUser.role,
            existingUser.phoneNumber,
            existingUser.contractStartDate,
            existingUser.salary,
            existingUser.theater,
            existingUser._id,
        );
    }

    console.log('Logged in User: [' + existingUser.email + ', ' + existingUser.role + ']');

    // we trate the user as logged in; the function is executed one the session is saved
    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/home');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);

    // after logout, we want to redirect the user to...
    res.redirect('/login');
}



function getAboutUs(req, res) {

}

module.exports = {
    get: get,
    getHome: getHome,

    getMovieDetails: getMovieDetails,
    getMovieTheatersByDate: getMovieTheatersByDate,
    getMovieShowTimesByTheater: getMovieShowTimesByTheater,
    getMovieShowtimeTickets: getMovieShowtimeTickets,

    getCart: getCart,
    addCartItemSnack: addCartItemSnack,
    updateCartItemSnack: updateCartItemSnack,
    addCartItemTickets: addCartItemTickets,

    getSignup: getSignup,
    signup: signup,

    getLogin: getLogin,
    login: login,

    logout: logout,

    getAboutUs: getAboutUs,

}