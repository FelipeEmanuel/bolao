const express = require('express')
const router = express.Router()
const {setPalpite, getPalpitesEsports, getPalpitesFutebol, userPalpitesById} = require('../controllers/palpiteController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').post(protect, setPalpite)
router.route('/futebol').get(protect, getPalpitesFutebol)
router.route('/esports').get(protect, getPalpitesEsports)
router.route('/get/:id').get(protect, isAdmin, userPalpitesById)

module.exports = router
