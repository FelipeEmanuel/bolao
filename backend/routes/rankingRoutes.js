const express = require('express')
const router = express.Router()
const {getRanking} = require('../controllers/rankingController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getRanking)


module.exports = router