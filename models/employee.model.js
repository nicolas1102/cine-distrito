// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const User = require('./user.model');

class Employee extends User {

    constructor(email, password, name, identification, imageName, role, phoneNumber, contractStartDate, salary, multiplex, id) {
        super(email, password, name, identification, imageName, id);
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.contractStartDate = contractStartDate;
        this.salary = salary;
        this.multiplex = multiplex;
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
            email: this.email,
            password: hashedPassword,
            name: this.name,
            identification: this.identification,
            imageName: this.imageName,
            role: this.role,
            phoneNumber: this.phoneNumber,
            contractStartDate: this.contractStartDate,
            salary: this.salary,
            multiplex: this.multiplex,
        });

    }
}

module.exports = Employee;