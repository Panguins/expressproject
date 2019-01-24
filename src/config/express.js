const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../api');
const morgan = require('morgan');
const cors = require('cors');
const { promisify } = require('es6-promisify');
const passport = require('passport');
// Require all passport handlers
require('../handlers/passportLocal');
require('../handlers/passportJwt');


// Express instance @public
const app = express();

// request logging. dev: console | production: file
//app.use(morgan(logs))

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


// Passport middleware
app.use(passport.initialize());
app.use((req, res, next) => {
	req.login = promisify(req.login.bind(req));
	next();
});
// passport.use('facebook', strategies.facebook)
// passport.use('google', strategies.google)

// mount api v1 routes
app.use('/api', routes);

module.exports = app;