// getting the signup view
function getSignup(req, res) {
    res.render('customer/auth/signup');
}

function getLogin(req, res) {

}



module.exports = {
    //  pointer to the function with the name of 'getSignup'
    getSignup: getSignup,
    getLogin: getLogin,
    
}