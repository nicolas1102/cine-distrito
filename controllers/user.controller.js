// importing the models
// const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const Client = require('../models/client.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');


function getPrincipalPage(req, res) {
    res.render('user/cine-distrito');
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





function getAbout (req, res) {

}

module.exports = {
    getPrincipalPage: getPrincipalPage,
    //  pointer to the function with the name of 'getSignup'
    getLogin: getLogin,
    login: login,
    logout: logout,
    getAbout: getAbout
}