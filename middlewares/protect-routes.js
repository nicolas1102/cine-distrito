function protectRoutes (req, res, next) {

    // verificamos si se está intentando ingresar a una pagina de administrador, y si se está intentando ingresar no siendo un administrador
    if (req.path.startsWith('/admin') && res.locals.role !== 'admin'){
        // deny access to a non-admin user
        return res.redirect('/403');
    }

    // the admin cannot buy things
    if (req.path.startsWith('/home') && res.locals.role === 'admin'){
        return res.redirect('/admin/');
    }
    // we allow to continue to the next middleware
    next();
}

module.exports = protectRoutes;