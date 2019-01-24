const Post = require('./model')

exports.load = async (req, res, next, id) => {
  try {
    const post = await Post.get(id)
    req.locals = {
      post,
    }
    return next()
  } catch (error) {
    return next(error)
  }
}

exports.get = (req, res) => res.json(req.locals.post)

exports.create = async (req, res, next) => {
  try {
    const post = new Post(req.body)
    const savedPost = await post.save()
    res.json(savedPost)
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    const posts = await Post.list(req.query)
    res.json(posts)
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const updatedPost = req.body
    const postInsert = Object.assign(req.locals.post, updatedPost)
    const savedPost = await postInsert.save()
    res.json(savedPost)
  } catch (error) {
    next(error)
  }
}
  
  exports.remove = async (req, res, next) => {
  const {
    post,
  } = req.locals
  
  try {
    const removedPost = await post.remove()
    res.json(removedPost)
  } catch (error) {
    next(error)
  }
}