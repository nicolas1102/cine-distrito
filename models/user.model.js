// for encrypt the password
const bcrypt = require('bcryptjs');

class User {
    // REMEMBER THE IMAGEPATH
    constructor(email, password, name, identification, imageName, id) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.identification = identification;
        this.imageName = imageName;
        // control de imagen por default (en fase de prueba)
        if (this.imageName === '') {
            this.imageName = 'default/user-default.jpg';
            this.imagePath = `public-data/images/default/${this.imageName}`;
        } else {
            this.imagePath = `public-data/images/${this.imageName}`;
        }
        // this.imageUrl = `/users/assets/images/${imageName}`;
        this.imageUrl = `/data/assets/users/images/${this.imageName}`;

        // si lo que se está haciendo no es crear un nuevo usuario para la base de datos, sino solo para usarlo en codigo
        if (id) {
            // this.id = id.toString();
            this.id = id;
        }

    }

    // we check if the user with the user is trying to sign up is created already
    async existAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    hasMatchingPassword(hashedPassword) {
        // comparing the passwords of current user and the found user  
        return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;