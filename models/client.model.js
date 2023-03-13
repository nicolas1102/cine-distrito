// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

const User = require('./user.model');

class Client extends User {

    constructor (email, password, name, identification, imageName) {
        super(email, password, name, identification, 'client', imageName);
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
            name: this.name,
            identification: this.identification,
            email: this.email,
            password: hashedPassword,
            role: this.role,
            imageName: this.imageName,
            points: this.points,
        });
        
    }
}

module.exports = Client;