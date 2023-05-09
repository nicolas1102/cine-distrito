const mongodb = require('mongodb');

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


async function getAllMovies(req, res) {
    let movies;
    try {
        movies = await Movie.findAll();
        res.json({
            message: 'successfully',
            movies: movies,
        });
    } catch (error) {
        res.json({
            message: 'failed',
            movies: null,
        });
        next(error);
        return;
    }
}

async function testSignup(req, res, next) {
    if (
        !validation.clientDetailsAreValid(
            req.body.email,
            req.body.password,
            req.body.name,
            req.body.identification,
            'not-empy',
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
        res.json({
            title: 'Invalid Credentials',
        });
        return;
    }
    const client = new Client(
        req.body.email,
        req.body.password,
        req.body.name,
        req.body.identification,
        'not-empy',
        0,
    );
    let existsAlready;
    try {
        existsAlready = await client.existAlready();
        if (existsAlready) {
            res.json({
                title: 'User exist already',
            });
            return;
        }
        res.json({
            title: 'Signup Accepted',
        });
        return;
    } catch (error) {
        next(error);
        return;
    }
}

async function testLogin(req, res, next) {
    let user = new Client(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
        if (!existingUser) {
            user = new Employee(req.body.email, req.body.password);
            existingUser = await user.getUserWithSameEmail();
        }
    } catch (error) {
        next(error);
        return;
    }

    // if there's no user registrated
    if (!existingUser) {
        res.json({
            title: 'User don\'t exist',
        });
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    // if the password is not correct
    if (!passwordIsCorrect) {
        res.json({
            title: 'Invalid credentials',
        });
        return;
    }

    // successfull login
    res.json({
        title: 'Login Accepted',
    });
}


module.exports = {
    getAllMovies: getAllMovies,
    testSignup: testSignup,
    testLogin: testLogin,
}