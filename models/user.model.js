// for encrypt the password
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
const Movie = require('./movie.model');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class User {
    // REMEMBER THE IMAGEPATH
    constructor(email, password, name, identification, role, imageName, id) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.identification = identification;
        this.role = role;
        this.imageName = imageName;
        // control de imagen por default (en fase de prueba)
        if (this.imageName === '') {
            this.imageName = 'default/user-default.jpg';
            this.imagePath = `public-data/images/default/${this.imageName}`;
        }else {
            this.imagePath = `public-data/images/${this.imageName}`;
        }
        // this.imageUrl = `/users/assets/images/${imageName}`;
        this.imageUrl = `/data/assets/users/images/${this.imageName}`;

        if(id){
            // this.id = id.toString();
            this.id = id;
        }
        
    }

    // we check if the user with the user is trying to sign up is created already
    async existAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    hasMatchingPassword(hashedPassword) {
        // comparing the passwords of current user and the found user  
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;