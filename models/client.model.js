// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const User = require('./user.model');

const mongodb = require('mongodb');

class Client extends User {

    constructor (email, password, name, identification, imageName, id) {
        super(email, password, name, identification, imageName, id);
        this.points = 0;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('clients').findOne({
            email: this.email
        });
    }

    // insert in the database
    async signup() {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('clients').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            identification: this.identification,
            imageName: this.imageName,
            points: this.points,
        });
    }

    static async findById(clientId) {
        let littleClientId;
        try {
            // we need to user an object id as the mongodb does
            littleClientId = new mongodb.ObjectId(clientId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const client = await db.getDb().collection('clients').findOne({ _id: littleClientId });
        if (!client) {
            const error = new Error('Could not find the client.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Client(
            client.email,
            client.password,
            client.name,
            client.identification,
            client.imageName,
            client._id,
        );
    }

}

module.exports = Client;