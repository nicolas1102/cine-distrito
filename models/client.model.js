// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const User = require('./user.model');

const mongodb = require('mongodb');

class Client extends User {

    constructor(email, password, name, identification, imageName, id) {
        super(email, password, name, identification, imageName, id);
        this.points = 0;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('clients').findOne({
            email: this.email
        });
    }

    // insert or update in the database
    async save() {
        const clntData = {
            email: this.email,
            password: this.password,
            name: this.name,
            identification: this.identification,
            imageName: this.imageName,
            points: this.points,
        }

        //  just if we are providing the id, we know that we wanna update the object. If there's no id, we wanna just insert a new one
        if (this.id) {
            // we convert the id to the mongodb id format
            const clntId = new mongodb.ObjectId(this.id);

            // if the image data is undefined; we dont want to overwrite the old image with undefined, so...
            if (!this.imageName) {
                //  we delete the key of the product data, so we dont save a undefined
                delete clntData.imageName;
            }
            
            await db.getDb().collection('clients').updateOne({_id: clntId},{$set: clntData});
        } else {

            // encrypt the password
            const hashedPassword = await bcrypt.hash(this.password, 12);

            clntData.password = hashedPassword;

            await db.getDb().collection('clients').insertOne(clntData);
        }
    }

    static async findById(clientId) {
        let littleClientId;
        try {
            // we need to user an object id as the mongodb does
            littleClientId = new mongodb.ObjectId(clientId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const client = await db.getDb().collection('clients').findOne({ _id: littleClientId });
        if (!client) {
            const error = new Error('Could not find the client.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Client(
            client.email,
            client.password,
            client.name,
            client.identification,
            client.imageName,
            client._id,
        );
    }

    async replaceImage(newImage) {
        this.imageName = newImage;
        this.updateImageData();
    }

    updatePersonalInfo(email, name, identification){
        this.email = email;
        this.name = name;
        this.identification = identification;
    }

    async updatePassword(password){
        const hashedPassword = await bcrypt.hash(password, 12);
        this.password = hashedPassword;
    }

    async remove(){
        const cltnId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('clients').deleteOne({ _id: cltnId });
    }
}

module.exports = Client;