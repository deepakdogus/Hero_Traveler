import StoryRoutes from './story'
import UserRoutes from './user'
import AuthRoutes from './auth'

export default function bootstrapRoutes(app) {
  app.use('/story', StoryRoutes)
  app.use('/user', UserRoutes)
  app.use('/auth', AuthRoutes)
}
