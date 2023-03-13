// for encrypt the password
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class User {
    // REMEMBER THE IMAGEPATH
    constructor(email, password, name, identification, role, imageName) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.identification = identification;
        this.role = role;
        this.imageName = imageName;
        if (this.imageName === '') {
            this.imageName = uuid() + '-' + 'user-default.jpg';
            this.imagePath = `data/images/system/${this.imageName}`;
        }else {
            this.imagePath = `data/images/${imageName}`;
        }
        this.imageUrl = `/users/assets/images/${imageName}`;
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