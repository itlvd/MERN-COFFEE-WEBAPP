exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'Please log in.');
        res.redirect('/users/login');
    }
}

// exports.isAdmin = function(req, res, next) {
//     if (req.isAuthenticated() && res.locals.user.role == "admin") {
//         next();
//     } else {
//         req.flash('danger', 'Please log in as admin.');
//         res.redirect('/users/login');
//     }
// }

exports.isEmployee = function(req, res, next) {
    console.log(res.locals.user); 
    if (req.isAuthenticated() && (res.locals.user.role == "admin" || res.locals.user.role == "employee")) {
        console.log("check auth ok");
        next();
    } else {
        req.flash('danger', 'Please log in as employee.');
        console.log("ko phai employee");
        res.redirect('/users/login');
    }
}


exports.isAdmin = function(req, res, next) {
    console.log("req.session: " + req.session);
    if (req.isAuthenticated() && req.session.pasport.user.role == "admin") {
        console.log(req.session.passport.user);
        next();
    } else {
        req.flash('danger', 'Please log in as admin.');
        console.log("ban ko co quyen admin");
        res.redirect('/users/login');
    }
}