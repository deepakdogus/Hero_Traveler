import StoryRoutes from './story'
import UserRoutes from './user'
import AuthRoutes from './auth'
import CategoryRoutes from './category'
import HashtagRoutes from './hashtag'
import GuideRoutes from './guide'
import AdminRoutes from './admin'
import FilesRoutes from './files'

export default function bootstrapRoutes(app) {
  app.use('/story', StoryRoutes)
  app.use('/user', UserRoutes)
  app.use('/auth', AuthRoutes)
  app.use('/category', CategoryRoutes)
  app.use('/hashtag', HashtagRoutes)
  app.use('/guide', GuideRoutes)
  app.use('/admin', AdminRoutes)
  app.use('/files', FilesRoutes)

  app.get('/', (req, res) => res.json({ success: true }))
}
