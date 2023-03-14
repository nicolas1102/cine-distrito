// for encrypt the password
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');

class Movie {

    constructor(movieData) {
        this.title = movieData.title;
        this.description = movieData.description;
        this.duration = +movieData.duration;
        this.genre = movieData.genre;
        // the name of the image file
        this.imageName = movieData.imageName;
        this.updateImageData();

        // control de imagen por default (en fase de prueba)
        // if (this.imageName === '') {
        //     this.imageName = 'default/movie-default.jpg';
        //     this.imagePath = `public-data/images/${this.imageName}`;
        //     this.imageUrl = `/data/assets/images/${this.imageName}`;
        // } else {
        //     this.imagePath = `public-data/images/${movieData.imageName}`;
        //     this.imageUrl = `/data/assets/images/${movieData.imageName}`;
        // }

        if (movieData._id) {
            this.id = movieData._id.toString();
        }
    }

    static async findById(movieId) {
        let movId;
        try {
            // we need to user an object id as the mongodb does
            movId = new mongodb.ObjectId(movieId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const movie = await db.getDb().collection('movies').findOne({ _id: movId });
        if (!movie) {
            const error = new Error('Couldnot find the movie with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Movie(movie);
    }

    static async findAll() {
        const movies = await db.getDb().collection('movies').find().toArray();

        // transform all the products in the data base as a product instance of the Product class
        return movies.map(function (movieDocument) {
            return new Movie(movieDocument);
        });
    }

    updateImageData() {
        this.imagePath = `public-data/images/${this.imageName}`;
        this.imageUrl = `/data/assets/images/${this.imageName}`;
    }

    async save() {
        const movieData = {
            title: this.title,
            description: this.description,
            duration: this.duration,
            genre: this.genre,
            imageName: this.imageName,
        }

        //  just if we are providing the product id, we know that we wanna update the product. If there's no id, we wanna just insert a new one
        if (this.id) {
            const movieId = new mongodb.ObjectId(this.id);

            // if the image data is undefined; we dont want to overwrite the old image with undefined, so...
            if (!this.imageName) {
                //  we delete the key of the product data, so we dont save a undefined
                delete movieData.imageName;
            }

            await db.getDb().collection('movies').updateOne(
                {
                    _id: movieId
                },
                {
                    $set: movieData
                }
            );
        } else {
            await db.getDb().collection('movies').insertOne(movieData);
        }
    }

    async replaceImage(newImage) {
        this.imageName = newImage;
        this.updateImageData();
    }
}

module.exports = Movie;