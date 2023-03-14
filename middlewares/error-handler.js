// this function will be called whenever we have an error in one of the other middlewares or route functions
function handleErrors (error, req, res, next ) {
    console.log(error);

    // if the id item in the url does not exits
    if(error.code === 404){
        return res.status(404).render('shared/errors/404');
    }

    // we warn that there's a server side error
    res.status(500).render('shared/errors/500');
}

module.exports = handleErrors;