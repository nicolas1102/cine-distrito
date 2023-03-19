const mongodb = require('mongodb');

const db = require('../data/database');

class Product {

    constructor (productData) {
        this.name = productData.name;
        this.price = productData.price;
        this.imageName = productData.imageName;
        this.points = productData.points;
        this.updateImageData();
        // si lo que se está haciendo no es crear un nuevo objeto para la base de datos, sino solo es para usarlo en codigo; transformamos el objectid que obtenemos de la base de datos a string
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    updateImageData() {
        this.imagePath = `public-data/images/${this.imageName}`;
        this.imageUrl = `/data/assets/images/${this.imageName}`;
    }

    static async findById(productId) {
        let prdctId;
        try {
            // we need to user an object id as the mongodb does
            prdctId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const product = await db.getDb().collection('products').findOne({ _id: prdctId });
        if (!product) {
            const error = new Error('Could not find the product with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Product(product);
    }
    
    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        // transform all the products in the data base as a product instance of the Product class
        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    async save() {
        const productData = {
            name: this.name,
            price: this.price,
            imageName: this.imageName,
            points: this.points,
        }

        //  just if we are providing the product id, we know that we wanna update the product. If there's no id, we wanna just insert a new one
        if (this.id) {
            const productId = new mongodb.ObjectId(this.id);

            // if the image data is undefined; we dont want to overwrite the old image with undefined, so...
            if (!this.imageName) {
                //  we delete the key of the product data, so we dont save a undefined
                delete productData.imageName;
            }

            await db.getDb().collection('products').updateOne(
                {
                    _id: productId
                },
                {
                    $set: productData
                }
            );
        } else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    async replaceImage(newImage) {
        this.imageName = newImage;
        this.updateImageData();
    }

    remove() {
        const productId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('products').deleteOne({ _id: productId });
    }

}

module.exports = Product;