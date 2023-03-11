// importing the models
const User = require('../models/user.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

// getting the signup view
function getSignup(req, res) {
    // we get the session data saved
    let sessionData = sessionFlash.getSessionData(req);

    // if there's np session data saved we define the default data
    if (!sessionData) {
        // default data
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        }
    }
    // we pass the input data to the view, so we can display the error message and show the data that the user wrote lately
    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        confirmPassword: req.body['confirm-password'],
        name: req.body.name,
        identification: req.body.identification,
        // imagePath: req.body.imagePath,
    }

    // we access of the data of the form sent and we make a data validation
    if (
        !validation.userDetailsAreValid(
            req.body.email,
            req.body.password,
            req.body.name,
            req.body.identification,
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
                errorMessage: 'Please check your input. Password must be at least 6 characters long.',
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
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.identification,
        // req.body.imagePath,
    );

    // implementing our own error handling
    // activating of a error handling for the asychronous errors;
    try {
        // validating user created previusly 
        const existsAlready = await user.existAlready();
    
        if (existsAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
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
        await user.signup();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/login');
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
    res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    // using the data sent by the client form we create a new client
    const user = new User(req.body.email, req.body.password);
    // we searching the created user
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    }catch (error){
        next(error);
        return;
    }

    const sessionErrorData = {
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
                res.redirect('/login');
            }
        );
        return;
    }
    // we trate the user has loged in; the function is executed one the session is saved
    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    // after logout, we want to redirect the user to...
    res.redirect('/');
}

module.exports = {
    //  pointer to the function with the name of 'getSignup'
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
}