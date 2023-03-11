// we want to save temporally the data that the user has wrote in the forms, so, if an fail, the form wont reset

// we recover the data saved and we delete from the session 
function getSessionData(req) {
    const sessionData = req.session.flashedData;
    // clear data
    req.session.flashedData = null;

    return sessionData;
}


// save the session data
function flashDataToSession(req, data, action) {
    // creating a new variable in the session
    req.session.flashedData = data;
    // execute the function after saving is succeded
    req.session.save(action);
}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession,
}