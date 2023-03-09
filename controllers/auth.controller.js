// importing the models
const User = require('../models/user.model');

// getting the signup view
function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res) {
    // we access of the data of the form sent and create the new user
    const user = new User(
        req.body.fullname,
        req.body.identificationCard,
        req.body.email,
        req.body.password,
        // req.body.imagePath,
    );

    await user.signup();

    res.redirect('/login');
}

function getLogin(req, res) {
    res.render('customer/auth/login');
}



module.exports = {
    //  pointer to the function with the name of 'getSignup'
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
}