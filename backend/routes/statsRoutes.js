const express = require('express')
const router = express.Router()
const {getStats, setStats, updateStats} = require('../controllers/statsController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getStats).post(protect, setStats)
router.route('/').put(protect, updateStats)
 
module.exports = router
