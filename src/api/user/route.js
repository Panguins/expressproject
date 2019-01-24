const express = require('express')
const passport = require('passport');

const controller = require('./controller')

const router = express.Router()


router
    .route('/')
    .get(passport.authenticate('jwt', { session: false }),controller.list)
    .post(passport.authenticate('jwt', { session: false }),controller.create)
  
router
    .param('userId', controller.load)
    .route('/:userId')
    .get(passport.authenticate('jwt', { session: false }),controller.get)
    .patch(passport.authenticate('jwt', { session: false }),controller.update)
    .delete(passport.authenticate('jwt', { session: false }),controller.remove)

// Login
router
    .route('/login')
    .post(passport.authenticate('local'),controller.login)
    .patch(passport.authenticate('local'),controller.update)

// Register
router
    .route('/register')
    .post(controller.registerUser);

module.exports = router

