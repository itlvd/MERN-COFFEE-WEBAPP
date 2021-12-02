const express = require('express');
const path = require('path');
require('dotenv').config();
const config = require('./config/database');
const mongoose = require('mongoose');

const bodyParser = require('body-parser'); // video 8
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const initializePassport = require('./config/passport')
initializePassport(passport);


// require routes:

// const pageRoutes = require('./routes/pageRoutes');
const adminPageRoutes = require('./routes/adminPageRoutes');
const adminCategoryRoutes = require('./routes/adminCategoryRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminEmployeeRoutes = require('./routes/adminEmployeeRoutes');
const adminCustomerRoutes = require('./routes/adminCustomerRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminIncomeRoutes = require('./routes/adminIncomRoutes');
const adminNewsPromoRoutes = require('./routes/adminNewsPromoRoutes');


const products = require('./routes/productRoutes.js');
const cart = require('./routes/cartRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const profile = require('./routes/meRoutes');
const searchRoutes = require('./routes/searchRoutes');
const bill = require('./routes/billRoutes');
const newsPromoRoutes = require('./routes/newsPromoRoutes');


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
// app.use(fileUpload());





// body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));







// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// Passport Config
// require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.get("*", function (req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
})

//----------------------------------------------------------------



// set page routes:
app.use('/admin/pages', adminPageRoutes);
app.use('/admin/categories', adminCategoryRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/admin/employee', adminEmployeeRoutes);
app.use('/admin/customer', adminCustomerRoutes);
app.use('/admin/orders', adminOrderRoutes);
app.use('/admin/income', adminIncomeRoutes);
app.use('/admin/promotions', adminNewsPromoRoutes);
// app.use('/', pageRoutes);

// routes for customer
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', userRoutes);
app.use('/promotions', newsPromoRoutes);

// routes for profile
app.use('/me', profile);
app.use('/bills', bill);
app.use('/search', searchRoutes);

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home"
    });
});
app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Us"
    });
});

app.get('/test', (req, res) => {
    res.render('admin/homepage', {
        title: "Test"
    });
});



// function checkAuthenticated(req, res, next) {
//     console.log("inside checkAuthenticate");
//     console.log(req.isAuthenticated());
//     if (req.isAuthenticated()) {
//       return next()
//     }

//     res.redirect('/users/login')
// }