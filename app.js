const path = require('path');

const express = require('express');

// imports of another files
const db = require('./data/database');
const baseRoutes = require('./routes/base.routes');
const authRoutes = require('./routes/auth.routes');


const app = express();

// setting some options to the express server; in this case we wanna use ejs
app.set('view engine', 'ejs');
// telling express where are we views; using the path package
app.set('views', path.join(__dirname, 'views'));

// we usable the public folder files
app.use(express.static('public'));
// for can extract the data of the incoming request (ex. the forms with the post method)
app.use(express.urlencoded({extended: false}));

app.use(baseRoutes);
app.use(authRoutes);

// we try to connect the database and then, we start the server
db.connectToDatabase().then(function () {
    // start the server just if the connection to the database is succesfull
    app.listen(3000);
}).catch(function(error){
    console.log('Failde to connect to the database!');
    console.log(error);
});