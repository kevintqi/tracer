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
        if (req.isAuthenticated() && action != access.actionAdminPage && action != access.actionAppPage &&
            action != access.actionClientPage)
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

    // =========================================
    // APIs 
    // =========================================

    const companyDispatcher = require('./controller/company_dispatcher');
    const jobDispatcher = require('./controller/job_dispatcher');

    /**
     * @swagger
     * /companies:
     *   get:
     *     description: Retrieves all the companies 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/companies', companyDispatcher.getCompanies);

    /**
     * @swagger
     * /company?customer_id=123:
     *   get:
     *     description: Retrieves a company based on a customer id. 
      *    query variable: customer_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/company', isLoggedIn, companyDispatcher.getCompany);

    /**
     * @swagger
     * /company/<company_id>:
     *   get:
     *     description: Retrieves a company based on a company id. 
     *     param variable: company_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/company/:company_id', companyDispatcher.getCompanyById);

    /**
     * @swagger
     * /company:
     *   post:
     *     description: Creates a company 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.post('/api/company', companyDispatcher.createCompany);

    /**
     * @swagger
     * /company?company_id=123:
     *   put:
     *     description: Updates a company based on id. 
      *    query variable: company_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.put('/api/company', companyDispatcher.updateCompany);

    /**
     * @swagger
     * /job?company_id=123:
     *   get:
     *     description: Retrieves a job based on a company id. 
      *    query variable: company_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/jobs', isLoggedIn,  jobDispatcher.getJobs);
    //app.get('/api/jobs', jobDispatcher.getJobs);

    app.get('/api/job/:job_id', jobDispatcher.getJob);

    app.post('/api/job', jobDispatcher.create);

    /**
     * @swagger
     * /job/<job_id>/update:
     *   get:
     *     description: Updates a job based on id. 
     *     param variable: job_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       400:
     *         description: Bad request 
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.patch('/api/job/:job_id/update', jobDispatcher.updateJob);


    //https://stackoverflow.com/questions/20089582/how-to-get-url-parameter-in-express-node-js
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    if (req.originalUrl.startsWith('/api/')) {
        return res.send(401, 'Unauthorized');
    }

    // if they aren't redirect them to the home page
    res.redirect('/login');
}