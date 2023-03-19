const mongodb = require('mongodb');

const db = require('../data/database');

class Product {

    constructor (productData) {
        this.name = productData.name;
        this.price = productData.price;
        this.type = productData.type;
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
    
    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();

        // transform all the products in the data base as a product instance of the Product class
        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

}

module.exports = Product;