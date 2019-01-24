const mongoose = require('mongoose')
const {
  omitBy,
  isNil,
} = require('lodash')

/**
 * Post Schema
 * @public
 */
const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  author:{
    type: String,
  },
  summery: {
    type: String,
  },
  content: {
    type: String,
  },
}, {
  timestamps: true,
})

postSchema.statics = {

  async get(id) {
    try {
      let post

      if (mongoose.Types.ObjectId.isValid(id)) {
        post = await this.findById(id).exec()
      }
      if (post) {
        return post
      }

      throw new Error({
        message: 'Post does not exist'
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
    title,
  }) {
    const options = omitBy({
      title,
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
  
module.exports = mongoose.model('Post', postSchema)