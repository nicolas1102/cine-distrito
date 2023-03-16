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
        this.updateImageData();

        // si lo que se está haciendo no es crear un nuevo usuario para la base de datos, sino solo para usarlo en codigo; transformamos el objectid que obtenemos de la base de datos a string
        if (id) {
            this.id = id.toString();
        }

    }

    updateImageData() {
        this.imagePath = `public-data/images/${this.imageName}`;
        this.imageUrl = `/data/assets/images/${this.imageName}`;
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