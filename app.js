// package for use paths
const path = require('path');


const express = require('express');
// package for protect our project from csrf acttacks
const csrf = require('csurf');
// package for use sessions
const expressSession = require('express-session');


// IMPORTS OF ANOTHER FILES
// config for the session
const createSessionConfig = require('./config/session');
const db = require('./data/database');
// we require our own middleware of the protection
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const notFoundMiddleware = require('./middlewares/not-found');
const userRoutes = require('./routes/user.routes');
const clientRoutes = require('./routes/client.routes');
const employeeRoutes = require('./routes/employee.routes');
const adminRoutes = require('./routes/admin.routes');
const testsRoutes = require('./routes/tests.routes');


// CREATING OUR EXPRESS SERVER
const app = express();


// EXPRESS VARIOUS CONFIGURATIONS
// setting some options to the express server; in this case we wanna use ejs
app.set('view engine', 'ejs');
// telling express where are we views; using the path package
app.set('views', path.join(__dirname, 'views'));
// we make usable the public folder files
app.use(express.static('public'));
// we make usable the public data folder (so we can show images in the frontend site); and we filter where we wanna show them
app.use('/data/assets', express.static('public-data'));
// for can extract the data of form submissions (ex. the forms with the post method)
app.use(express.urlencoded({ extended: false }));
// for can extract data in json format from submission 
app.use(express.json());


// SESSION MIDDLEWARE
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));


// CSRF PROTECTION (TOKEN)
// configuring the protection middleware (verificating every get request the token)
// app.use(csrf());
// distribute the csrf token to all our views; own middleware
// app.use(addCsrfTokenMiddleware);

app.use(cartMiddleware);

// check the user status
app.use(checkAuthStatusMiddleware);


// MERGING ROTES
app.use(protectRoutesMiddleware);
// we merge the routes of the authentication to our app; we protect our routes (of users not authorized or not authenticated)
app.use(userRoutes);
app.use('/client', protectRoutesMiddleware, clientRoutes);
// we filter the path
app.use('/admin', protectRoutesMiddleware, adminRoutes);
app.use('/employee', protectRoutesMiddleware, employeeRoutes);
app.use('/tests', testsRoutes);


app.use(notFoundMiddleware);


// activaring the error haddle middleware
app.use(errorHandlerMiddleware);


// DATABASE CONNECTION AND SERVER START
// we try to connect the database and then, we start the server
db.connectToDatabase()
    .then(function () {
        // start the server just if the connection to the database is succesfull
        app.listen(3000);
    }).catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });