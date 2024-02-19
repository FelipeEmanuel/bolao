const express = require('express')
const router = express.Router()
const {getConquistas, getConquistasById} = require('../controllers/conquistaController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, getConquistas)
router.route('/:id').get(protect, getConquistasById)


 
module.exports = router
