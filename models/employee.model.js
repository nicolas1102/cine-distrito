// for encrypt the password
const bcrypt = require('bcryptjs');

// importing the database
const db = require('../data/database');

const User = require('./user.model');

const mongodb = require('mongodb');

class Employee extends User {

    constructor(email, password, name, identification, imageName, position, phoneNumber, contractStartDate, salary, theater, id) {
        super(email, password, name, identification, imageName, id);
        if (position === 'Sudo-101122-Admin') {
            this.role = 'admin';
        } else {
            this.role = 'employee';
        }
        this.position = position;
        this.phoneNumber = phoneNumber;
        this.contractStartDate = contractStartDate;
        this.salary = salary;
        this.theater = theater;
    }

    getUserWithSameEmail() {
        return db.getDb().collection('employees').findOne({
            email: this.email
        });
    }

    async save() {
        const employeeData = {
            email: this.email,
            password: this.password,
            name: this.name,
            identification: this.identification,
            imageName: this.imageName,
            role: this.role,
            position: this.position,
            phoneNumber: this.phoneNumber,
            contractStartDate: this.contractStartDate,
            salary: this.salary,
            theater: this.theater,
        }

        //  just if we are providing the id, we know that we wanna update the object. If there's no id, we wanna just insert a new one
        if (this.id) {
            // we convert the id to the mongodb id format
            const employeeId = new mongodb.ObjectId(this.id);

            // if the image data is undefined; we dont want to overwrite the old image with undefined, so...
            if (!this.imageName) {
                //  we delete the key of the product data, so we dont save a undefined
                delete employeeData.imageName;
            }

            await db.getDb().collection('employees').updateOne({ _id: employeeId }, { $set: employeeData });
        } else {
            // encrypt the password
            const hashedPassword = await bcrypt.hash(this.password, 12);

            employeeData.password = hashedPassword;

            await db.getDb().collection('employees').insertOne(employeeData);
        }
    }

    static async findById(employeeId) {
        let littleEmployeeId;
        try {
            // we need to user an object id as the mongodb does
            littleEmployeeId = new mongodb.ObjectId(employeeId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        const employee = await db.getDb().collection('employees').findOne({ _id: littleEmployeeId });
        if (!employee) {
            const error = new Error('Could not find the employee.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Employee(
            employee.email,
            employee.password,
            employee.name,
            employee.identification,
            employee.imageName,
            employee.position,
            employee.phoneNumber,
            employee.contractStartDate,
            employee.salary,
            employee.theater,
            employee._id,
        );
    }

    static async findAll() {
        const employees = await db.getDb().collection('employees').find().toArray();
        return employees.map(function (employeeDocument) {
            return new Employee(
                employeeDocument.email,
                employeeDocument.password,
                employeeDocument.name,
                employeeDocument.identification,
                employeeDocument.imageName,
                employeeDocument.position,
                employeeDocument.phoneNumber,
                employeeDocument.contractStartDate,
                employeeDocument.salary,
                employeeDocument.theater,
                employeeDocument._id);
        });
    }

    async replaceImage(newImage) {
        this.imageName = newImage;
        this.updateImageData();
    }

    updatePersonalInfo(email, name, identification, phoneNumber) {
        this.email = email;
        this.name = name;
        this.identification = identification;
        this.phoneNumber = phoneNumber;
    }

    updateInfo(email, name, identification, position, phoneNumber, contractStartDate, salary, theater) {
        this.email = email;
        this.name = name;
        this.identification = identification;
        this.position = position;
        this.phoneNumber = phoneNumber;
        this.contractStartDate = contractStartDate;
        this.salary = salary;
        this.theater = theater;
    }

    async updatePassword(password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        this.password = hashedPassword;
    }

    async remove() {
        const employeeId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('employees').deleteOne({ _id: employeeId });
    }
}

module.exports = Employee;