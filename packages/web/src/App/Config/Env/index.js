import devSettings from './dev'
import prodSettings from './prod'

export default process.env.NODE_ENV === 'development' ? devSettings : prodSettings
