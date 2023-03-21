// importing the models
// const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const Client = require('../models/client.model');
const Snack = require('../models/snack.model');
const Movie = require('../models/movie.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

function get(req, res) {
    res.redirect('/home');
}

async function getHome(req, res) {
    try {
        const movies = await Movie.findAll();
        const snacks = await Snack.findAll();
        res.render('user/cine-distrito', { movies: movies, snacks: snacks });
    } catch (error) {
        console.log(error);
        next(error);
    }
}



async function getMovieDetails(req, res, next) {
    try {
        const movie = await Movie.findById(req.params.id);
        const hoursDuration = Math.floor(movie.duration / 60);
        const minutesDuration = movie.duration - (hoursDuration * 60);
        movie.duration = {
            hours: hoursDuration,
            minutes: minutesDuration,
        }
        res.render('user/movies/movie-details', { movie: movie });
    } catch (error) {
        next(error);
    }
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
        }
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
    getSignup: getSignup,
    signup: signup,
    getLogin: getLogin,
    login: login,
    logout: logout,
    getAboutUs: getAboutUs
}