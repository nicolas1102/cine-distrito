const mongodb = require('mongodb');

const db = require('../data/database');
const Product = require('./product.model');

class Ticket extends Product {

    constructor(ticketData) {
        const productData = {
            name: ticketData.product.name,
            type: ticketData.product.type,
            price: ticketData.product.price,
            imageName: ticketData.product.imageName,
            points: ticketData.product.points,
        };
        if (ticketData.product.id) {
            productData._id = new mongodb.ObjectId(ticketData.product.id);
        }
        if (ticketData.product._id) {
            productData._id = new mongodb.ObjectId(ticketData.product._id);
        }
        super(productData);
        if (ticketData._id) {
            this.ticketId = ticketData._id.toString();
        }
        this.rowChair = ticketData.rowChair;
        this.columnChair = ticketData.columnChair;
        this.isPreferencial = ticketData.isPreferencial;
        this.show = ticketData.show;
        this.status = ticketData.status;
    }

    static async findById(ticketId) {
        let ttId;
        ttId = new mongodb.ObjectId(ticketId);
        const ticket = await db.getDb().collection('tickets').findOne({ _id: ttId });
        if (!ticket) {
            const error = new Error('Could not find the ticket with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Ticket(ticket);
    }

    static async findByShow(showId) {
        let shwId;
        shwId = new mongodb.ObjectId(shwId);
        const tickets = await db.getDb().collection('tickets').find({ 'show._id': shwId }).sort({ _id: -1 }).toArray();
        if (!tickets) {
            const error = new Error('Could not find any ticket from the provided show.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return tickets.map(function (ticketDocument) {
            return new Ticket(ticketDocument);
        });
    }

    static async findAll() {
        const tickets = await db.getDb().collection('tickets').find().toArray();

        // transform all the objects in the data base as a instance of the class
        return tickets.map(function (ticketDocument) {
            return new Ticket(ticketDocument);
        });
    }

    async save() {
        const productId = new mongodb.ObjectId(this.id);
        const ticketData = {
            product: {
                name: this.name,
                type: this.type,
                price: this.price,
                imageName: this.imageName,
                points: this.points,
                _id: productId,
            },
            rowChair: this.rowChair,
            columnChair: this.columnChair,
            isPreferencial: this.isPreferencial,
            show: this.show,
            status: this.status,
        }

        //  just if we are providing the product id, we know that we wanna update the product. If there's no id, we wanna just insert a new one
        if (this.ticketId) {
            const ticketId = new mongodb.ObjectId(this.ticketId);

            await db.getDb().collection('tickets').updateOne(
                {
                    _id: ticketId
                },
                {
                    $set: ticketData
                }
            );
        } else {
            await db.getDb().collection('tickets').insertOne(ticketData);
        }
    }

    remove() {
        const ttId = new mongodb.ObjectId(this.ticketId);
        return db.getDb().collection('tickets').deleteOne({ _id: ttId });
    }
}

module.exports = Ticket;