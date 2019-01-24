const express = require('express');
const postRoutes = require('./post/route');
const userRoutes = require('./user/route');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

//post routes
router.use('/post', postRoutes);


//user routes
router.use('/user', userRoutes);



module.exports = router;
