exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        //req.flash('danger', 'Please log in.');
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
    
    
    if (req.isAuthenticated() && (res.locals.user.role == "admin" || res.locals.user.role == "employee")) {
    //if (req.isAuthenticated()) {    
        // console.log("check auth ok");
        next();
    } else {
        //req.flash('danger', 'Please log in as employee.');
        //console.log("ko phai employee");
        res.redirect('/users/login');
    }
}


exports.isAdmin = function(req, res, next) {

    if (req.isAuthenticated() && res.locals.user.role == "admin") {
        next();
    } else {

        if (req.isAuthenticated() && res.locals.user.role == "employee") {

            res.redirect('/admin/pages?message=You are not admin');
        } else {
            res.redirect('/users/login');
        }
    }
}


exports.hasLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    //req.flash('Warning', 'You are logged in');
    res.redirect('/');      
}