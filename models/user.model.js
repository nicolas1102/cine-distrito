// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class User {
    // REMEMBER THE IMAGEPATH
    // constructor(name, identificaction,  email, password, imagePath){
    constructor(name, identificaction, email, password) {
        this.name = name;
        this.identificaction = identificaction;
        this.email = email;
        this.password = password;
        // this.imagePath = imagePath;
    }

    // insert in the database
    async signup() {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            name: this.name,
            identificaction: this.identificaction,
            email: this.email,
            password: hashedPassword,
            // imagePath: this.imagePath;
        });
    }
}

module.exports = User;