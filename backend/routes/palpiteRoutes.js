const express = require('express')
const router = express.Router()
const {getPartidas, setPalpite, getUserPalpites} = require('../controllers/palpiteController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getPartidas)
router.route('/').post(protect, setPalpite)
router.route('/userPalpites').get(protect, getUserPalpites)


module.exports = router