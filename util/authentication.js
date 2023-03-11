
function createUserSession(req, user, action){
    // the default mongo id is an objectid, so we need to convert to string
    req.session.userid = user._id.toString();

    // once is done, the "action" will be exetured once the session was saved in the store (database)
    req.session.save(action);
}

// to logout
function destroyUserAuthSession(req) {
    req.session.userid = null;
}

module.exports= {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession,

}