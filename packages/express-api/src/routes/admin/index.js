import express from 'express'
import AuthRoutes from './auth'
import UsersRoutes from './users'
import CategoriesRoutes from './categories'
import StoriesRoutes from './stories'
import GuidesRoutes from './guides'
import StatsRoutes from './stats'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use('/users', UsersRoutes)
router.use('/categories', CategoriesRoutes)
router.use('/stories', StoriesRoutes)
router.use('/guides', GuidesRoutes)
router.use('/stats', StatsRoutes)

export default router
