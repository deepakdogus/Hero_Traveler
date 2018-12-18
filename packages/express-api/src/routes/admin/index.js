import express from 'express'
import AuthRoutes from './auth'
import UsersRoutes from './users'
import CategoriesRoutes from './categories'
import StoriesRoutes from './stories'
import GuidesRoutes from './guides'

const router = express.Router()

router.use('/auth', AuthRoutes)
router.use('/users', UsersRoutes)
router.use('/categories', CategoriesRoutes)
router.use('/stories', StoriesRoutes)
router.use('/guides', GuidesRoutes)

export default router
