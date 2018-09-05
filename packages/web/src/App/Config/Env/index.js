import devSettings from './dev'
import prodSettings from './prod'

console.log("devSettings", devSettings)
console.log("prodSettings", prodSettings)
console.log("settings", process.env.NODE_ENV === 'development' ? devSettings : prodSettings)

export default process.env.NODE_ENV === 'development' ? devSettings : prodSettings
