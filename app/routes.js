var express = require('express');

const access = require('../config/access');
const L10n = require('./localize/l10n');
const profile = require('./controller/profile');
const ConnectRoles = require('connect-roles');



// app/routes.js
module.exports = function (app, passport) {

    //===============CONNECTION RULES=================
    var user = new ConnectRoles({
        failureHandler: function (req, res, action) {
            // optional function to customise code that runs when
            // user fails authorisation
            var accept = req.headers.accept || '';
            res.status(403);
            if (~accept.indexOf('html')) {
                // TODO: lechDev need to implement this page
                res.render('access-denied.ejs', {
                    action: action
                });
            } else {
                res.send('Access Denied - You don\'t have permission to: ' + action);
            }
        }
    });
    app.use(user.middleware());

    //users logged can access to public pages
    user.use(function (req, action) {
        if (req.isAuthenticated() && action != access.actionAdminPage && action != access.actionAppPage 
            && action != access.actionClientPage)
            return true;
    });

    //moderator users can access private page, but
    //they might not be the only ones so we don't return
    //false if the user isn't a moderator
    user.use(access.actionAppPage, function (req) {
        console.log(access.actionAppPage);
        if (req.user.local.role === access.table.manager.role) {
            return true;
        }
    });

    user.use(access.actionClientPage, function (req) {
        console.log(access.actionClientPage);
        if (req.user.local.role === access.table.employee.role) {
            return true;
        }
    });

    user.use(access.actionAdminPage, function (req) {
        console.log(access.actionAdminPage);
        if (req.user.local.role === access.table.admin.role) {
            return true;
        }
    });

    //  admin can access all pages
    user.use(function (req) {
        if (req.user.local.role === access.table.admin.role) {
            return true;
        }
    });


    //=============== Set language =================
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

    app.get('/out_for_service', isLoggedIn, user.can(access.actionAppPage), function (req, res) {
        const l10n = new L10n(req.user.local.lang);
        res.render(req.user.local.group, {
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