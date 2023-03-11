function checkAuthStatus(req, res, next) {
    //  looking for the variable we configured in the autentication file saving the id of the user
    const userid = req.session.userid;

    //  if there's no userid saved, it means the user is no logged in
    if (!userid) {
        return next();
    }

    // saving the data 
    res.locals.userid = userid;
    res.locals.isAuth = true;

    // this could be true or undifined
    res.locals.role = req.session.role;

    next();
}

module.exports = checkAuthStatus;