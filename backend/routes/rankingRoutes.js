const express = require('express')
const router = express.Router()
const {getRanking, setPontuacao} = require('../controllers/rankingController')
const { protect } = require('../middleware/authMiddleware')

router.route('/:id').get(protect, getRanking)
router.route('/setPontuacao/:id').put(protect, setPontuacao)

module.exports = router