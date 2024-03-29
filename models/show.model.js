const mongodb = require('mongodb');

const db = require('../data/database');

class Show {

    constructor(showData) {
        this.date = showData.date;
        this.time = showData.time;
        this.movie = showData.movie;
        this.theater = showData.theater;
        this.screen = showData.screen;
        if (showData._id) {
            this.id = showData._id.toString();
        }
    }

    static async findById(showId) {
        // we need to user an object id as the mongodb does
        const shwId = new mongodb.ObjectId(showId);
        const show = await db.getDb().collection('shows').findOne({ _id: shwId });
        if (!show) {
            const error = new Error('Could not find the show with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Show(show);
    }

    static async findAll() {
        const shows = await db.getDb().collection('shows').find().toArray();
        return shows.map(function (showDocument) {
            return new Show(showDocument);
        });
    }

    static async findAllByMovie(movieId) {
        const mvId = new mongodb.ObjectId(movieId);
        const shows = await db.getDb().collection('shows').find({ 'movie._id': mvId }).toArray();
        return shows.map(function (showDocument) {
            return new Show(showDocument);
        });
    }

    static async findByMovieAndDate(movieId, date) {
        const mvId = new mongodb.ObjectId(movieId);
        const shows = await db.getDb().collection('shows').find({ 'movie._id': mvId, date: date }).sort({ _id: -1 }).toArray();
        if (!shows) {
            const error = new Error('Could not find the show with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }

        return shows.map(function (showDocument) {
            return new Show(showDocument);
        });
    }

    static async findByMovieAndDateAndTheater(movieId, theaterId, date) {
        const mvId = new mongodb.ObjectId(movieId);
        const thtrId = new mongodb.ObjectId(theaterId);

        const shows = await db.getDb().collection('shows').find({ 'movie._id': mvId, 'theater._id': thtrId, date: date }).sort({ time: 1 }).toArray();
        if (!shows) {
            const error = new Error('Could not find the show with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }

        return shows.map(function (showDocument) {
            return new Show(showDocument);
        });
    }

    async save() {
        const showData = {
            date: this.date,
            time: this.time,
            movie: this.movie,
            theater: this.theater,
            screen: this.screen,
        }
        if (this.id) {
            const showId = new mongodb.ObjectId(this.id);
            await db.getDb().collection('shows').updateOne(
                {
                    _id: showId
                },
                {
                    $set: showData
                }
            );
        } else {
            await db.getDb().collection('shows').insertOne(showData);
        }
    }

    remove() {
        const showId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('shows').deleteOne({ _id: showId });
    }
}

module.exports = Show;