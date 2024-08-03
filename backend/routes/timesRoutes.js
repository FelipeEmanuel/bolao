const express = require('express')
const router = express.Router()
const {getTimes, createTime, updateTime, deleteTime} = require('../controllers/timesController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getTimes).post(protect, createTime)
router.route('/:id').put(protect, isAdmin, updateTime).delete(protect, isAdmin, deleteTime)

module.exports = router