import devSettings from './dev'
import prodSettings from './prod'
import stgSettings from './stg'

let env
if (process.env.NODE_ENV === 'staging') {
  env = stgSettings 
}
 else if (process.env.NODE_ENV === 'production') {
  env = prodSettings
}
 else {
  env = devSettings
}

export default env