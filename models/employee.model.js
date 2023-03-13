// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const mongodb = require('mongodb');
// for using the ids of the mongodb database
const ObjectId = mongodb.ObjectId;

const User = require('./user.model');

class Employee extends User {

    constructor (email, password, name, identification, imageName, role, phoneNumber, contractStartDate, salary) {
        super(email, password, name, identification, role, imageName);
        this.phoneNumber = phoneNumber;
        this.contractStartDate = contractStartDate;
        this.salary = salary;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('employees').findOne({
            email: this.email
        });
    }

    // insert in the database
    async signup() {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('employees').insertOne({
            name: this.name,
            identification: this.identification,
            email: this.email,
            password: hashedPassword,
            imagePath: this.imagePath,
            role: this.role,
            phoneNumber: this.phoneNumber,
            contractStartDate: this.contractStartDate,
            salary: this.salary,
        });
        
    }
}

module.exports = Employee;