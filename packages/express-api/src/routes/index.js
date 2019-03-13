import StoryRoutes from './story'
import UserRoutes from './user'
import AuthRoutes from './auth'
import CategoryRoutes from './category'
import HashtagRoutes from './hashtag'
import GuideRoutes from './guide'
import PostcardRoutes from './postcard'

export default function bootstrapRoutes(app) {
  app.use('/story', StoryRoutes)
  app.use('/user', UserRoutes)
  app.use('/auth', AuthRoutes)
  app.use('/category', CategoryRoutes)
  app.use('/hashtag', HashtagRoutes)
  app.use('/guide', GuideRoutes)
  app.use('/postcard', PostcardRoutes)
}
