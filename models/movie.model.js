// for encrypt the password
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

class Movie {

    constructor (movieData) {
        this.title = movieData.title;
        this.description = movieData.description;
        this.duration = +movieData.duration;
        this.genre = movieData.genre;
        // the name of the image file
        this.imageName = movieData.imageName;
        // control de imen por default
        if (this.imageName === '') {
            this.imageName = uuid() + '-' + 'movie-default.jpg';
            this.imagePath = `data/images/system/${this.imageName}`;
        }else {
            this.imagePath = `data/images/${movieData.imageName}`;
        }
        this.imageUrl = `/movies/assets/images/${movieData.imageName}`;
    }

    async save () {
        const movieData = {
            title: this.title,
            description: this.description,
            duration: this.duration,
            genre: this.genre,
            imageName: this.imageName,
        }
        await db.getDb().collection('movies').insertOne(movieData);
    }


    
}

module.exports = Movie;