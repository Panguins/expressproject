const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const jwt = require('jsonwebtoken');
const {
  omitBy,
  isNil,
} = require('lodash')



/**
 * User Schema
 * @public
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'Please supply an email address'

  },
}, {
  timestamps: true,
});

// Override toJSON to avoid sending sensitive fields
userSchema.methods.toJSON = function() {
	return {
		email: this.email
	};
};

// Generate an auth token for the user (used for register and login)
userSchema.methods.generateAuthToken = async function() {
	const access = 'auth';

	// Sign the token
	const token = jwt
		.sign(
			{
				_id: this._id.toHexString(),
				access
			},
			process.env.JWT_SECRET
		)
		.toString();

	return token;
};


userSchema.plugin(passportLocalMongoose, {
	usernameField: 'email'
});


userSchema.statics = {

  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec()
      }
      if (user) {
        return user 
      }

      throw new Error({
        message: 'User does not exist'
      })
    } catch (error) {
      throw error
    }
  },

  
  /**
   * List in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number to be skipped.
   * @param {number} limit - Limit number to be returned.
   */
  list({
    page = 1,
    perPage = 10,
    username,
  }) {
    const options = omitBy({
      username,
    }, isNil)

    return this.find(options)
      .sort({
        createdAt: -1,
      })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec()
  },
}
  
module.exports = mongoose.model('User', userSchema)