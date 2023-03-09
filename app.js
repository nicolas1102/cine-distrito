const path = require('path');

const express = require('express');

const baseRoutes = require('./routes/base.routes');
const authRoutes = require('./routes/auth.routes');


const app = express();

// setting some options to the express server; in this case we wanna use ejs
app.set('view engine', 'ejs');
// telling express where are we views; using the path package
app.set('views', path.join(__dirname, 'views'));

// we usable the public folder files
app.use(express.static('public'));

app.use(baseRoutes);
app.use(authRoutes);

app.listen(3000);