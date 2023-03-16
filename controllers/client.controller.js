// to create tell the session the user is logged in
const authUtil = require('../util/authentication');


function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    // after logout, we want to redirect the user to...
    res.redirect('/home');
}

module.exports = {
    logout: logout,
}