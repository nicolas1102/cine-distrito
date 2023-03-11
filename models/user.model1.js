// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class User {
    // REMEMBER THE IMAGEPATH
    // constructor(name, identification,  email, password, imagePath){
    constructor(email, password, name, identification) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.identification = identification;
        // this.imagePath = imagePath;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({
            email: this.email
        });
    }

    // we check if the user with the user is trying to sign up is created already
    async existAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }


    // insert in the database
    async signup() {
        // encrypt the password
        const hashedPassword = await bcrypt.hash('losmagnificos', 12);

        await db.getDb().collection('users').insertOne({
            name: this.name,
            identification: this.identification,
            email: this.email,
            password: hashedPassword,
            // imagePath: this.imagePath,
        });
        
        // TO INSERT AN ADMIN
        // await db.getDb().collection('employees').insertOne({
        //     name: 'LOS MAGNIFICOS',
        //     identification: '0000000000',
        //     email: 'losmagnificos@cinedistrito.com',
        //     password: hashedPassword,
        //     imagePath: '',
        //     role: 'admin',
        //     phoneNumber: '',
        //     contractStartDate: '',
        //     salary: '',
        //     multiplex: ''
        // });
    }

    hasMatchingPassword(hashedPassword) {
        // comparing the passwords of current user and the found user  
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;