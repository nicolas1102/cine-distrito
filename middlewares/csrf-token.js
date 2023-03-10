function addCsrfToken (req, res, next){
    // sending our token to the locals values; this method generates a valid token
    // we are saving the toke to all our views
    res.locals.csrfToken = req.csrfToken();

    // we allow the js to read the next middleware
    next();
}

module.exports = addCsrfToken;