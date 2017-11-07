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
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    });
    app.use(user.middleware());

    //users logged can access to public pages
    user.use(function (req, action) {
        if (req.isAuthenticated() && action != access.actionAdmin && action != access.actionManager &&
            action != access.actionEmployee)
            return true;
    });

    //moderator users can access private page, but
    //they might not be the only ones so we don't return
    //false if the user isn't a moderator
    user.use(access.actionManager, function (req) {
        console.log(access.actionManager);
        if ((req.user.local.role === access.table.manager.role) ||
            (req.user.local.role === access.table.admin.role)) {
            return true;
        }
    });

    user.use(access.actionEmployee, function (req) {
        console.log(access.actionEmployee);
        if ((req.user.local.role === access.table.employee.role) ||
            (req.user.local.role === access.table.admin.role) ||
            (req.user.local.role === access.table.manager.role)) {
            return true;
        }
    });

    user.use(access.actionAdmin, function (req) {
        console.log(access.actionAdmin);
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
    // LOGIN ===============================
    // =====================================
    // process the login form
    app.post('/login', passport.authenticate('local-login', {}), function (req, res) {
        if (req.isAuthenticated()) {
            res.json("{ 'status': 'success' }");
        } else {
            res.status(500).send("Internal Server Error");
        }
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {}), function (req, res) {
        res.json("{ 'status': 'success' }");
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        const status = {
            'msg': 'successful logout'
        };
        res.json(status);
    });

    // =========================================
    // APIs 
    // =========================================

    const companyDispatcher = require('./controller/company_dispatcher');
    const jobDispatcher = require('./controller/job_dispatcher');
    const locationLogDispatcher = require('./controller/locationLog_dispatcher');

    /**
     * @swagger
     * /api/companies:
     *   get:
     *     description: Retrieves all the companies 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/companies', isLoggedIn, companyDispatcher.getCompanies);

    /**
     * @swagger
     * /api/company:
     *   get:
     *     description: Retrieves company information
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/company', isLoggedIn, companyDispatcher.getCompany);

    /**
     * @swagger
     * /api/company/<company_id>:
     *   get:
     *     description: Retrieves a company based on a company id. 
     *     param variable: company_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/company/:company_id', isLoggedIn, companyDispatcher.getCompanyById);

    /**
     * @swagger
     * /api/company:
     *   post:
     *     description: Creates a company 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.post('/api/company', user.can(access.actionEmployee), companyDispatcher.createCompany);

    /**
     * @swagger
     * /api/company
     *   put:
     *     description: Updates the company 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.put('/api/company', companyDispatcher.updateCompany);

    /**
     * @swagger
     * /api/jobs
     *   get:
     *     description: Retrieves all the jobs associated with the company 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/jobs', isLoggedIn, jobDispatcher.getJobs);

    app.get('/api/job/:job_id', jobDispatcher.getJob);

    app.post('/api/job', jobDispatcher.create);

    /**
     * @swagger
     * /api/job/<job_id>/update:
     *   get:
     *     description: Updates a job based on id. 
     *     param variable: job_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.patch('/api/job/:job_id/update', jobDispatcher.updateJob);

    /**
     * @swagger
     * /api/location_logs:
     *   get:
     *     description: Retrieves all the location logs 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/location_logs', isLoggedIn, locationLogDispatcher.getLogs);

    /**
     * @swagger
     * /api/location_log?jobId=<job_id>:
     *   get:
     *     description: Retrieves a location logs based on a job id. 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.get('/api/location_log', isLoggedIn, locationLogDispatcher.getByJobId);

    /**
     * @swagger
     * /api/location_log:
     *   get:
     *     description: creates a location log entry 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Succesful request 
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: Request not found 
     *       500:
     *         description: Generic error
     */
    app.post('/api/location_log', isLoggedIn, locationLogDispatcher.create);

    //https://stackoverflow.com/questions/20089582/how-to-get-url-parameter-in-express-node-js
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).send('401, Unauthorized')
    }
    return true;
}