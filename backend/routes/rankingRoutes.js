const express = require('express')
const router = express.Router()
const {getRanking, setPontuacao, criarRanking} = require('../controllers/rankingController')
const { protect } = require('../middleware/authMiddleware')

router.route('/getPontuacao/:id').get(protect, getRanking)
router.route('/setPontuacao/:id').put(protect, setPontuacao)
router.route('/criarPontuacao/:id').post(protect, criarRanking)

module.exports = router