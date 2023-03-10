// this function will be called whenever we have an error in one of the other middlewares or route functions
function handleErrors (error, req, res, next ) {
    console.log(error);
    // we warn that there's a server side error
    res.status(500).render('shared/errors/500');
}

module.exports = handleErrors;