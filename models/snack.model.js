const mongodb = require('mongodb');

const db = require('../data/database');
const Product = require('./product.model');

class Snack extends Product {

    constructor(snackData) {
        const productData = {
            name: snackData.product.name,
            type: snackData.product.type,
            price: snackData.product.price,
            imageName: snackData.product.imageName,
            points: snackData.product.points,
        };
        if (snackData.product.id) {
            productData._id = new mongodb.ObjectId(snackData.product.id);
        }
        if (snackData.product._id) {
            productData._id = new mongodb.ObjectId(snackData.product._id);
        }
        super(productData);
        if (snackData._id) {
            this.snackId = snackData._id.toString();
        }
        this.amount = snackData.amount;
    }

    static async findById(snackId) {
        let skId;
        skId = new mongodb.ObjectId(snackId);
        const snack = await db.getDb().collection('snacks').findOne({ _id: skId });
        if (!snack) {
            const error = new Error('Could not find the snack with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Snack(snack);
    }

    static async findAll() {
        const snacks = await db.getDb().collection('snacks').find().toArray();

        // transform all the objects in the data base as a instance of the class
        return snacks.map(function (snackDocument) {
            return new Snack(snackDocument);
        });
    }

    async save() {
        const productId = new mongodb.ObjectId(this.id);
        const snackData = {
            product: {
                name: this.name,
                type: this.type,
                price: this.price,
                imageName: this.imageName,
                points: this.points,
                _id: productId,
            },
            amount: this.amount,
        }

        //  just if we are providing the product id, we know that we wanna update the product. If there's no id, we wanna just insert a new one
        if (this.snackId) {
            const snackId = new mongodb.ObjectId(this.snackId);

            await db.getDb().collection('snacks').updateOne(
                {
                    _id: snackId
                },
                {
                    $set: snackData
                }
            );
        } else {
            await db.getDb().collection('snacks').insertOne(snackData);
        }
    }

    remove() {
        const snckId = new mongodb.ObjectId(this.snackId);
        return db.getDb().collection('snacks').deleteOne({ _id: snckId });
    }
}

module.exports = Snack;