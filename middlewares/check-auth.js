function checkAuthStatus(req, res, next) {
    //  looking for the variable we configured in the autentication file saving the id of the user
    const userid = req.session.userid;
    const name = req.session.name;
    const imageUrl = req.session.imageUrl;

    //  if there's no userid saved, it means the user is no logged in
    if (!userid) {
        return next();
    }

    // saving the data 
    res.locals.userid = userid;
    res.locals.name = name;
    res.locals.imageUrl = imageUrl;
    res.locals.isAuth = true;


    // control of the sistem roles; this could be true or undifined
    res.locals.role = req.session.role;

    next();
}

module.exports = checkAuthStatus;