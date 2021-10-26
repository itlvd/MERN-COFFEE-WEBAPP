const express = require('express');
const path = require('path');
const config = require('./config/database');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');  // video 8
const session = require('express-session');

// require routes:
// const pageRoutes = require('./routes/pageRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const expressValidator = require('express-validator');



// connect to mongodb
const dbURI = config.database;

//connect to mongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})
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
app.use(express.urlencoded({extended: true}));



//---------------------------------------------------
// body-parser middleware
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

 
// // Express Session Middleware
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {secure: true}
// }));

// Express Validator Middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root = namespace.shift()
//         , formParam = root;

//         while(namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     }
// }));













//----------------------------------------------------------------

// set page routes:
// app.use('/admin', adminRoutes);
// app.use('/', pageRoutes);