var express    = require('express');
const users    = require("./controller/users");
const L10n     = require('./localize/l10n');
const profile  = require('./controller/profile'); 


// app/routes.js
module.exports = function (app, passport) {

    app.get('/users', users.getUsers);

    app.post('/lang', profile.setLang);

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        var retMsg;
        var state = false;
        if (req.isAuthenticated()) {
            retMsg = req.user.local.email
            state = true;
        } else {
            retMsg = "Please <a href=\"/login\" >Login</a>";
            state = false;
        }

        res.render('index.ejs', {
            msg: retMsg,
            login: state
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/out_for_service', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/out_for_service', isLoggedIn, function (req, res) {
        const l10n = new L10n(req.user.local.lang);
        res.render('out_for_service.ejs', {
            user: req.user,
            translate: l10n.action.translate 
        });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}