const Client = require('../models/client.model');

// to create tell the session the user is logged in
const authUtil = require('../util/authentication');

const validation = require('../util/validation');

// to save user entered input data
const sessionFlash = require('../util/session-flash');

async function getProfile(req, res, next) {  

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

    let clnt;
    try {
        clnt = await Client.findById(req.session.userid);

        res.render('client/profile', {inputData: sessionData, clnt: clnt});
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

async function getUpdateClient(req, res, next) {
    let client;
    try {
        // extracting the value we entered in the URL in the admin router
        client = await Client.findById(req.params.id);
        // const movie = await Movie.findById(req.params.id);
        res.render('admin/movies/update-movie', { movie: movie });
    } catch (error) {
        console.log(error);
        next(error);
        return;
    }
}

module.exports = {
    getProfile: getProfile,
}