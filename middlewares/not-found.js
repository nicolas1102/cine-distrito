function notFoundHandler(req, res) {
    res.render('shared/errors/404');
}

module.exports = notFoundHandler;