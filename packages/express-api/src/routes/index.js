import StoryRoutes from './story'

export default function bootstrapRoutes(app) {
  app.use('/story', StoryRoutes)
}
