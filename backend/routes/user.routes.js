import express from 'express'
import { loginUser, registerUser, verifyUser, getMe, logoutUser, forgotPassword, resetPassword } from '../controller/user.controller.js'
import {saveTodos, deleteTodo, updateTodo, getTodos} from '../controller/todo.controller.js'
import { isLoggedIn } from '../middleware/auth.middleware.js'
const router = express.Router()

// auth routes
router.post('/register', registerUser)
router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
router.get('/me', isLoggedIn, getMe)
router.post('/logout', isLoggedIn, logoutUser)
router.post('/forgot', forgotPassword)
router.post('/reset/:token', resetPassword)

// todo routes
router.get('/todos', isLoggedIn, getTodos)
router.put('/todos', isLoggedIn, saveTodos)
router.delete('/todos/:id', isLoggedIn, deleteTodo)
router.patch('/todos/:id', isLoggedIn, updateTodo)
export default router