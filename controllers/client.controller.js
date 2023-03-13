// importing the models
// const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const Client = require('../models/client.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

// getting the signup view
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
    res.render('client/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        confirmPassword: req.body['confirm-password'],
        name: req.body.name,
        identification: req.body.identification,
        imageName: req.body.imageName,
    }

    // we access of the data of the form sent and we make a data validation
    if (
        !validation.clientDetailsAreValid(
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
                errorMessage: 'Please check your input. Password must be at least 6 characters long and Identification Card must be 10 characters.',
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
        req.body.imageName,
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
        await client.signup();
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }

    res.redirect('/login');
}

module.exports = {
    //  pointer to the function with the name of 'getSignup'
    getSignup: getSignup,
    signup: signup,
}