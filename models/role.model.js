const mongodb = require('mongodb');

const db = require('../data/database');

class Role {

    constructor(role, id) {
        if (id) {
            this.id = id.toString();
        }
        this.role = role;
    }

    static async findById(roleId) {
        const rlId = new mongodb.ObjectId(roleId);
        const role = await db.getDb().collection('roles').findOne({ _id: rlId });
        if (!role) {
            const error = new Error('Could not find the role with provided id.');
            error.code = 404;
            // throwing custom error
            throw error;
        }
        return new Role(role.role, role._id);
    }

    static async findAll() {
        const roles = await db.getDb().collection('roles').find().toArray();
        return roles.map(function (roleDocument) {
            return new Role(roleDocument.role, roleDocument._id);
        });
    }
}

module.exports = Role;