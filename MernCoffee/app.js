const express = require('express');
const path = require('path');
const config = require('./config/database');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');  // video 8
const session = require('express-session');
var { check, validationResult } = require('express-validator');





// require routes:

// const pageRoutes = require('./routes/pageRoutes');
const adminPageRoutes = require('./routes/adminPageRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');


// connect to mongodb
const dbURI = config.database;

//connect to mongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// init app
const app = express();

// listen for request
app.listen(3000, () => {
    console.log("Server start on port 3000");
});

// setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// setup public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));




//---------------------------------------------------
// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));







// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



//----------------------------------------------------------------



// set page routes:
app.use('/admin/pages', adminPageRoutes);
app.use('/admin/categories', adminCategoryRoutes);
// app.use('/', pageRoutes);

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home"
    });
});


