// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const User = require('./user.model');

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

}

module.exports = Client;