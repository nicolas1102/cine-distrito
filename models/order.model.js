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

    static async findAllForUser(clientId) {
        const orders = await db
            .getDb()
            .collection('orders')
            .find({ 'client.id': clientId })
            .sort({ _id: -1 })
            .toArray();
            console.log(orders);

        return this.transformOrderDocuments(orders);
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

        }else {
            const orderDatat = {
                client: this.client,
                cart: this.cart,
                // mongodb knows how to work with js date objects
                date: new Date(),
                status: this.status,
            };

            return  db.getDb().collection('orders').insertOne(orderDatat);
        }
    }
}

module.exports = Order;