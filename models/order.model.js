const db = require('../data/database');

const mongodb = require('mongodb');

class Order {
    // Status => pending, fulfilled, cancelled
    constructor(cart, client, status = 'pending', date, orderId) {
        this.cart = cart;
        this.client = client;
        this.status = status;
        this.date = new Date(date);
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
        this.id = orderId;
    }

    static async findAll() {
        const orders = await db
            .getDb()
            .collection('orders')
            .find()
            .sort({ _id: -1 })
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findAllForUser(clientId) {
        const orders = await db
            .getDb()
            .collection('orders')
            .find({ 'client.id': clientId })
            .sort({ _id: -1 })
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId) {
        const order = await db
            .getDb()
            .collection('orders')
            .findOne({ _id: new mongodb.ObjectId(orderId) });

        return this.transformOrderDocument(order);
    }

    static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
            orderDoc.cart,
            orderDoc.client,
            orderDoc.status,
            orderDoc.date,
            orderDoc._id
        );
    }

    save () {
        // if we have an id, we are updating
        if(this.id){
            const orderId = new mongodb.ObjectId(this.id);
            return db
                .getDb()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } });
        }else {
            const orderData = {
                client: this.client,
                cart: this.cart,
                // mongodb knows how to work with js date objects
                date: new Date(),
                status: this.status,
            };
            console.log(orderData);
            return  db.getDb().collection('orders').insertOne(orderData);
        }
    }

    remove() {
        const orderId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('orders').deleteOne({ _id: orderId });
    }
}

module.exports = Order;