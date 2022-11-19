const express = require('express')
const router = express.Router()
const {getGames, setGames, updateGame, deleteGame} = require('../controllers/gameController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, isAdmin, getGames).post(protect, isAdmin, setGames)
router.route('/:id').delete(protect, isAdmin, deleteGame).put(protect, isAdmin, updateGame)
 
module.exports = router