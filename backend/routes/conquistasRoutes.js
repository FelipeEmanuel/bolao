const express = require('express')
const router = express.Router()
const {getConquistas, getSemanais} = require('../controllers/conquistaController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getConquistas)
router.route('/semanais').get(protect, getSemanais)

 
module.exports = router
