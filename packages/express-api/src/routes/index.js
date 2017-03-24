import StoryRoutes from './story'
import UserRoutes from './user'
import AuthRoutes from './auth'
import CategoryRoutes from './category'

export default function bootstrapRoutes(app) {
  app.use('/story', StoryRoutes)
  app.use('/user', UserRoutes)
  app.use('/auth', AuthRoutes)
  app.use('/category', CategoryRoutes)
}
