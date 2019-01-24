const uuid = require('uuid/v1');
const { promisify } = require('es6-promisify');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('./model')


exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id)
    req.locals = {
      user,
    }
    return next()
  } catch (error) {
    return next(error)
  }
}

exports.get = (req, res) => res.json(req.locals.user)

exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body)
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query)
    res.json(users)
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const updatedUser = req.body
    const userInsert = Object.assign(req.locals.user, updatedUser)
    const savedUser = await userInsert.save()
    res.json(savedUser)
  } catch (error) {
    next(error)
  }
}
  
  exports.remove = async (req, res, next) => {
  const {
    user,
  } = req.locals
  
  try {
    const removedUser = await user.remove()
    res.json(removedUser)
  } catch (error) {
    next(error)
  }
}

exports.registerUser = async (req, res) => {
	// Create new user
	const user = new User(req.body);

	// Save it to the DB using passport-local-mongoose plugin
	const register = promisify(User.register.bind(User));
	await register(user, req.body.password);

	// Generate a JWT token and set the header
	const token = await user.generateAuthToken();
	res.header('Authorization', `Bearer ${token}`);

	// Send it back
	res.send(user);
};

exports.login = async (req, res) => {
	// Find the user
	const user = await User.findById(req.user._id);

	// Generate a JWT token and set the header
	const token = await user.generateAuthToken();
	res.header('Authorization', `Bearer ${token}`);

	// Send it back
	res.send(req.user);
};

exports.logout = async (req, res) => {
	// Clear the client cookie on the response
	// TODO

	// Log them out via passport
	req.logout();

	// Send a message for now
	res.send('You logged out!');
};