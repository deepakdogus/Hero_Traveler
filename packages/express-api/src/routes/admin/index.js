import express from 'express'
import AuthRoutes from './auth'
import UsersRoutes from './users'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use('/users', UsersRoutes)

export default router
