const express = require('express');
const path = require('path');
const config = require('./config/database');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');  // video 8
const session = require('express-session');
var { check, validationResult } = require('express-validator');
var fileUpload = require('express-fileupload');




// require routes:

// const pageRoutes = require('./routes/pageRoutes');
const adminPageRoutes = require('./routes/adminPageRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');

const products = require('./routes/productRoutes.js');
const cart = require('./routes/cartRoutes.js');

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


// Set global errors variable
app.locals.errors = null;


//---------------------------------------------------

// Express fileUpload middleware
app.use(fileUpload());





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
app.use('/admin/products', adminProductRoutes);
// app.use('/', pageRoutes);

// routes for customer
app.use('/products', products);
app.use('/cart', cart);

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home"
    });
});

app.get('/test', (req, res) => {
    res.render('test', {
        title: "Test"
    });
});

