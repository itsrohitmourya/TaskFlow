import express from 'express'
import { loginUser, registerUser, verifyUser, getMe, logoutUser, forgotPassword, resetPassword } from '../controller/user.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/register', registerUser)
router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
router.get('/me', isLoggedIn, getMe)
router.post('/logout', isLoggedIn, logoutUser)
router.post('/forgot', forgotPassword)
router.post('/reset/:token', resetPassword)
router.post('/reset/:token', resetPassword)
export default router