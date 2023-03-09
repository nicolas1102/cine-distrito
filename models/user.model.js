// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class User {
    constructor(email, password, name, street, postal, city){
        this.email = email;
        this.password = password;
        this.name = name;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        };
    }

    // insert in the database
    async signup(){
        // encrypt the password
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address,
        });
    }
}

module.exports = User;