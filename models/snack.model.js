const mongodb = require('mongodb');

const db = require('../data/database');
const Product = require('./product.model');

class Snack extends Product {

    constructor () {
        super();
    }



    
}

module.exports = Snack;