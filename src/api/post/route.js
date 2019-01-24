const express = require('express')

const controller = require('./controller')

const router = express.Router()

router.param('postId', controller.load)

router
  .route('/')
  .get(controller.list)
  .post(controller.create)
  
router
  .route('/:postId')
  .get(controller.get)
  .patch(controller.update)
  .delete(controller.remove)

module.exports = router
