const mongodb = require('mongodb');

const db = require('../data/database');

class Theater{

    constructor (theaterData) {
        this.name = theaterData.name;
        this.address = theaterData.address;
        this.numScreens =+ theaterData.numScreens;
        if (theaterData.amountRatings) {
            this.rating =+ theaterData.rating;
            this.amountRatings =+ theaterData.amountRatings;
        } else {
            this.rating = 0;
            this.amountRatings = 0;
        }
        // si lo que se está haciendo no es crear un nuevo objeto para la base de datos, sino solo es para usarlo en codigo; transformamos el objectid que obtenemos de la base de datos a string
        if (theaterData._id) {
            this.id = theaterData._id.toString();
        }
    }

    static async findById(theaterId) {
        let thtrId;
        try {
            // we need to user an object id as the mongodb does
            thtrId = new mongodb.ObjectId(theaterId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const theater = await db.getDb().collection('theaters').findOne({ _id: thtrId });
        if (!theater) {
            const error = new Error('Could not find the theater with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Theater(theater);
    }
    
    static async findAll() {
        const theaters = await db.getDb().collection('theaters').find().toArray();

        // transform all the theaters in the data base as a product instance of the Product class
        return theaters.map(function (theaterDocument) {
            return new Theater(theaterDocument);
        });
    }

    async save() {
        const theaterData = {
            name: this.name,
            address: this.address,
            numScreens: this.numScreens,
            rating: this.rating,
            amountRatings: this.amountRatings,
        }

        //  just if we are providing the product id, we know that we wanna update the product. If there's no id, we wanna just insert a new one
        if (this.id) {
            const theaterId = new mongodb.ObjectId(this.id);

            await db.getDb().collection('theaters').updateOne(
                {
                    _id: theaterId
                },
                {
                    $set: theaterData
                }
            );
        } else {
            await db.getDb().collection('theaters').insertOne(theaterData);
        }
    }

    remove() {
        const theaterId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('theaters').deleteOne({ _id: theaterId });
    }
}

module.exports = Theater;