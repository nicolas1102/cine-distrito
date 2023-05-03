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
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        confirmPassword: req.body['confirm-password'],
        name: req.body.name,
        identification: req.body.identification,
        imageName: 'not-empy',
    }
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
    );
    try {
        const existsAlready = await client.existAlready();
        if (existsAlready) {
            res.json({
                title: 'User exist already',
            });
            return;
        }
        // await client.save();
        res.json({
            title: 'Signup Accepted',
        });
        return;
    } catch (error) {
        next(error);
        return;
    }
}


module.exports = {
    getAllMovies: getAllMovies,
    testSignup: testSignup,
}