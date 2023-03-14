function protectRoutes (req, res, next) {
    if (!res.locals.isAuth){
        // deny access to a non-logged in user
        return res.redirect('/401');
    }

    // verificamos si se está intentando ingresar a una pagina de administrador, y si se está intentando ingresar no siendo un administrador
    if (req.path.startsWith('/admin') && res.locals.role !== 'admin'){
        // deny access to a non-admin user
        return res.redirect('/403');
    }

    // we allow to continue to the next middleware
    next();
}

module.exports = protectRoutes;