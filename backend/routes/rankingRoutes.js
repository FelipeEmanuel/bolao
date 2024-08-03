const express = require('express')
const router = express.Router()
const {getRanking, setPontuacao, criarRanking, getRankingSemanal, hallTitulos} = require('../controllers/rankingController')
const { protect } = require('../middleware/authMiddleware')

router.route('/getPontuacao/:id').get(protect, getRanking)
router.route('/setPontuacao').put(protect, setPontuacao)
router.route('/criarPontuacao/:id').post(protect, criarRanking)
router.route('/semanal').get(protect, getRankingSemanal)
router.route('/hall-titulos').get(protect, hallTitulos)

module.exports = router
