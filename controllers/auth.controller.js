// importing the models
const User = require('../models/user.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

// getting the signup view
function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res, next) {
    // we access of the data of the form sent and create the new user
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.identificationCard,
        // req.body.imagePath,
    );

    // implementing our own error handling
    // activating of a error handling for the asychronous errors;
    try {
        await user.signup();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    res.render('customer/auth/login');
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


    // if there's no user registrated
    if (!existingUser) {
        res.redirect('/login');
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    // if the password is not correct
    if (!passwordIsCorrect) {
        res.redirect('/login');
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