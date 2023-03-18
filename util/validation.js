function isEmpty(value) {
    return !value || value.trim() === '';
}

function emailAreValid(email){
    return email &&
        email.includes('@');
}

function passwordAreValid(password) {
    return password &&
        password.trim().length >= 6;
}

function clientDetailsAreValid(email, password, name, identification, imageName) {
    // trim eleminates the blanks of a string
    return (
        emailAreValid(email) &&
        passwordAreValid(password) &&
        !isEmpty(name) &&
        !isEmpty(identification) &&
        identification.trim().length === 10 &&
        !isEmpty(imageName)
    );
}

function clientPersonalInfoAreValid(email, name, identification) {
    return (
        emailAreValid(email) &&
        !isEmpty(name) &&
        !isEmpty(identification) &&
        identification.trim().length === 10
    );
}

function emailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

function passwordIsConfirmed (password, confirmPassword){
    return password === confirmPassword;
}

function validateAccountDeletingConfirmation(confirmation){
    return confirmation === 'i want to delete my account';
}

module.exports = {
    clientDetailsAreValid: clientDetailsAreValid,
    clientPersonalInfoAreValid: clientPersonalInfoAreValid,
    emailIsConfirmed: emailIsConfirmed,
    passwordIsConfirmed: passwordIsConfirmed,
    validateAccountDeletingConfirmation: validateAccountDeletingConfirmation,
    
};