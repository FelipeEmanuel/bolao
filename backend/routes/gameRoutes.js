const express = require('express')
const router = express.Router()
const {getGames, setGames, updateGame, deleteGame, getGameById} = require('../controllers/gameController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect, isAdmin, getGames).post(protect, isAdmin, setGames)
router.route('/:id').delete(protect, isAdmin, deleteGame).put(protect, isAdmin, updateGame).get(protect, isAdmin, getGameById)
 
module.exports = router