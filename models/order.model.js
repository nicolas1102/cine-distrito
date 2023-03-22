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