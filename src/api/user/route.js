const express = require('express')
const passport = require('passport');

const controller = require('./controller')

const router = express.Router()


router
    .route('/')
    .get(controller.list)
    .post(controller.create)
  
router
    .param('userId', controller.load)
    .route('/:userId')
    .get(controller.get)
    .patch(controller.update)
    .delete(controller.remove)

// Login
router
    .route('/login')
    .post(passport.authenticate('local'),controller.login);

// Register
router
    .route('/register')
    .post(controller.registerUser);

module.exports = router

