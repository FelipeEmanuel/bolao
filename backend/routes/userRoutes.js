const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
  forgotPassword,
  getUserById
} = require('../controllers/userController')
const { protect, isAdmin } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.post('/novasenha', forgotPassword)
router.get('/user/:id', protect, getUserById)

module.exports = router