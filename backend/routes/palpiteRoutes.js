const express = require('express')
const router = express.Router()
const {getPartidas, setPalpite, getUserPalpites, userPalpitesById} = require('../controllers/palpiteController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getPartidas)
router.route('/').post(protect, setPalpite)
router.route('/userPalpites').get(protect, getUserPalpites)
router.route('/get/:id').get(protect, isAdmin, userPalpitesById)

module.exports = router