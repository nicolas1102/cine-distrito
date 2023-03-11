function isEmpty(value) {
    return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password) {
    return email &&
        email.includes('@') &&
        password &&
        password.trim().length >= 6;
}

function userDetailsAreValid(email, password, name, identification) {
    // trim eleminates the blanks of a string
    return (
        userCredentialsAreValid(email, password) &&
        !isEmpty(name) &&
        !isEmpty(identification)
    );
}

function emailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

function passwordIsConfirmed (password, confirmPassword){
    return password === confirmPassword;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    emailIsConfirmed: emailIsConfirmed,
    passwordIsConfirmed: passwordIsConfirmed,
};