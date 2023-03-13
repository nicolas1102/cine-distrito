function getAdminMenu(req, res) {
    res.render('admin/admin-menu');
}

function getClients(req, res) {
    res.render('admin/clients/all-clients');
}

function getNewClient(req, res) {
    res.render('admin/clients/new-client');
}

function getEmployees(req, res) {
    res.render('admin/employees/all-employees');
}

function getNewEmployee(req, res) {
    res.render('admin/employees/new-employee');
}

function getProducts(req, res) {
    res.render('admin/products/all-products');
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

function createNewProduct() {

}

function getSnacks(req, res) {
    res.render('admin/snacks/all-snacks');
}

function getNewSnack(req, res) {
    res.render('admin/snacks/new-snack');
}

function getMovies(req, res) {
    res.render('admin/movies/all-movies');
}

function getNewMovie(req, res) {
    res.render('admin/movies/new-movie');
}

function createNewMovie() {

}

function getTickets(req, res) {
    res.render('admin/tickets/all-tickets');
}

function getNewTicket(req, res) {
    res.render('admin/tickets/new-ticket');
}

function getPlays(req, res) {
    res.render('admin/plays/all-plays');
}

function getNewPlay(req, res) {
    res.render('admin/plays/new-play');
}

function getMultiplexes(req, res) {
    res.render('admin/multiplexes/all-multiplexes');
}

function getNewMultiplex(req, res) {
    res.render('admin/multiplexes/new-multiplex');
}


module.exports = {
    getAdminMenu: getAdminMenu,
    getClients: getClients,
    getNewClient: getNewClient,
    getEmployees: getEmployees,
    getNewEmployee: getNewEmployee,
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getSnacks: getSnacks,
    getNewSnack: getNewSnack,
    getMovies: getMovies,
    getNewMovie: getNewMovie,
    createNewMovie: createNewMovie,
    getTickets: getTickets,
    getNewTicket: getNewTicket,
    getPlays: getPlays,
    getNewPlay: getNewPlay,
    getMultiplexes: getMultiplexes,
    getNewMultiplex: getNewMultiplex,
}



